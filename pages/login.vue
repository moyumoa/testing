<template>
  <view>
    <image class="page-bg" src="/static/images/poster.jpg" v-if="disable" />
    <view class="login">
      <view class="login-topbox" v-if="!disable">
        <image class="login-topbox-icon" src="/static/logo.png"></image>
        <text class="login-topbox-t"></text>
      </view>
      <view class="info" :class="{ 'info-active': disable }">
        <view class="verify-ipt-box">
          <view class="verify-ipt">
            <input type="number" inputmode="tel" placeholder="请输入手机号" v-model="phone" clearable @blur="blur_phone"
              style="font-size: 14px; margin-bottom: 14px" />
            <view class="line"></view>
          </view>

          <view class="code">
            <view class="code-left">
              <input type="text" placeholder="请输入验证码" v-model="code" clearable
                style="font-size: 14px; margin-bottom: 14px" />
              <view class="line"></view>
            </view>
            <view class="code-right">
              <u--text color="#0dc5e4" :text="tips" @tap="getCode" size="14"></u--text>
            </view>
            <u-toast ref="uToast"></u-toast>
            <u-code :seconds="seconds" ref="uCode" @change="codeChange"></u-code>
          </view>

          <view class="invitation-code" v-if="!isNew">
            <input :disabled="disable || forbidden" type="text" placeholder="填写邀请码" v-model="invitationCode" clearable
              style="font-size: 14px;" />
          </view>
        </view>

        <view class="info-btns">
          <view class="info-btns-item" @click="submit">登录</view>
        </view>

        <view class="links" v-if="disable">
          登录后即代表您已同意
          <text class="links-item" style="margin-right: 0;"
            @tap="to_web('https://cos.dajiapaipai.com/yszc/yszc.html')">隐私政策</text>及
          <text class="links-item" @tap="to_web('https://cos.dajiapaipai.com/yszc/yhxy.html')">用户协议</text>
        </view>
      </view>
    </view>
    <view class="links" v-if="!disable">
      <text class="links-item" @tap="to_web('https://cos.dajiapaipai.com/yszc/yszc.html')">隐私政策</text>
      <text class="links-item" @tap="to_web('https://cos.dajiapaipai.com/yszc/yhxy.html')">用户协议</text>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      show: false,
      userInfo: {},
      phone: '10000000001',
      invitationCode: '',
      code: '1',
      verify: true,
      seconds: 30,
      tips: '',
      isNew: true,
      redirect: '',
      disable: false,
      forbidden: false
    }
  },
  onShow () {
    console.log('onShow')
  },

  onLoad (options) {
    // this.redirect = options.redirect
    // if (options?.c) {
    //   this.disable = true
    //   this.invitationCode = options.c
    // }
    // if(options?.inviteCode) {
    //   this.phone = options.phone
    //   this.forbidden = true
    //   this.isNew = false
    //   this.invitationCode = options.inviteCode
    // }
  },
  methods: {
    ...mapActions(['updateUserInfo']),  // 映射 action

    async blur_phone () {
      // 判断是否为手机号
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        uni.$toast('请输入正确的手机号')
        return
      }
    },

    codeChange (text) {
      this.tips = text;
    },
    async getCode () {
      if (this.phone.length === 0) return uni.$toast('请输入手机号')
      if (this.$refs.uCode.canGetCode) {
        uni.showLoading({
          title: '正在获取验证码',
          mask: true
        })
        const res = await uni.$api.sendCode({ phone: Number(this.phone) })
        uni.hideLoading();
        uni.$toast('验证码已发送')
        this.$refs.uCode.start();
        // this.ccid = res.data.ccid
      } else {
        uni.$toast('倒计时结束后再发送');
      }
    },

    async submit () {
      if (this.phone.length === 0) return uni.$toast('请输入手机号')
      if (this.code.length === 0) return uni.$toast('请输入验证码')
      const spreadCode = !this.isNew ? this.invitationCode : ''
      const userInfo = await uni.$api.login({ username: `0086${this.phone}`, password: this.code, flag: 1 })
      console.log(userInfo, '-----res')
      this.updateUserInfo(userInfo)
      this.$im.init(userInfo)

      uni.hideLoading();
      uni.$toast('登录成功', 500)
      uni.setStorageSync('mtttoken', userInfo.token)
      uni.setStorageSync('userInfo', JSON.stringify(userInfo))
      uni.setStorageSync('isLogin', true)

      // 判断是否有上一个页面 如果有则返回上一个页面 如果没有则跳转到首页
      const pages = getCurrentPages()
      if (pages.length > 1) return uni.navigateBack()

      uni.switchTab({
        url: '/pages/index/index'
      })

      // if (this.redirect) {
      //   console.log('重定向', this.redirect)
      //   uni.redirectTo({
      //     url: this.redirect,
      //     fail: () => {
      //       console.log('跳转失败')
      //       uni.switchTab({
      //         url: this.redirect
      //       })
      //     }
      //   })
      //   return
      // }
      // uni.switchTab({
      //   url: '/pages/index/index'
      // })
    },

    to_web (url) {
      uni.$web(url)
    }
  }
}
</script>

<style>
page {
  background: #fff;
}
</style>

<style lang="scss" scoped>
.page-bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: -1;
  // 背景模糊
  // filter: blur(3px) saturate(1.7) brightness(1.7);
}

.links {
  height: calc(env(safe-area-inset-bottom) + 40px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  font-size: 12px;
  color: #aeaeae;

  &-item {
    margin-right: 10px;
    font-size: 12px;
    color: #7790db;

    &:last-child {
      margin-right: 0;
    }
  }
}

.login {
  margin-bottom: calc(env(safe-area-inset-bottom) + 40px);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;


  &-topbox {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &-icon {
      width: 80px;
      height: 80px;
      border-radius: 10px;
      background-color: #eee;
    }

    &-t {
      margin-top: 20px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
  }


}

.info {
  width: 100vw;
  margin-top: 10%;

  &-active {
    margin-top: 20% !important;
    width: 90vw;
    // background-color: rgba(255, 255, 255, .95);
    border-radius: 12px;
    padding: 12px 0 50px;

    // 渐变背景
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);

    .info-btns {
      margin: 0 10% 0;
    }
  }

  &-ipt {
    margin: 16px;
    height: 50px;
    background-color: #f3f3f3;
    border-radius: 8px;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 16px;
  }

  &-btns {
    // position: fixed;
    // left: 10%;
    // right: 10%;
    // bottom: calc(16px + env(safe-area-inset-bottom));
    margin: 30% 10% 0;
    display: flex;
    justify-content: center;
    align-items: center;


    &-item {
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 16px;
      background-color: $btn-bc;
      color: #fff;
    }
  }

}

.verify-ipt-box {
  display: flex;
  flex-direction: column;
  // padding: 10px 20px;
  margin: 10%;
  box-sizing: border-box;

  .line {
    height: 1px;

    &::after {
      content: '';
      display: block;
      height: 1px;
      background-color: #ddd;
      transform: scaleY(0.5);
    }
  }
}

.verify-ipt {
  /* padding: 20px; */
  margin: 12px 0;
}

.invitation-code {
  width: 120px;
  // background-color: #fafafa;
  // display: flex;
  // align-items: center;
  // height: 40px;
  padding: 10px 10px;
  border-radius: 5px;
  box-shadow: 0 0 4px rgba(0, 0, 0, .1);
}

.code {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
}

.code-left {
  flex: 1;
}

.code-right {
  padding-left: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
