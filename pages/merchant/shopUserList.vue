<template>
  <view class="pagecontainer">
    <view class="navbar">
      <view class="navbar-left" @tap="goback">
        <u-icon name="arrow-left" color="#1a1a1a" size="21" />
      </view>
      <view class="navbar-center">
        <text class="navbar-center-t" :class="{ 'navbar-center-active': currentNav === 1 }"
          @tap="changeNav(1)">女郎列表</text>
        <text class="navbar-center-t" :class="{ 'navbar-center-active': currentNav === 0 }"
          @tap="changeNav(0)">待上架</text>
      </view>
    </view>

    <view class="crads" v-for="(item, index) in paginated.data" :key="index" @tap="oper('detail', item)">
      <view class="crads-top">
        <text class="crads-top-rt">成交单数: {{ item.dealCount }}</text>
      </view>
      <view class="crads-body">
        <view class="crads-body-l">
          <image class="crads-body-l-img" :src="item.avatar" />
        </view>
        <view class="crads-body-content">
          <view class="crads-body-content-item">
            <text class="crads-body-content-item-name">{{ item.nickName }}</text>
            <text class="crads-body-content-item-tag">{{ item.ageGroup }}</text>
            <text class="crads-body-content-item-tag" v-if="item.status === 1">在线</text>
            <text class="crads-body-content-item-tag crads-body-content-item-tag-rest" v-else>休息</text>
          </view>
          <view class="crads-body-content-top-item">
            <text class="crads-body-content-top-item-t">{{ item.height }}cm</text>
            <text class="crads-body-content-top-item-t2">{{ item.size }}</text>
          </view>
          <view class="crads-body-content-top-item">
            <text class="crads-body-content-top-item-t3">消费情况: </text>
            <text class="crads-body-content-top-item-t4">{{ item.minCharge }}/p</text>
          </view>
        </view>
      </view>
      <view class="crads-bottom">
        <view class="crads-bottom-l">
          <u-icon name="map" color="#222" size="16" style="margin-right: 2px;" />
          <text class="crads-bottom-l-t">{{ item.activeCity }}</text>
        </view>
        <view class="crads-bottom-rtbtn" v-if="currentNav === 1" @tap="oper('below', item)">下架</view>
        <view class="crads-bottom-rtbtn crads-bottom-rtbtn-active" v-if="currentNav === 0" @tap="oper('up', item)">上架
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


export default {
  data: () => ({
    currentNav: 1, // 当前选中的导航，1为女郎列表，2为待上架
    paginated: null, // 分页数据
    finished: false, // 是否加载完毕
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad () {
    this.paginated = createPaginated(uni.$api.authListByShop, { userId: this.getUserInfo.id }, {
      pageKey: 'pageNum',
      limitKey: 'pageSize',
      extraList: res => res.rows,
      extraTotal: res => res.total,
      defaultPagination: { page: 1, limit: 20 },
      transformData: (rows, res, query) => {
        console.log('rows', rows)
        return rows.map(item => ({
          ...item,
          ageGroup: this.ageGroup(item.birthday), // 年龄段
          onlineTime: this.onlineTime(item.seconds), // 在线时间

          authStatusTxt: { 0: '未认证', 1: '认证中', 2: '已认证', 3: '认证失败' }[item.authStatus] || '未知状态',
          isShowbtn: item.authStatus === 3, // 是否显示修改按钮
        }))
      }
    }, 'concat')
    await this.paginated.reload({ putStatus: this.currentNav }, 1)
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    /* 根据传入的出生日计算年龄段 例如:85后 90后 00后 10后 */
    ageGroup (birthday) {
      const year = new Date(birthday).getFullYear();
      if (isNaN(year)) return '未知';
      const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
      return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
    },

    /* 根据秒数计算在线时间分钟/小时/天数 */
    onlineTime (Second) {
      if (Second < 60) return `${Second}秒`;
      if (Second < 3600) return `${Math.floor(Second / 60)}分钟`;
      if (Second < 86400) return `${Math.floor(Second / 3600)}小时`;
      return `${Math.floor(Second / 86400)}天`;
    },

    oper (type, item) {
      ({
        up: async () => {
          await uni.$api.authStatus({ projectId: item.id, status: 1 })
          uni.showToast({ title: '上架成功', icon: 'success' });
          this.paginated.reload(null, 1);
        },
        below: async () => {
          await uni.$api.authStatus({ projectId: item.id, status: 0 })
          uni.showToast({ title: '下架成功', icon: 'success' });
          this.paginated.reload(null, 1);
        },
        detail: () => {
          uni.navigateTo({ url: `/pages/personal/detail?id=${item.id}&source=mc` })
          uni.$api.authDetailById({ id: item.id }).then(res => {
            console.log('女郎详情', res)
          })
        }
      }[type]?.())
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
      this.paginated.reload({ putStatus: this.currentNav }, 1)
    }

  },
  async onReachBottom () {
    const { page, limit, total, count } = this.paginated.pagination
    if (count < limit) return
    this.paginated.onChangePage(page + 1, limit)
  },
}
</script>

<style lang="scss" scoped>
.pagecontainer {
  overflow: hidden;
  padding-top: 44px;
  padding-bottom: calc(44px + env(safe-area-inset-bottom));
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

.crads {
  margin: 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #EFF2F6 0%, #EEEAF4 100%);

  &-top {
    display: flex;
    justify-content: space-between;

    &-lt {
      font-size: 14px;
      color: #72A5FD;
      margin: 12px;
    }

    &-rt {
      font-size: 12px;
      height: 28px;
      color: #fff;
      background-color: #72A5FD;
      padding: 0 16px;
      border-radius: 0 12px 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &-body {
    display: flex;
    align-items: center;
    padding: 0 12px;

    &-l {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;

      &-img {
        width: 100%;
        height: 100%;
      }
    }

    &-content {
      flex: 1;
      padding: 0 12px;

      &-item {
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        &-name {
          font-size: 15px;
          color: #333;
          margin-right: 8px;
        }

        &-tag {
          font-size: 10px;
          color: #fff;
          background-color: #17d329; // 蓝色
          padding: 2px 6px;
          border-radius: 12px;
          margin-right: 4px;

          &:last-child {
            margin-right: 0;
          }

          &-rest {
            background-color: #eca843; // 黄色
          }
        }
      }

      &-top-item {
        display: flex;
        align-items: center;

        &:last-child {
          margin-top: 4px;
        }

        &-t,
        &-t2,
        &-t3,
        &-t4 {
          font-size: 13px;
          color: #666;
          margin-right: 8px;
        }

        &-t2 {
          color: #eca843;
        }
      }
    }
  }

  &-bottom {
    display: flex;
    justify-content: space-between;
    padding: 12px;

    &-l {
      display: flex;
      align-items: center;

      &-t {
        font-size: 14px;
        color: #999;
      }
    }

    &-rtbtn {
      background-color: #FF6B6B; // 红色
      color: #fff; // 白色文字
      padding: 4px 32px; // 内边距
      border-radius: 8px; // 圆角
      font-size: 14px; // 字体大小

      &-active {
        background-color: #60B95D; // 绿色
      }
    }
  }
}
</style>