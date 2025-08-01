<template>
  <view class="pagecontainer">
    <view class="navbar">
      <view class="navbar-left" @tap="goback">
        <u-icon name="arrow-left" color="#333" size="20" />
      </view>
      <view class="navbar-center">
        <text class="navbar-center-t">认证信息</text>
      </view>
      <!-- <view class="navbar-right">
        <text class="navbar-right-t" @tap="oper('submit')">完成</text>
      </view> -->
    </view>

    <view class="avatarbox">
      <view class="avatar" @tap="oper('avatar')">
        <image class="avatar-pic" :src="forms.avatar" />
        <image class="avatar-icon" src="/static/per/xji.png" />
        <view class="avatar-t">
          <text class="avatar-t-text">点击更换头像</text>
        </view>
      </view>
    </view>

    <view class="title">
      <text class="title-t">基本资料</text>
    </view>
    <view class="cell">
      <view class="cell-item">
        <text class="cell-item-label">店铺名称</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入店铺名称" border="none" clearable
          v-model="forms.nickName" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">店铺介绍</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入店铺介绍" border="none"
          v-model="forms.remark" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">活跃城市</text>
        <view class="cell-item-t" :style="!forms.activeCity ? 'color:rgb(192, 196, 204)' : ''" @tap="oper('city')">
          {{ forms.activeCity || '选择城市' }}
        </view>
      </view>
    </view>

    <view class="title">
      <text class="title-t">联系方式</text>
      <text class="title-2">(至少填一项)</text>
    </view>

    <view class="cell">
      <view class="cell-item">
        <text class="cell-item-label">微信</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入微信号" border="none"
          v-model="forms.wechat" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">QQ</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入QQ号" border="none" v-model="forms.qq" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">手机号</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入手机号" border="none"
          v-model="forms.phone" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">与你</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入与你号" border="none"
          v-model="forms.yuni" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">Telegeam</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入Telegeam号" border="none"
          v-model="forms.telegeam" />
      </view>
    </view>
    <view class="subbtns">
      <view class="subbtns-item" @tap="oper('submit')">
        <text class="subbtns-item-t">
          提交
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { parseTime } from '@mvmoo/us'

export default {
  data: () => ({
    showdatetime: false, // 是否显示日期选择器
    minDate: new Date('1900-01-01').getTime(), // 最小日期
    maxDate: new Date(new Date().toDateString() + ' 23:59:59').getTime(),
    yanzhi: '', // 颜值评分
    fileListPic: [],
    fileListVideo: [],
    forms: {}
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad () {
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
    await userInfo()
    this.forms = this.initForms(); // 初始化表单数据
    uni.$on('cityName', (data) => {
      console.log(data, 'cityName')
      // this.currentLocation = data
      this.forms.activeCity = data
    })
  },
  methods: {
    ...mapActions(['updateUserInfo']),

    initForms () {
      const isUpdateCount = this.getUserInfo?.isUpdateCount || 0;
      console.log('是否更新过资料', isUpdateCount, '用户信息', this.getUserInfo);
      const { id: userId, nickName, avatar, remark, activeCity, wechat, qq, phone, yuni, telegeam, authStatus, certificationType } = this.getUserInfo
      
      return { userId, nickName, avatar, remark, activeCity, wechat, qq, phone, yuni, telegeam, authStatus: authStatus || 0, certificationType: certificationType || 2 }
    },

    goback () {
      uni.navigateBack({ delta: 1 })
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


    oper (type) {
      ({
        avatar: () => {
          uni.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'], //'camera',
            success: res => {
              const [tempFilePaths] = res.tempFilePaths
              console.log(tempFilePaths)
              uni.$api.uploadFile(tempFilePaths).then(async f => {
                console.log('f===', f)
                this.$set(this.forms, 'avatar', f.url) // 更新头像路径
              })
            },
            fail: (e) => {
              console.log(e, '==e')
            }
          })
        },
        city: () => {
          uni.navigateTo({
            url: '/pages/setting/selectLocation'
          })
        },
        submit: async () => {
          this.forms.userId = this.getUserInfo.id;
          await this.rules() // 验证表单规则
          console.log('提交的数据', this.forms)
          const res = await uni.$api.userAuth(this.forms)
          console.log('提交认证', res)
          uni.navigateBack()
        }
      }[type])?.()
    },

    rules () {
      return new Promise((resolve, reject) => {
        const rules = [
          { name: 'avatar', required: true, message: '请上传头像' },
          { name: 'nickName', required: true, message: '请输入店铺名称' },
          { name: 'remark', required: true, message: '请输入店铺介绍' },
          { name: 'activeCity', required: true, message: '请选择活跃城市' },

          /* 下面的至少填写一个 */
          { name: 'wechat', required: false, message: '请输入微信号' },
          { name: 'qq', required: false, message: '请输入QQ号' },
          { name: 'phone', required: false, message: '请输入手机号' },
          { name: 'yuni', required: false, message: '请输入与你号' },
          { name: 'telegeam', required: false, message: '请输入Telegeam号' },
        ];
        // 先校验 required 的字段
        for (let rule of rules) {
          if (rule.required && !this.forms[rule.name]) {
            uni.$toast(rule.message, 2000);
            return reject(rule.message);
          }
        }

        // 然后校验联系方式至少填一项
        const contacts = ['wechat', 'qq', 'phone', 'yuni', 'telegeam'];
        const hasContact = contacts.some(field => !!this.forms[field]);

        if (!hasContact) {
          uni.$toast('请至少填写一项联系方式（微信、QQ、手机号、与你、Telegeam）', 2000);
          return reject('请至少填写一项联系方式');
        }

        resolve(true);
      });
    }

  }
}
</script>

<style lang="scss" scoped>
.pagecontainer {
  overflow: hidden;
  padding-bottom: 80px;
}

.navbar {
  background-color: rgba(250, 252, 254, 1);
  position: fixed;
  top: 0;
  left: var(--window-left);
  right: var(--window-right);
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;

  &-left {
    flex-shrink: 0;
    padding-left: 12px;
    // width: 40px;
    height: 40px;
    display: flex;
    align-items: center;

    &-t {
      margin-left: 4px;
      // width: 40px;
      text-align: center;
      font-size: 15px;
      color: #333;
    }
  }

  &-center {
    flex: 1;
    width: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &-t {
      font-size: 15px;
      color: #333;
    }
  }

  &-right {
    margin-right: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    &-t {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 24px;
      border-radius: 16px;
      font-size: 12px;
      color: #9FA2B3;
      margin-right: 16px;

      &:last-child {
        background: #72A5FD;
        color: #fff;
        margin-right: 0;
      }
    }
  }
}

.avatarbox {
  position: relative;
  padding: 96px 24px 48px;

  .avatar {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    border-radius: 50%;

    &-pic {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      object-fit: cover;
      border: 1px solid #e4e4e4;
    }

    &-icon {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 30px;
      height: 30px;
    }

    &-t {
      position: absolute;
      bottom: -30px;
      left: 0;
      right: 0;
      text-align: center;

      &-text {
        font-size: 12px;
        color: #72A5FD;
        opacity: 0.8;
      }
    }
  }
}

.title {
  padding: 16px;
  display: flex;
  align-items: center;

  &-t {
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }

  &-2 {
    margin-left: 8px;
    font-size: 12px;
    color: #999;
  }
}

.cell {
  padding: 16px 16px 0;
  box-sizing: border-box;
  background-color: #fff;

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eaeaea;
    position: relative;

    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    &-label {
      flex-shrink: 0;
      width: 80px;
      font-size: 14px;
      color: #333;
    }

    &-t {
      width: 100%;
      font-size: 14px;
      color: #333;
      text-align: right;
      line-height: 24px;
    }

    &-yline {
      width: 8px;
      height: 2px;
      background-color: #333;
      margin: 0 5px;
    }

    &-center {
      flex: 1;
      width: 0;
      display: flex;
      align-items: center;
    }

    &-position-ipt {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-vertical {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>

<style scoped>
::v-deep .u-upload__button {
  border-radius: 12px;
  overflow: hidden;
}

::v-deep .u-radio-group {
  flex: 0;
}

.flexrow {
  display: flex;
  align-items: center;
}

.videobox {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 12px;
  position: relative;
}

.videobox video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.video-delate {
  margin-left: 12px;
  color: #fff;
  background-color: #ff4d4f;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}
</style>
