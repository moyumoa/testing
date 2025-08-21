<template>
  <view v-if="visible" class="cs-mask" @tap="onMaskTap">
    <!-- 底部弹层 -->
    <view
      class="cs-panel"
      :style="{ height: isUnfold ? panelFullHeight : panelHeight }"
      @tap.stop
    >
      <!-- 头部 -->
      <view class="cs-header">
        <view class="cs-header__title">
          <text class="cs-header__title-t" :number-of-lines="2">{{ title }}</text>
        </view>

        <view class="cs-header__btn" @tap="toggleUnfold">
          <text class="cs-header__btn-icon">{{ isUnfold ? '⇩' : '⇧' }}</text>
        </view>
        <view class="cs-header__btn" @tap="closePanel">
          <text class="cs-header__btn-icon">✕</text>
        </view>
      </view>

      <!-- 内容 -->
      <view class="cs-content">
        <scroll-view
          :scroll-y="true"
          class="cs-scroll"
          :lower-threshold="80"
          @scrolltolower="onReachBottom"
        >
          <block v-if="list.length">
            <view class="cs-item" v-for="(item, idx) in list" :key="item.id || idx">
              <view class="cs-item__row">
                <image :src="item.avatar || defaultAvatar" class="cs-avatar"></image>
                <view class="cs-item__right">
                  <text class="cs-name">{{ item.nickname || '未知用户' }}</text>
                  <text class="cs-content-t">{{ item.content }}</text>
                  <view class="cs-meta">
                    <text class="cs-meta-t">{{ item.replyTime || '' }}</text>
                    <text class="cs-meta-t">· {{ item.ipAddress || '未知IP' }}</text>
                    <text class="cs-reply" @tap="onReply(item)">回复</text>
                  </view>
                </view>
              </view>

              <!-- 子评论 -->
              <view
                v-for="child in (item.children || [])"
                :key="child.id"
                class="cs-item cs-item--child"
              >
                <view class="cs-item__row">
                  <image :src="child.avatar || defaultAvatar" class="cs-avatar cs-avatar--sm"></image>
                  <view class="cs-item__right">
                    <text class="cs-name">{{ child.nickname || '未知用户' }}</text>
                    <text class="cs-content-t">
                      <block v-if="child.parentNickName">回复@{{ child.parentNickName }}：</block>{{ child.content }}
                    </text>
                    <view class="cs-meta">
                      <text class="cs-meta-t">{{ child.replyTime || '' }}</text>
                      <text class="cs-meta-t">· {{ child.ipAddress || '未知IP' }}</text>
                      <text class="cs-reply" @tap="onReply(item, child)">回复</text>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 展开剩余子回复 -->
              <view
                v-if="item.replyCount > 0"
                class="cs-more"
                @tap="unfold(item)"
              >
                <text class="cs-more-t">展开 {{ item.replyCount }} 条回复</text>
              </view>
            </view>

            <!-- 底部加载/没有更多 -->
            <view class="cs-footer" v-if="!finished">
              <text class="cs-footer-t">加载中…</text>
            </view>
            <view class="cs-footer" v-else>
              <text class="cs-footer-t">没有更多了</text>
            </view>
          </block>

          <!-- 空状态 -->
          <view class="cs-empty" v-else>
            <text class="cs-empty-t">😌 貌似还没有评论呢</text>
            <text class="cs-empty-t">快来发送第一条评论抢占沙发吧😘</text>
            <view v-if="!isFocus" class="cs-empty-btn" @tap="focusInput">发评论</view>
          </view>
        </scroll-view>
      </view>

      <!-- 输入区 -->
      <view class="cs-inputbar" :style="{ paddingBottom: safeBottom }">
        <input
          class="cs-input"
          :placeholder="placeholder"
          :value="state"
          confirm-type="send"
          :focus="inputAutoFocus"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="e => (state = e.detail.value)"
          @confirm="addComment"
        />
        <view class="cs-send" @tap="addComment">发送</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 可复用评论组件（uni-app, Vue2）
 * Props:
 *  - visible(Boolean): 是否显示面板（v-model）
 *  - title(String): 标题
 *  - articleId([Number,String]): 文章/实体ID（用于拉取&新增评论）
 *  - pageSize(Number): 每页条数，默认10
 *
 * Events:
 *  - update:visible(Boolean): 关闭/打开
 *  - change-count(Number): 新增评论后通知父级累计数 +1（或返回最新总数由父级自行处理）
 *
 * 依赖接口（保持你现有的 API 形状）：
 *  - getCommentListApi({ id, level, sort, page, limit })
 *  - addCommentApi({ articleId, content, parentCommentId, parentUserId })
 */
import { mapGetters } from 'vuex'
import { addComment as addCommentApi, getCommentList as getCommentListApi } from '@/config/api'

export default {
  name: 'CommentSheet',
  props: {
    visible: { type: Boolean, default: true },
    title: { type: String, default: '' },
    articleId: { type: [Number, String], required: true },
    pageSize: { type: Number, default: 10 }
  },
  data () {
    return {
      list: [],
      paging: { page: 1, limit: this.pageSize },
      finished: false,

      // 输入相关
      state: '',
      placeholder: '理性互动, 文明你我TA',
      isFocus: false,
      inputAutoFocus: false,

      // 回复上下文
      replyInfo: {},   // 当前回复的顶层评论
      levelInfo: {},   // 回复的目标子楼（可空）

      // 展开高度
      isUnfold: false,

      // 兜底头像
      defaultAvatar: 'https://dummyimage.com/80x80/ddd/fff.png&text=U'
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    safeBottom () {
      // H5 小程序端处理不同，简单兜底一个数值；若用 uni.getSystemInfo 可更精确
      // #ifdef MP
      return '12px'
      // #endif
      // #ifndef MP
      return 'env(safe-area-inset-bottom, 12px)'
      // #endif
    },
    panelHeight () {
      // 75% 高度
      return '75vh'
    },
    panelFullHeight () {
      return 'calc(100vh - var(--window-top, 0px))'
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.resetReply()
        this.inputAutoFocus = false
        this.initFirstPage()
      } else {
        // 关闭时还原展开状态
        this.isUnfold = false
      }
    },
    pageSize (n) {
      this.paging.limit = n
    }
  },
  methods: {
    async initFirstPage () {
      this.list = []
      this.finished = false
      this.paging = { page: 1, limit: this.pageSize }
      await this.fetchList()
    },

    async fetchList () {
      const { page, limit } = this.paging
      const res = await getCommentListApi({
        id: this.articleId,
        level: 0,
        sort: 0,
        page,
        limit
      })
      const rows = (res?.data?.list || []).map(r => ({ ...r, children: r.children || [] }))
      if (page === 1) {
        this.list = rows
      } else {
        this.list = this.list.concat(rows)
      }
      this.finished = rows.length < limit
    },

    async onReachBottom () {
      if (this.finished || !this.list.length) return
      this.paging.page += 1
      await this.fetchList()
    },

    async unfold (topItem) {
      const idx = this.list.findIndex(v => v.id === topItem.id)
      if (idx === -1) return
      const res = await getCommentListApi({
        id: topItem.id,
        level: 1,
        sort: 0,
        page: 1,
        limit: 10
      })
      const dlist = (res?.data?.list || [])
      const merged = {
        ...this.list[idx],
        children: [...(this.list[idx].children || []), ...dlist],
        replyCount: Math.max((this.list[idx].replyCount || 0) - dlist.length, 0)
      }
      const copy = this.list.slice()
      copy.splice(idx, 1, merged)
      this.list = copy
    },

    onReply (topItem, childItem) {
      this.replyInfo = topItem || {}
      this.levelInfo = childItem || {}
      this.state = ''
      this.placeholder = this.levelInfo?.id
        ? `回复@${this.levelInfo.nickname || ''}`
        : `回复@${this.replyInfo.nickname || ''}`
      this.focusInput()
    },

    focusInput () {
      // input 的 focus 受平台限制，这里配合 data 开关
      this.$nextTick(() => { this.inputAutoFocus = true })
    },

    handleFocus () { this.isFocus = true },
    handleBlur () { this.isFocus = false },

    resetReply () {
      this.state = ''
      this.placeholder = '理性互动, 文明你我TA'
      this.replyInfo = {}
      this.levelInfo = {}
    },

    async addComment () {
      const content = (this.state || '').trim()
      if (!content) return
      const params = {
        articleId: this.articleId,
        content,
        parentCommentId: this.replyInfo?.id || null,
        parentUserId: this.replyInfo?.userId || null
      }
      const res = await addCommentApi(params)
      const newId = res?.data

      // 本地插入一条，提升体验
      const me = this.getUserInfo || {}
      const now = '刚刚'
      if (this.replyInfo?.id) {
        const idx = this.list.findIndex(v => v.id === this.replyInfo.id)
        if (idx > -1) {
          const copy = this.list.slice()
          const children = copy[idx].children ? copy[idx].children.slice() : []
          children.unshift({
            id: newId,
            avatar: me.avatar || '',
            nickname: me.nickname || '未知用户',
            parentNickName: this.levelInfo?.id ? this.levelInfo.nickname : undefined,
            content,
            replyTime: now,
            ipAddress: '未知IP'
          })
          copy[idx] = { ...copy[idx], children }
          copy[idx].replyCount = Math.max((copy[idx].replyCount || 0) - 1, 0)
          this.list = copy
        }
      } else {
        this.list = [{
          id: newId,
          avatar: me.avatar || '',
          nickname: me.nickname || '未知用户',
          content,
          replyTime: now,
          ipAddress: '未知IP',
          children: []
        }, ...this.list]
      }

      this.$emit('change-count', 1)
      this.resetReply()
    },

    toggleUnfold () { this.isUnfold = !this.isUnfold },

    onMaskTap () {
      // 点击遮罩关闭
      this.closePanel()
    },

    closePanel () {
      this.$emit('update:visible', false)
      this.resetReply()
    }
  }
}
</script>

<style lang="scss" scoped>
.cs-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.25);
  display: flex;
  justify-content: flex-end;
  z-index: 9999;
}

.cs-panel {
  width: 100%;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  box-shadow: 0 -6rpx 24rpx rgba(0,0,0,.06);
  display: flex;
  flex-direction: column;
}

.cs-header {
  flex-direction: row;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 12rpx 20rpx;
}
.cs-header__title { flex: 1; min-height: 44rpx; display: flex; align-items: center; }
.cs-header__title-t { font-size: 26rpx; color: #2a69a8; width: 95%; }
.cs-header__btn { width: 60rpx; height: 44rpx; display: flex; align-items: center; justify-content: center; }
.cs-header__btn-icon { color: #272727; font-size: 28rpx; }

.cs-content { flex: 1; background: #f9f9f9; }
.cs-scroll { height: 100%; }

.cs-item { padding: 20rpx; }
.cs-item__row { display: flex; flex-direction: row; }
.cs-item--child { margin-left: 100rpx; margin-top: 16rpx; }

.cs-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; border: 1rpx solid #ddd; }
.cs-avatar--sm { width: 60rpx; height: 60rpx; }

.cs-item__right { flex: 1; margin-left: 20rpx; }
.cs-name { font-size: 26rpx; color: #666; }
.cs-content-t { font-size: 28rpx; color: #333; margin-top: 12rpx; line-height: 1.6; }

.cs-meta { display: flex; flex-direction: row; margin-top: 12rpx; align-items: center; }
.cs-meta-t { font-size: 24rpx; color: #999; margin-right: 12rpx; }
.cs-reply { font-size: 24rpx; color: #f5861c; margin-left: 16rpx; }

.cs-more { margin-left: 100rpx; margin-top: 16rpx; }
.cs-more-t { font-size: 24rpx; color: #999; }

.cs-footer { padding: 20rpx 0; align-items: center; display: flex; justify-content: center; }
.cs-footer-t { font-size: 24rpx; color: #aaa; }

.cs-empty { align-items: center; display: flex; flex-direction: column; padding: 120rpx 0; }
.cs-empty-t { font-size: 26rpx; color: #aaa; margin-bottom: 12rpx; }
.cs-empty-btn {
  font-size: 26rpx; margin-top: 40rpx; background: #f5861c; color: #fff;
  padding: 12rpx 32rpx; border-radius: 12rpx;
}

.cs-inputbar {
  background: #fff;
  border-top: 1rpx solid #fbfbfb;
  padding: 12rpx 20rpx  env(safe-area-inset-bottom, 12rpx);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.cs-input {
  flex: 1;
  min-height: 88rpx;
  background: #f5f5f5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}
.cs-send {
  margin-left: 16rpx;
  padding: 10rpx 26rpx;
  background: #f5861c;
  color: #fff;
  border-radius: 999rpx;
  font-size: 26rpx;
}
</style>