<template>
  <view class="containerwarp">
    <view class="navbar">
      <view class="navbar-left" @tap="goback">
        <u-icon name="arrow-left" color="#fff" size="21" />
      </view>
      <view class="navbar-center">
        <text class="navbar-center-t">会员中心</text>
      </view>
    </view>
    <view class="pinfo" :style="{ 'padding-top': `${78}px` }">

      <view class="pinfo-top">
        <view class="pinfo-top-l">
          <image class="pinfo-top-l-pic" :src="getUserInfo.avatar" />
        </view>
        <view class="pinfo-top-r">
          <text class="pinfo-top-r-t">{{ getUserInfo.nickName }}</text>
          <view class="pinfo-top-r-t2">
            <u-icon :label="getUserInfo.isVip ? '会员' : '普通用户'" size="16" labelColor="#9C7E58" labelSize="12"
              name="/static/per/hy-icon.png" />
          </view>
        </view>

        <view class="pinfo-top-position">
          <text class="pinfo-top-position-t">
            0000-00-00 00:00 到期
          </text>
        </view>
      </view>
      <view class="pinfo-row">
        <text class="pinfo-row-text">
          立即续费
        </text>
      </view>
    </view>

    <scroll-view scroll-x>
      <view class="xwarp">
        <view class="xwarp-item" :class="{ 'xwarp-item-active': current.id === item.id }"
          v-for="(item, index) in rowData" :key="item.id" @tap="selectType(item, index)">
          <text class="xwarp-item-t1">{{ item.expireDays }}天</text>
          <text class="xwarp-item-t2">¥{{ item.payAccount / 100 }}</text>
          <view class="xwarp-item-bottom">
            <text class="xwarp-item-t3">≈{{ (item.expireDays / item.payAccount).toFixed(2) }}/天</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="panel">
      <view class="panel-grid">
        <view class="panel-grid-title">
          <u-icon name="bookmark" color="#72A5FD" size="20" />
          <text class="panel-grid-title-t">权益</text>
        </view>
        <view class="panel-grid-centext">
          <text class="panel-grid-centext-t">
            1.会员专属筛选\n
            2.每月有5次免费解锁联系方式\n
            3.会员能入驻商户直接进行对话\n
            4.专属发布权益（动态、帖子、报告\n
            5.会员专属举报\n
            6.可对帖子动态等进行评价\n
            7.拥有会员专属标志
          </text>
        </view>
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item" @tap="show = true">
        <text class="subbtns-item-t">立即开通</text>
      </view>
    </view>

     <t-pay-way :info="payInfo" :orderNoId="payInfo.orderId" :show="show" @close="show = false"/>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
  data: () => ({
    rowData: [],
    current: {},
    show: true,
    payInfo: {
      orderId: '',
      payAccount: 0,
      payType: 1, // 1-微信 2-支付宝
      payName: '微信支付',
      payDesc: '扫码支付',
    },
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad () {
    await userInfo()
    await this.getAuthType();
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
  },
  methods: {

    goback () {
      uni.navigateBack();
    },

    // 获取商户认证类型
    async getAuthType () {
      const res = await uni.$api.authType();
      console.log('商户认证类型', res);
      this.rowData = res.rows || [];
      this.selectType(this.rowData[0], 0);
    },

    // 选择认证类型
    selectType (item, index) {
      this.current = item;
    },


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
.containerwarp {
  background-color: $bgc;
  padding-bottom: calc(58px + env(safe-area-inset-bottom));
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  color: #fff; // 设置文字颜色

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
    padding-right: 40px;

    &-t {
      font-size: 15px;
      color: #fff;
    }
  }

}

.pinfo {
  position: relative;
  padding: 32px 24px 0;
  height: 174px;
  background-color: #252635;

  &::before {
    content: '';
    position: absolute;
    left: 16px;
    right: 16px;
    height: 174px;
    bottom: 12px;
    background-image: url('/static/bgs/vip-bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

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
        color: #9B7D57;
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
      top: -12px;
      right: 0;
      padding: 4px 0;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-t {
        font-size: 12px;
        color: #ececec;
      }
    }
  }

  &-row {
    position: absolute;
    bottom: 32px;
    right: 32px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 4px;

    &-text {
      border: 1px solid #7F5321;
      padding: 6px 24px;
      border-radius: 20px;
      font-size: 13px;
      color: #7F5321;
      opacity: 0.8;
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

.xwarp {
  padding: 16px;
  box-sizing: border-box;
  display: flex;

  &-item {
    position: relative;
    flex-shrink: 0;
    width: 118px;
    // height: 120px;
    margin-right: 16px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    // padding: calc(16px + 12px) 12px 12px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    transition: all 0.2s ease;

    &-t1 {
      font-size: 15px;
      color: #7F4C0F;
      font-weight: bold;
      margin: 16px 0 0;
    }

    &-t2 {
      font-size: 18px;
      color: #FF6065;
      margin: 16px;
    }

    &-bottom {
      height: 32px;
      line-height: 32px;
      width: 100%;
      text-align: center;
      background: rgba(0, 0, 0, 0.1);
      color: #fff;
      font-size: 13px;
    }

    &-active {
      border: 1px solid #BB945F;
      background-color: #FEFAEF;
    }

    &-active>&-bottom {
      background: linear-gradient(104.04deg, #BB945F 0%, #FF6064 100%);
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
      // justify-content: space-between;
      align-items: center;
      // margin-bottom: 24px;

      &-t {
        font-size: 14px;
        color: #333;
        opacity: 0.8;
        font-weight: 500;
        transform: translate(5px);
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

    &-centext {
      padding: 12px 0;
      font-size: 12px;
      color: #666;
      line-height: 1.5;
      opacity: 0.8;
    }
  }
}
</style>