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
            <u-icon :label="getUserInfo.isVip ? '会员' : '普通用户'" size="16" labelColor="#ccc" labelSize="12"
              name="/static/per/hy-icon.png" />
          </view>
        </view>

        <view class="pinfo-top-position">
          <text class="pinfo-top-position-t">
            {{ getUserInfo.isCertification ? '已认证' : '未认证' }}
          </text>
        </view>
      </view>
      <view class="pinfo-row">
        <text class="pinfo-row-text">
          到期时间: {{ getUserInfo.expireTime || '无' }}
        </text>
      </view>
    </view>

    <view class="panel">
      <view class="panel-grid">
        <view class="panel-grid-title">
          <u-icon name="rmb-circle" color="#72A5FD" size="20" />
          <text class="panel-grid-title-t">关于价格</text>
        </view>
        <view class="panel-grid-centext">
          <text
            class="panel-grid-centext-t">90天 1000元</text>
        </view>
      </view>
      <view class="panel-grid">
        <view class="panel-grid-title">
          <u-icon name="file-text" color="#72A5FD" size="20" />
          <text class="panel-grid-title-t">关于规则</text>
        </view>
        <view class="panel-grid-centext">
          <text
            class="panel-grid-centext-t">个人认证填写的资料将在首页认证区展示，修改资料平台将认为再次认证，需重新缴纳认证费，平台建议选择优质照片上传，认证视频建议以素颜视频上传，认证视频不会添加到个人主页。</text>
        </view>
      </view>
      <view class="panel-grid">
        <view class="panel-grid-title">
          <u-icon name="list" color="#72A5FD" size="20" />
          <text class="panel-grid-title-t">认证记录</text>
        </view>
        <view class="panel-grid-centext">
          <u-steps current="1" direction="column" dot>
            <u-steps-item title="失败" desc="0000-00-00 10:30">
            </u-steps-item>
            <u-steps-item title="失败" desc="0000-00-00 10:35">
            </u-steps-item>
            <u-steps-item title="审核中" desc="0000-00-00 11:40"></u-steps-item>
          </u-steps>
        </view>
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item">
        <text class="subbtns-item-t">去支付</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
  data: () => ({}),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad () {
    await userInfo()
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
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
.containerwarp {
  background-color: $bgc;
  padding-bottom: calc(58px + env(safe-area-inset-bottom));
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

    &-position {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #efeeee;
      padding: 4px 12px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-t {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
  }

  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding: 0 4px;

    &-text {
      font-size: 13px;
      color: #333;
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
        transform: translate(5px, -0.55px);
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