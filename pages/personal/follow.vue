<template>
  <view class="pagecontainer">
    <view class="navbar">
      <view class="navbar-left" @tap="goback">
        <u-icon name="arrow-left" color="#1a1a1a" size="21" />
      </view>
      <view class="navbar-center">
        <text class="navbar-center-t" :class="{ 'navbar-center-active': currentNav === 1 }"
          @tap="changeNav(1)">关注</text>
        <text class="navbar-center-t" :class="{ 'navbar-center-active': currentNav === 2 }"
          @tap="changeNav(2)">粉丝</text>
      </view>
    </view>

    <view class="pagebreak">
      <view class="pinfo" v-for="(item, index) in paginated.data" :key="index" @tap="oper('detail', item)">
        <view class="pinfo-top">
          <view class="pinfo-top-l">
            <image class="pinfo-top-l-pic" :src="item.appUser.avatar" v-if="item.appUser" />
          </view>
          <view class="pinfo-top-r">
            <text class="pinfo-top-r-t" v-if="item.appUser">{{ item.appUser.nickName }}</text>
            <view class="pinfo-top-r-t2" v-if="item.appUser.isVip">
              <u-icon label="高级会员" size="16" labelColor="#ccc" labelSize="12" name="/static/per/hy-icon.png" />
            </view>
          </view>

          <view class="pinfo-top-position" :class="{'pinfo-top-position-active': item.status === STATUS.NONE}" @tap.stop="oper('follow', item)">
            {{ getFollowText(item) }} {{ item.status }}
          </view>

        </view>
      </view>
    </view>

    <u-empty v-if="!paginated.data.length" mode="data" text="暂无数据" />
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { createPaginated } from '@mvmoo/optionsapi'
import { formatNum } from '@mvmoo/us'

const STATUS = {
  MUTUAL: 1,     // 互相关注
  FOLLOWED: 2,   // 已关注（单向）
  NONE: 4        // 未关注
}

export default {
  data: () => ({
    currentNav: 1, // 当前选中的导航，1为女郎列表，2为待上架
    paginated: null, // 分页数据
    finished: false, // 是否加载完毕
    STATUS: STATUS // 状态常量
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad ({ type }) {
    this.currentNav = type ? parseInt(type) : 1; // 设置当前导航
    this.paginated = createPaginated(uni.$api.followList, null, {
      pageKey: 'pageNum',
      limitKey: 'pageSize',
      extraList: res => res.rows,
      extraTotal: res => res.total,
      defaultPagination: { page: 1, limit: 20 },
      transformData: (rows, res, query) => {
        console.log('rows', rows)
        return rows.map(item => ({
          ...item,
          id: item.appUser.id,
          status: item.status === 1 ? item.status : this.currentNav === 1 ? STATUS.FOLLOWED : STATUS.NONE, // 确保有状态
        }))
      }
    }, 'concat')
    this.reload()
    const { limit, count } = this.paginated?.pagination
    this.finished = count < limit
    console.log('paginated', this.paginated)
  },
  methods: {
    ...mapActions(['updateUserInfo']),

    async reload () {
      if (this.currentNav === 1) {
        this.paginated.params = { userId: this.getUserInfo.id }
        await this.paginated.reload(null, 1)
      } else {
        this.paginated.params = { attentionId: this.getUserInfo.id }
        await this.paginated.reload(null, 1)
      }
    },

    getFollowText (item) {
      const { MUTUAL, FOLLOWED, NONE } = this.STATUS
      if (item.status === MUTUAL) return '互相关注'
      if (item.status === FOLLOWED) return '已关注'
      if (item.status === NONE) return '关注'
      return ''
    },

    oper (type, item) {
      ({
        'follow': async () => {
          const { id: userId } = this.getUserInfo
          const attentionId = item.appUser.id
          const { MUTUAL, FOLLOWED, NONE } = this.STATUS

          // 如果当前是“已关注”或“互相关注” → 执行取消关注
          if (item.status === MUTUAL || item.status === FOLLOWED) {
            await uni.$api.unfollowUser({ userId, attentionId })
            // ↓↓↓ 关键：根据所在页判断目标状态
            // item.status = this.currentNav === 1 ? NONE : NONE
            const result = await this.getUserRelation(attentionId)
            item.status = result === NONE ? NONE : MUTUAL
            uni.$toast('已取消关注')
          }

          // 如果当前是“未关注” → 执行关注
          else if (item.status === NONE) {
            await uni.$api.followUser({ userId, attentionId })
            // ↓↓↓ 关键：根据所在页判断目标状态
            // item.status = this.currentNav === 2 ? MUTUAL : FOLLOWED
            const result = await this.getUserRelation(attentionId)
            item.status = result === MUTUAL ? MUTUAL : FOLLOWED
            uni.$toast('已关注')
          }

          // await this.getUserRelation(item.appUser.id)
          // console.log('操作结果', this.getUserRelation(item.appUser.id))
        },
        detail: () => {
          // uni.navigateTo({ url: `/pages/personal/detail?id=${item.id}&source=mc` })
          uni.navigateTo({ url: `/pages/personal/detail?userId=${item.id}` })
          // uni.$api.authDetailById({ id: item.id }).then(res => {
          //   console.log('女郎详情', res)
          // })
        }
      }[type]?.())
    },

    // 获取自己与他人的关系
    async getUserRelation (id) {
      const res = await uni.$api.userRelation({ userId: this.getUserInfo.id, customerId: id })
      return res?.data?.attion?.status || 4
    },

    goback () {
      uni.navigateBack({
        delta: 1
      })
    },

    changeNav (nav) {
      this.currentNav = nav;
      // 这里可以添加切换导航时的逻辑
      console.log('切换到导航:', nav);
      this.reload()
    }

  },
  async onReachBottom () {
    if (this.finished) return
    const { page, limit, total, count } = this.paginated.pagination
    this.paginated.onChangePage(page + 1, limit)
    this.finished = count < limit
  },
}
</script>

<style lang="scss" scoped>
.pagecontainer {
  overflow: hidden;
  padding-top: 44px;
  padding-bottom: calc(44px + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  min-height: calc(100dvh - 88px - env(safe-area-inset-bottom));
}

.navbar {
  position: fixed;
  top: 0;
  left: var(--window-left);
  right: var(--window-right);
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  color: #fff; // 设置文字颜色
  background-color: #fff;

  &-left {
    flex-shrink: 0;
    padding-left: 12px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;

    &-t {
      width: 40px;
      text-align: center;
      font-size: 12px;
      color: #808080;
      transition: background-color 0.25s, color 0.25s;

      &-active {
        background-color: #60B95D;
        color: #fff;
      }
    }
  }

  &-center {
    flex: 1;
    width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 52px;

    &-t {
      font-size: 15px;
      color: #ADB5C4;
      margin-right: 12px;

      &:last-child {
        margin-right: 0;
      }
    }

    &-active {
      color: #1E2531;
      font-weight: bold;
    }
  }

  &-right {
    margin-right: 16px;
    flex-shrink: 0;
    width: 60px;
    height: 24px;
    border-radius: 16px;
    background: #72A5FD;

    display: flex;
    align-items: center;
    justify-content: center;

    &-t {
      font-size: 12px;
      color: #fff;
    }
  }
}

.pinfo {
  position: relative;
  padding: 16px 24px 16px;

  &-top {
    position: relative;
    display: flex;
    z-index: 3;

    &-l {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      border: 1px solid #e7e7e7;
      box-sizing: border-box;

      &-pic {
        width: 100%;
        height: 100%;
      }
    }

    &-r {
      display: flex;
      flex-direction: column;
      justify-content: center;

      &-t {
        font-size: 14px;
        color: #1a1a1a;
      }

      &-t2 {
        font-size: 12px;
        color: #333;
        margin-top: 5px;
        // opacity: 0.8;
      }
    }

    &-position {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      // padding: 5px 12px;
      width: 64px;
      height: 32px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #F5F5F5;
      font-size: 12px;
      color: #ADB5C4;

      &-active {
        background-color: #72A5FD;
        font-size: 14px;
        color: #FFFFFF;
      }

    }
  }


  &-center {
    display: flex;
    // justify-content: space-between;
    // margin-top: 16px;

    padding: 16px 0;

    &-item {
      flex-shrink: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      &-t {
        font-size: 18px;
        color: #555;
        font-weight: 500;
        margin-bottom: 2px;
      }

      &-t2 {
        font-size: 12px;
        color: #555;
        opacity: 0.5;
      }
    }
  }
}
</style>