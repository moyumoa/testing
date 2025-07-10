<template>
  <view>
    <image class="page-bg" src="/static/images/poster.png" />
    <view class="login">
      <view class="login-topbox">
        <image class="login-topbox-icon" src="/static/images/rejister-t.png" v-if="isRejister" />
        <image class="login-topbox-icon" src="/static/images/login-t.png" v-else />
        <text class="login-topbox-t"></text>
      </view>
      <view class="info" :class="{ 'info-active': disable }">
        <view class="verify-ipt-box">
          <template v-if="!isRejister">
            <view class="verify-ipt">
              <input type="text" inputmode="tel" placeholder="请输入用户名" v-model="loginName" clearable
                style="font-size: 14px;" />
              <!-- <view class="line"></view> -->
            </view>

            <view class="verify-ipt">
              <input type="text" placeholder="请输入密码" v-model="password" clearable style="font-size: 14px;"
                v-if="showPassword" />
              <input type="password" placeholder="请输入密码" v-model="password" clearable style="font-size: 14px;" v-else />
              <!-- <view class="line"></view> -->
              <u-icon :name="showPassword ? 'eye-off' : 'eye'" size="20" color="#a5acbb" class="passicon"
                @tap="showPassword = !showPassword"></u-icon>
            </view>

            <view class="others">
              <view class="others-l">
                <u-checkbox-group>
                  <u-checkbox labelColor="#fff" size="15" label="记住我" class="checkbox-item" :checked="remember"
                    @change="remember = !remember"></u-checkbox>
                </u-checkbox-group>

              </view>
              <view class="others-r">
                <text class="others-r-gery">还没账号?</text>
                <text class="others-r-white" @tap="isRejister = true">立即注册</text>
              </view>
            </view>

            <view class="info-btns">
              <view class="info-btns-item" @click="submit('login')">登录</view>
            </view>
          </template>

          <template v-if="isRejister">
            <view class="verify-ipt">
              <input type="text" inputmode="tel" placeholder="请输入用户名" v-model="loginName" clearable
                style="font-size: 14px;" />
            </view>
            <view class="verify-ipt">
              <input type="text" placeholder="请输入密码" v-model="password" clearable style="font-size: 14px;" />
            </view>
            <view class="verify-ipt">
              <input type="text" placeholder="请再次输入密码" v-model="password2" clearable style="font-size: 14px;" />
            </view>

            <view class="others" style="justify-content: center;">
              <text class="others-r-gery">请妥善保管账号密码, 密码忘记则无法找回</text>
            </view>

            <view class="info-btns">
              <view class="info-btns-item" @click="submit('register')">立即注册</view>
              <view class="others">
                <view class="others-r">
                  <text class="others-r-gery">已有账号?</text>
                  <text class="others-r-white" @tap="isRejister = false">立即登录</text>
                </view>
              </view>
            </view>
          </template>

          <view class="code" v-if="false">
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



        <!-- <view class="links" v-if="disable">
          登录后即代表您已同意
          <text class="links-item" style="margin-right: 0;"
            @tap="to_web('https://cos.dajiapaipai.com/yszc/yszc.html')">隐私政策</text>及
          <text class="links-item" @tap="to_web('https://cos.dajiapaipai.com/yszc/yhxy.html')">用户协议</text>
        </view> -->
      </view>
    </view>
    <view class="links" v-if="!disable">
      登录即代表您已同意
      <text class="links-item" @tap="to_web('https://cos.dajiapaipai.com/yszc/yszc.html')">《瓢虫用户协议》</text>
      和
      <text class="links-item" @tap="to_web('https://cos.dajiapaipai.com/yszc/yhxy.html')">《瓢虫隐私政策》</text>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getLocationAndAddress } from '@/utils/getLocation.js';
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
      forbidden: false,
      showPassword: false, // 是否显示密码
      remember: true, // 记住我
      isRejister: false, // 是否注册
      loginName: '', // 登录名
      password: '', // 密码
      password2: '', // 确认密码
      nickName: '', // 昵称
      avatar: '', // 头像
      lng: '', // 经度
      lat: '', // 纬度
      city: '', // 城市
      address: '', // 城市地址
      regeocode: {}, // 地址组件
    }
  },
  onShow () {
    console.log('onShow')
    const remember = uni.getStorageSync('remember') ? true : false
    if (remember) {
      const { loginName, password } = JSON.parse(uni.getStorageSync('remember') || '{}')
      this.loginName = loginName
      this.password = password
      this.remember = true
    } else {
      this.loginName = ''
      this.password = ''
      this.remember = false
    }

    // uni.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     console.log('当前位置的经度：' + res.longitude);
    //     console.log('当前位置的纬度：' + res.latitude);
    //   }
    // });

    getLocationAndAddress()
      .then(({ lng, lat, address, regeocode }) => {
        this.lng = lng
        this.lat = lat
        this.address = address
        this.regeocode = regeocode
        console.log('经纬度:', lng, lat);
        console.log('地址:', address);
        console.log('地址组件:', regeocode);
      })
      .catch(err => {
        console.error('获取定位失败:', err.message);
      });
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

    submit (type) {

      return {
        // 注册
        'register': async () => {
          if (this.loginName.length === 0) return uni.$toast('请输入用户名')
          if (this.password.length === 0) return uni.$toast('请输入密码')
          if (this.password2.length === 0) return uni.$toast('请再次输入密码')
          if (this.password !== this.password2) return uni.$toast('两次输入的密码不一致')

          const getAvatar = await uni.$api.generateAvatar()
          this.avatar = getAvatar.data.avatarUrl
          console.log('获取头像', getAvatar)

          const getUsername = await uni.$api.generateUsername()
          this.nickName = getUsername.data.nickname
          console.log('获取用户名', getUsername)

          const result = await uni.$api.register({
            loginName: this.loginName,
            password: this.password,
            nickName: this.nickName,
            avatar: this.avatar
          })
          console.log('注册结果', result)
          this.submit('login')
        },

        'login': async () => {
          if (this.loginName.length === 0) return uni.$toast('请输入用户名')
          if (this.password.length === 0) return uni.$toast('请输入密码')

          if (this.remember) {
            uni.setStorageSync('remember', JSON.stringify({
              loginName: this.loginName,
              password: this.password
            }))
          } else {
            uni.removeStorageSync('remember')
          }

          const info = await uni.$api.login({
            userName: this.loginName,
            password: this.password,
            lng: this.lng,
            lat: this.lat,
            city: this.regeocode.city || '',
            address: this.address || '',
          })
          const userInfo = {
            ...info.data.user,
            token: info.data.token,
          }
          console.log(userInfo, '-----res')
          this.updateUserInfo(userInfo)
          this.$im.init(userInfo)

          uni.hideLoading();
          uni.$toast('登录成功', 500)
          uni.setStorageSync('imToken', userInfo.imToken)
          uni.setStorageSync('mtttoken', userInfo.token)
          uni.setStorageSync('userInfo', JSON.stringify(userInfo))
          uni.setStorageSync('isLogin', true)

          // 判断是否有上一个页面 如果有则返回上一个页面 如果没有则跳转到首页
          const pages = getCurrentPages()
          if (pages.length > 1) return uni.navigateBack()

          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      }[type]?.()

      return

      if (this.phone.length === 0) return uni.$toast('请输入手机号')
      if (this.code.length === 0) return uni.$toast('请输入验证码')
      // const spreadCode = !this.isNew ? this.invitationCode : ''
      if (this.isRejister) {
        // 注册
        if (this.code.length < 6) return uni.$toast('密码长度不能少于6位')
        if (this.code.length > 20) return uni.$toast('密码长度不能超过20位')

      } else {
        // 登录
        // if (this.code.length < 4) return uni.$toast('验证码长度不能少于4位')
        // if (this.code.length > 6) return uni.$toast('验证码长度不能超过6位')
      }

      if (this.remember) {
        uni.setStorageSync('remember', JSON.stringify({
          phone: this.phone,
          password: this.code
        }))
      } else {
        uni.removeStorageSync('remember')
      }

      const userInfo = uni.$api.login({ username: `0086${this.phone}`, password: this.code, flag: 1 })
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
  height: calc(env(safe-area-inset-bottom) + 88px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);

  &-item {
    // margin-right: 10px;
    font-size: 12px;
    color: #fff;

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
      width: 246px;
      height: 60px;
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
    flex-direction: column;
    justify-content: center;
    align-items: center;


    &-item {
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 44px;
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
  padding: 0 20px;
  margin: 12px 0;
  background-color: #f3f3f3;
  height: 44px;
  border-radius: 44px;
  display: flex;
  align-items: center;
  position: relative;

  .passicon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #999;
    cursor: pointer;
  }
}

.others {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  &-l {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;

    &-t {
      color: #fff;
    }
  }

  &-r {
    display: flex;
    align-items: center;

    &-gery {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      margin-right: 8px;
    }

    &-white {
      color: rgba(255, 255, 255, 0.99);
      font-size: 14px;
      cursor: pointer;
    }
  }
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
