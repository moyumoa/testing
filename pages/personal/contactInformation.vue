<template>
  <view class="pagecontainer">
    <view class="cell">
      <view class="cell-item">
        <text class="cell-item-label">微信</text>
        <u-input inputAlign="right" fontSize="14px" type="text" :placeholder="readonly ? '无' : '请输入微信号'" border="none"
          v-model="forms.wechat" :readonly="readonly" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">QQ</text>
        <u-input inputAlign="right" fontSize="14px" type="text" :placeholder="readonly ? '无' : '请输入QQ号'" border="none"
          v-model="forms.qq" :readonly="readonly" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">手机号</text>
        <u-input inputAlign="right" fontSize="14px" type="text" :placeholder="readonly ? '无' : '请输入手机号'" border="none"
          v-model="forms.phone" :readonly="readonly" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">与你</text>
        <u-input inputAlign="right" fontSize="14px" type="text" :placeholder="readonly ? '无' : '请输入与你号'" border="none"
          v-model="forms.yuni" :readonly="readonly" />
      </view>

      <view class="cell-item">
        <text class="cell-item-label">Telegeam</text>
        <u-input inputAlign="right" fontSize="14px" type="text" :placeholder="readonly ? '无' : '请输入Telegeam号'"
          border="none" v-model="forms.telegeam" :readonly="readonly" />
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item" @tap="submit">
        <text class="subbtns-item-t">{{ readonly ? '修改资料' : '提交修改' }}</text>
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
    readonly: true, // 是否只读
    showdatetime: false, // 是否显示日期选择器
    minDate: new Date('1900-01-01').getTime(), // 最小日期
    maxDate: new Date(new Date().toDateString() + ' 23:59:59').getTime(),
    yanzhi: '', // 颜值评分
    fileListPic: [],
    tempPicList: [],
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
      const { id: userId, wechat, qq, phone, yuni, telegeam } = this.getUserInfo
      return { userId, wechat, qq, phone, yuni, telegeam }
    },

    async submit () {
      if (this.readonly) return this.readonly = false; // 切换为编辑状态
      uni.showLoading({ title: '正在提交...', mask: true })
      const res = await uni.$api.updateContact(this.forms)
      console.log('修改联系方式结果', res)
      this.updateUserInfo({
        ...this.getUserInfo,
        wechat: this.forms.wechat,
        qq: this.forms.qq,
        phone: this.forms.phone,
        yuni: this.forms.yuni,
        telegeam: this.forms.telegeam
      })
      uni.hideLoading()
      uni.$toast('修改成功')
      this.readonly = true; // 切换回只读状态
    }


  }
}
</script>

<style lang="scss" scoped>
.pagecontainer {
  overflow: hidden;
  padding-bottom: 80px;
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
</style>
