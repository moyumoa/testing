<template>
  <view class="ic-wrap">
    <!-- 标题（可选） -->
    <view v-if="title" class="ic-header">
      <text class="ic-header-t">{{ title }}</text>
      <text class="ic-header-sub" v-if="totalCount >= 0">（{{ totalCount }}）</text>
    </view>

    <!-- 列表 -->
    <view v-if="list.length">
      <view class="ic-item" v-for="(item, idx) in list" :key="item.id || idx">
        <view class="ic-row">
          <image :src="item.avatar || defaultAvatar" class="ic-avatar"></image>
          <view class="ic-right">
            <text class="ic-name">{{ item.nickname || '未知用户' }}</text>
            <text class="ic-content">{{ item.content }}</text>
            <view class="ic-meta">
              <text class="ic-meta-t">{{ item.replyTime || '' }}</text>
              <text class="ic-meta-t">· {{ item.ipAddress || '未知IP' }}</text>
              <text class="ic-reply" @tap="onReply(item)">回复</text>
            </view>
          </view>
        </view>

        <!-- 子评论 -->
        <view class="ic-item ic-item--child" v-for="child in (item.children || [])" :key="child.id">
          <view class="ic-row">
            <image :src="child.avatar || defaultAvatar" class="ic-avatar ic-avatar--sm"></image>
            <view class="ic-right">
              <text class="ic-name">{{ child.nickname || '未知用户' }}</text>
              <text class="ic-content">
                <block v-if="child.parentNickName">回复@{{ child.parentNickName }}：</block>{{ child.content }}
              </text>
              <view class="ic-meta">
                <text class="ic-meta-t">{{ child.replyTime || '' }}</text>
                <text class="ic-meta-t">· {{ child.ipAddress || '未知IP' }}</text>
                <text class="ic-reply" @tap="onReply(item, child)">回复</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 展开剩余子回复 -->
        <view v-if="item.replyCount > 0" class="ic-more" @tap="unfold(item)">
          <text class="ic-more-t">展开 {{ item.replyCount }} 条回复</text>
        </view>
      </view>

      <!-- 底部“加载更多” -->
      <view class="ic-footer">
        <view class="ic-loadmore" :disabled="loading || finished" @tap="loadMore">
          <block v-if="loading">加载中…</block>
          <block v-else-if="finished">没有更多了</block>
          <block v-else>加载更多</block>
        </view>
      </view>
    </view>

    <!-- 空态 -->
    <view v-else class="ic-empty">
      <text class="ic-empty-t">😌 貌似还没有评论呢</text>
      <text class="ic-empty-t">快来发送第一条评论抢占沙发吧😘</text>
      <view class="ic-empty-btn" @tap="focusInput" v-if="false">发评论</view>
    </view>

    <!-- 输入区（页面内，不悬浮） -->
    <view class="ic-inputbar">
      <input class="ic-input" :placeholder="placeholder" :value="state" confirm-type="send" :focus="inputAutoFocus"
        @focus="handleFocus" @blur="handleBlur" @input="e => (state = e.detail.value)" @confirm="addComment" />
      <view class="ic-send" @tap="addComment">发送</view>
    </view>
  </view>
</template>

<script>
/**
 * 页面内嵌评论组件（uni-app, Vue2）
 * Props:
 *  - articleId([Number,String]): 文章/实体ID
 *  - title(String): 可选标题
 *  - pageSize(Number): 每页条数，默认10
 *  - autoLoad(Boolean): 是否自动加载第一页，默认true
 *
 * Events:
 *  - change-count(Number): 新增评论后通知父级 +1
 *
 * 依赖接口（与你现有保持一致）：
 *  - getCommentListApi({ id, level, sort, page, limit })
 *  - addCommentApi({ articleId, content, parentCommentId, parentUserId })
 */
import { mapGetters } from 'vuex'
import { addComment as addCommentApi, getCommentList as getCommentListApi } from '@/config/api'

export default {
  name: 'InlineComments',
  props: {
    articleId: { type: [Number, String], required: true },
    title: { type: String, default: '' },
    pageSize: { type: Number, default: 10 },
    autoLoad: { type: Boolean, default: true }
  },
  data () {
    return {
      list: [],
      paging: { page: 1, limit: this.pageSize },
      finished: false,
      loading: false,

      // 输入相关
      state: '',
      placeholder: '理性互动, 文明你我TA',
      isFocus: false,
      inputAutoFocus: false,

      // 回复上下文
      replyInfo: {},
      levelInfo: {},

      // 统计（可选，若后端返回总数可在 fetch 时赋值）
      totalCount: -1,

      defaultAvatar: 'https://dummyimage.com/80x80/ddd/fff.png&text=U'
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  watch: {
    pageSize (n) {
      this.paging.limit = n
    },
    articleId: {
      immediate: true,
      handler () {
        if (this.autoLoad) this.initFirstPage()
      }
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
      if (this.loading) return
      this.loading = true
      const { page, limit } = this.paging
      try {
        const res = await getCommentListApi({
          id: this.articleId,
          level: 0,
          sort: 0,
          page,
          limit
        })
        const rows = (res?.data?.list || []).map(r => ({ ...r, children: r.children || [] }))
        if (typeof res?.data?.total === 'number') this.totalCount = res.data.total
        if (page === 1) this.list = rows
        else this.list = this.list.concat(rows)
        this.finished = rows.length < limit
      } finally {
        this.loading = false
      }
    },

    async loadMore () {
      if (this.finished || this.loading) return
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
      // const res = await addCommentApi(params)
      // const newId = res?.data
      const newId = Date.now() // 模拟新评论ID
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

      if (this.totalCount >= 0) this.totalCount += 1
      this.$emit('change-count', 1)
      this.resetReply()
    }
  }
}
</script>

<style lang="scss" scoped>
.ic-wrap {
  width: 100%;
}

.ic-header {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 0.5px solid #f0f0f0;
}

.ic-header-t {
  font-size: 14px;
  color: #2a69a8;
}

.ic-header-sub {
  margin-left: 4px;
  font-size: 12px;
  color: #999;
}

.ic-item {
  padding: 10px;
}

.ic-row {
  display: flex;
  flex-direction: row;
}

.ic-item--child {
  margin-left: 44px;
  // margin-top: 8px;
}

.ic-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.5px solid #ddd;
}

.ic-avatar--sm {
  width: 30px;
  height: 30px;
}

.ic-right {
  flex: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.ic-name {
  font-size: 13px;
  color: #666;
}

.ic-content {
  font-size: 14px;
  color: #333;
  margin-top: 6px;
  line-height: 1.6;
}

.ic-meta {
  display: flex;
  flex-direction: row;
  margin-top: 6px;
  align-items: center;
}

.ic-meta-t {
  font-size: 12px;
  color: #999;
  margin-right: 6px;
}

.ic-reply {
  font-size: 12px;
  color: #f5861c;
  margin-left: 8px;
}

.ic-more {
  margin-left: 50px;
  margin-top: 8px;
}

.ic-more-t {
  font-size: 12px;
  color: #999;
}

.ic-footer {
  padding: 10px;
  display: flex;
  justify-content: center;
}

.ic-loadmore {
  font-size: 13px;
  color: #666;
  background: #f7f7f7;
  padding: 6px 12px;
  border-radius: 4px;
}

.ic-empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 40px 0;
}

.ic-empty-t {
  font-size: 13px;
  color: #aaa;
  margin-bottom: 6px;
}

.ic-empty-btn {
  font-size: 13px;
  margin-top: 18px;
  background: #f5861c;
  color: #fff;
  padding: 5px 14px;
  border-radius: 6px;
}

.ic-inputbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 0.5px solid #fbfbfb;
  padding: 6px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ic-input {
  flex: 1;
  min-height: 44px;
  background: #f5f5f5;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 14px;
}

.ic-send {
  margin-left: 8px;
  padding: 5px 13px;
  background: #f5861c;
  color: #fff;
  border-radius: 999px;
  font-size: 13px;
}
</style>