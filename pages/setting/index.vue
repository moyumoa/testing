<template>
  <view class="warps">
    <view class="list" v-for="(item, index) in list" :key="index">
      <view class="list-item" v-for="(option, optionIndex) in item.attr" :key="optionIndex" @tap="navigator(option.to)">
        <view class="list-item-l">
          <image class="list-item-l-icon" :src="option.icon" />
          <text class="list-item-l-t">{{ option.name }}</text>
        </view>
        <view class="list-item-line" v-if="optionIndex !== (item.attr.length - 1)"></view>
        <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
      </view>
    </view>
    
    <view class="list">
      <view class="list-item">
        <view class="list-item-l">
          <image class="list-item-l-icon" src="/static/images/icons/yaoyiyao.png" />
          <text class="list-item-l-t">摇一摇弹出我的邀请码</text>
        </view>
        <u-switch size="20" activeColor="#0dd2e4" v-model="switchs.shake" @change="change('shake', $event)"></u-switch>
      </view>
      <view class="list-item" v-if="isShopManager">
        <view class="list-item-l">
          <image class="list-item-l-icon" src="/static/images/icons/yaoyiyao.png" />
          <text class="list-item-l-t">摇一摇切换上下架列表</text>
        </view>
        <u-switch size="20" activeColor="#0dd2e4" v-model="switchs.onAndOffTheShelves"
          @change="change('onAndOffTheShelves', $event)"></u-switch>
      </view>
    </view>

    <view class="list">
      <view class="list-item" @tap="tap_to(100)">
        <view class="list-item-l">
          <image class="list-item-l-icon" src="/static/images/icons/zhzx.png" />
          <text class="list-item-l-t">账号注销</text>
        </view>
        <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
      </view>
    </view>

    <view class="version" @tap="tap_version">
      <text class="version-t">当前版本</text>
      <text class="version-v">{{ version }}</text>
      <!-- #ifdef APP-PLUS -->
      <!-- <text class="version-vs" v-if="isNewVersion">有新版本,点击更新</text> -->
      <!-- #endif -->
    </view>

    <view class="logout" @tap="logout">
      <image class="logout-icon" src="/static/images/icons/logout.png" />
      <text class="logout-t">退出登录</text>
    </view>

    <m-actions tips="确定要退出登录吗?" :show="showActionSheet" :item-list="itemList" @click="itemClick"
      @cancel="showActionSheet = false">
    </m-actions>
  </view>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    isShopManager: getApp().globalData.shopManager,
    showActionSheet: false,
    switchs: {},
    itemList: [{
      value: 1,
      text: "退出登录",
      color: "#ff0000"
    }],
    version: '',
    isNewVersion: false,
    list: [
      {
        attr: [
          { name: '个人信息', icon: '/static/images/icons/pers.png', to: '/pages/personal/info' },
          { name: '收款信息', icon: '/static/images/icons/shoukuan.png', to: '/pages/personal/other/collectionInformation' },
          // { name: '银行卡', icon: '/static/images/icons/bankcrad.png', to: '/pages/wallet/bankList' },
          { name: '地址管理', icon: '/static/images/icons/dzgl.png', to: '/pages/personal/address' },
        ]
      },
      {
        attr: [
          { name: '关于我们', icon: '/static/images/icons/gywm.png', to: '/pages/personal/other/about' },
          { name: '问题反馈', icon: '/static/images/icons/wtfk.png', to: '/pages/setting/problemFeedback' }
        ]
      }
    ]
  }),

  onLoad () {
    // #ifdef H5
    uni.getSystemInfo({
      success: (res) => {
        this.version = res.appVersion
      }
    })
    // #endif

    // #ifdef APP-PLUS
    this.version = getApp().globalData.systemInfo.version || uni.getSystemInfoSync().appVersion
    // this.isNewVersion = getApp().globalData.isNewVersion
    const seeting = JSON.stringify({
      shake: true,
      onAndOffTheShelves: true,
      merge: true
    })
    this.switchs = JSON.parse(uni.getStorageSync('settings') || seeting)
    // #endif
  },

  methods: {
    ...mapActions(['updateUserInfo']),
    tap_version () { },
    change (val, e) {
      // this.eve = `change: ${val}, ${e}`
      // 把设置存入缓存
      uni.setStorage({
        key: 'settings',
        data: JSON.stringify(this.switchs),
        success: () => {
          uni.$toast('操作成功', 500)
        }
      });
    },

    navigator (url) {
      uni.navigateTo({ url })
    },

    tap_to (val) {
      ({
        100: () => {
          uni.showModal({
            title: '提示',
            content: '确定注销账号吗？',
            success: (res) => {
              if (res.confirm) {
                uni.showModal({
                  title: '提示',
                  content: '注销账号后，您的所有信息将被清除，且无法恢复，确定注销吗？',
                  success: (res) => {
                    if (res.confirm) {
                      uni.$api.logoutAccount().then(() => {
                        uni.$api.logout().then(() => {
                          uni.removeStorageSync('mtttoken')
                          uni.removeStorageSync('userInfo')
                          uni.removeStorageSync('isLogin')
                          uni.removeStorageSync('settings')
                          uni.removeStorageSync('shopManager')
                          uni.reLaunch({
                            url: '/pages/login/login'
                          })
                        })
                      })
                    }
                  }
                })
              }
            }
          })
        }

      }[val] || function () { })()
    },

    logout () {
      this.showActionSheet = true
    },

    itemClick ({ value }) {
      uni.$api.logout().then(() => {
        uni.removeStorageSync('mtttoken')
        uni.removeStorageSync('imToken')
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isLogin')
        this.updateUserInfo({}) // 清空 Vuex 中的用户信息

        uni.reLaunch({
          url: '/pages/login'
        })

        this.showActionSheet = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warps {
  margin: $mg;
}

.list {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: $mg;

  &-item {
    padding: 16px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    &:active {
      background-color: rgba(0, 0, 0, 0.02);
    }

    // border-bottom: 1px solid #f8f8f8;
    // margin-bottom: $mg;

    &-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      // height: 1px;
      // background-color: #f8f8f8;

      &::before {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 40px;
        z-index: 1;
        height: 1px;
        background-color: #f0f0f0;
        transform: scaleY(0.5);
        transform-origin: right;
      }
    }

    &-l {
      display: flex;
      flex-direction: row;
      align-items: center;

      &-t {
        margin-left: 5px;
        font-size: 16px;
      }

      &-icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}

.version {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;

  &-t {
    font-size: 12px;
    color: #aaa;
  }

  &-v {
    margin: 0 5px;
    font-size: 12px;
    color: #aaa;
  }

  &-vs {
    font-size: 12px;
    color: #ff006f;
  }
}

.logout {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom);

  &-icon {
    width: 18px;
    height: 18px;
  }

  &-t {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    font-size: 16px;
    color: #ff0000;
  }
}
</style>