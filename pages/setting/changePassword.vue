<template>
  <view class="container">
    <!-- <view class="title">请输入您的用户名和密码</view> -->

    <image class="title-icon" src="/static/images/resetpasswrod.png" />

    <view class="form">
      <view class="form-item">
        <text class="form-item-label">旧密码</text>
        <u-input v-model="oldPassword" type="password" placeholder="请输入旧密码" border="none" />
      </view>

      <view class="password-block">
        <view class="form-item">
          <text class="form-item-label">新密码</text>
          <u-input v-model="newPassword" type="password" placeholder="请输入新密码" border="none" />
        </view>
        <view class="strength-bar">
          <view :class="['bar', passwordStrength >= 1 ? 'active' : '']"></view>
          <view :class="['bar', passwordStrength >= 2 ? 'active' : '']"></view>
          <view :class="['bar', passwordStrength >= 3 ? 'active' : '']"></view>
        </view>
        <text class="strength-text">密码强度：{{ passwordText }}</text>
      </view>

      <view class="password-block">
        <view class="form-item">
          <text class="form-item-label">确认新密码</text>
          <u-input v-model="confirmPassword" type="password" placeholder="请再次输入新密码" border="none" />
        </view>
        <view class="strength-bar">
          <view :class="['bar', passwordStrength >= 1 ? 'active' : '']"></view>
          <view :class="['bar', passwordStrength >= 2 ? 'active' : '']"></view>
          <view :class="['bar', passwordStrength >= 3 ? 'active' : '']"></view>
        </view>
        <text class="strength-text">密码强度：{{ passwordText }}</text>
      </view>

      <u-button type="primary" class="btn" shape="circle" @click="resetPassword">重置密码</u-button>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  computed: {
    passwordStrength () {
      const val = this.newPassword;
      // if (val.length < 6) return 0;
      let level = 0;
      if (/[0-9]/.test(val)) level++;
      if (/[a-zA-Z]/.test(val)) level++;
      if (/[^a-zA-Z0-9]/.test(val)) level++;
      return level;
    },
    passwordText () {
      return ['弱', '中', '强'][this.passwordStrength - 1] || '弱';
    }
  },
  methods: {
    ...mapActions(['updateUserInfo']),

    resetPassword () {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        return uni.$u.toast('请完整填写所有信息');
      }
      if (this.newPassword !== this.confirmPassword) {
        return uni.$u.toast('两次密码输入不一致');
      }
      // uni.$u.toast('密码已重置');
      // 你可以在此调用后端 API
      uni.$api.resetPassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }).then(res => {
        uni.removeStorageSync('mtttoken')
        uni.removeStorageSync('imToken')
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isLogin')
        // 修改缓存remember中的password
        const remember = JSON.parse(uni.getStorageSync('remember') || '{}')
        remember.password = this.newPassword
        uni.setStorageSync('remember', JSON.stringify(remember))
        this.updateUserInfo({}) // 清空 Vuex 中的用户信息
        uni.$toast('密码重置成功');
        uni.reLaunch({ url: '/pages/login' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx 30rpx;
}

.title {
  text-align: center;
  margin-bottom: 60rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.title-icon{
  width: 492rpx;
  height: 36rpx;
  display: block;
  margin: 14% auto 18%;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 30rpx;

  &-item {
    background-color: #fff;
    padding: 24rpx 24rpx;
    border-radius: 80rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.015);

    &-label {
      flex-shrink: 0;
      width: 168rpx;
      font-size: 30rpx;
      color: #333;
      opacity: 0.9;
    }
  }
}


.password-block {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.strength-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
  padding: 28rpx 24rpx;
}

.bar {
  flex: 1;
  height: 8rpx;
  background: #ddd;
  margin-right: 48rpx;
  border-radius: 8rpx;

  &:last-child {
    margin-right: 0;
  }
}

.bar.active {
  background: #409eff;
}

.strength-text {
  font-size: 22rpx;
  color: #888;
  padding: 0 24rpx;
}

.btn {
  margin-top: 80rpx;
  background: #72A5FD;
  color: #fff;
}
</style>
