<template>
  <view class="containerwarp">
    <view class="pinfo">
      <view class="pinfo-top">
        <view class="pinfo-top-l">
          <image class="pinfo-top-l-pic" :src="getUserInfo.avatar" />
        </view>
        <view class="pinfo-top-r">
          <text class="pinfo-top-r-t">{{ getUserInfo.nickName }}</text>
          <view class="pinfo-top-r-t2">
            <u-icon :label="getUserInfo.isVip ? '高级会员' : '普通用户'" size="16" labelColor="#ccc" labelSize="12"
              name="/static/per/hy-icon.png" />
          </view>
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="panel-grid">
        <view class="panel-grid-title">
          <text class="panel-grid-title-t">常用功能</text>
        </view>
        <grid-box width="25%" :list="grid1" @event="onClickFnGrid" />
      </view>
      <view class="panel-grid">
        <view class="panel-grid-title">
          <text class="panel-grid-title-t">更多功能</text>
        </view>
        <grid-box width="25%" :list="grid2" @event="onClickFnGrid" />
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
  data: () => ({
    ptop: 0,
    myStatus: 1, // 接单状态 1-接单 2-休息
    grid1: [
      { icon: '/static/per/c-1.png', title: '我的钱包', value: 1 },
      { icon: '/static/per/c-2.png', title: '我的发布', value: 2 },
      { icon: '/static/per/c-3.png', title: '我的收藏', value: 3 },
      { icon: '/static/per/c-4.png', title: '我的订单', value: 4 },
    ],
    grid2: [
      { icon: '/static/per/g-1.png', title: '个人认证', value: 1 },
      { icon: '/static/per/g-2.png', title: '商户入驻', value: 2 },
      { icon: '/static/per/g-3.png', title: '我的推广', value: 3 },
      { icon: '/static/per/g-4.png', title: '我的联系方式', value: 4 },
    ],
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad () {
    try {
      const user = await userInfo();
      console.log('用户信息已更新：', user);
    } catch (e) {
      console.warn('使用缓存用户信息', e);
    }
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
    //获取胶囊位置
    // const { top = 0, height = 0 } = uni.getMenuButtonBoundingClientRect()
    // this.ptop = top + height
    // console.log('状态栏高度', uni.getSystemInfoSync().statusBarHeight)

    // h5平台固定top为44px
    this.ptop = 44 + 22
  },
  methods: {

    navtap (type) {
      ({
        kefu: () => {
          // 跳转到客服页面
          uni.navigateTo({
            url: '/pages/kefu/index'
          })
        },
        setting: () => {
          // 跳转到设置页面
          uni.navigateTo({
            url: '/pages/setting/index'
          })
        },
      }[type])?.()
    },

    onClickGrid ({ value }) {
      ({
        1: () => uni.$toast('待付款'),
      }[value])?.()
    },

    onClickFnGrid ({ title }) {
      ({
        '我的推广': () => {
          uni.navigateTo({
            // url: '/reward/pages/invite/index'
            url: '/pages/personal/invite'

          })
        },
        '会员中心': () => {
          // 跳转到分包member
          uni.navigateTo({
            url: '/member/pages/center/index'
          })
        },
      }[title])?.()
    }
  }
}
</script>

<style lang="scss" scoped>
.containerwarp{
  background-color: $bgc;
}
.pinfo {
  position: relative;
  padding: 32px 24px 16px;


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
      border: 1px solid #fff;
      box-sizing: border-box;
      box-shadow: 0 2px 8px 12px rgba(0, 0, 0, 0.05);

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

.panel {
  margin: 0 16px 16px;
  border-radius: 16px 16px 0 0;

  &-hybox {
    height: 62px;
    margin: 0 16px;

    &-pic {
      width: 100%;
      height: 100%;
    }
  }

  &-grid {
    margin-bottom: 16px;
    padding: 16px 16px 6px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);

    ::v-deep .grid-box-item-top {
      width: 48px;
      height: 48px;
    }

    ::v-deep .grid-box-item-top-icon {
      width: 48px;
      height: 48px;
    }

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // margin-bottom: 24px;

      &-t {
        font-size: 14px;
        color: #333;
        opacity: 0.4;
        font-weight: 500;
      }

      &-r {
        display: flex;
        align-items: baseline;

        &-t {
          font-size: 12px;
          color: #666;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>