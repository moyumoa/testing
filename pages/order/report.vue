<template>
  <view class="pagecontainer">
    <view class="cell">
      <view class="cell-item">
        <text class="cell-item-label">妹子花名</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入妹子花名" border="none" clearable
          v-model="forms.stageName" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">体验项目</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入体验项目" border="none" clearable
          v-model="forms.items" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">胸器罩杯</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入胸器罩杯" border="none" clearable
          v-model="forms.cup" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">体验时间</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入体验时间" border="none" clearable
          v-model="forms.tasteTime" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">所在位置</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入所在位置" border="none" clearable
          v-model="forms.address" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">消费情况(元)</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入消费情况(元)" border="none" clearable
          v-model="forms.amount" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">服务时长(分钟)</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入服务时间" border="none" clearable
          v-model="forms.duration" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label" style="margin-bottom: 12px">颜值评分</text>
        <u-rate v-model="forms.faceLevel"></u-rate>
      </view>
      <view class="cell-item">
        <text class="cell-item-label" style="margin-bottom: 12px">服务质量</text>
        <u-rate v-model="forms.serviceQuality"></u-rate>
      </view>
      <view class="cell-item">
        <text class="cell-item-label" style="margin-bottom: 12px">环境质量</text>
        <u-rate v-model="forms.envLevel"></u-rate>
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">服务详情</text>
          <u--textarea v-model="forms.description" placeholder="请输入内容" />
        </view>
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">支付凭证</text>
          <view class="cell-item-pic" @tap="upLoader('payImg')">
            <image :src="forms.payImg" v-if="forms.payImg" />
            <u-icon name="camera-fill" color="#ceced1" size="26" v-else />
          </view>

        </view>
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">人物照片</text>
          <view class="cell-item-pic" @tap="upLoader('customerImg')">
            <image class="cell-item-pic" :src="forms.customerImg" v-if="forms.customerImg" />
            <u-icon name="camera-fill" color="#ceced1" size="26" v-else />
          </view>
        </view>
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">室内环境</text>
          <view class="cell-item-pic" @tap="upLoader('indoorImg')">
            <image class="cell-item-pic" :src="forms.indoorImg" v-if="forms.indoorImg" />
            <u-icon name="camera-fill" color="#ceced1" size="26" v-else />
          </view>
        </view>
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">上传视频</text>
          <view class="cell-item-pic" @tap="upLoader('surroundImg')">
            <!-- @tap.stop="previewVideo(forms.surroundImg)" -->
            <view class="videobox" v-if="forms.surroundImg">
              <video :src="forms.surroundImg" />
            </view>
            <u-icon name="camera-fill" color="#ceced1" size="26" v-else />
          </view>

        </view>
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
    fileListPic: [],
    fileListVideo: [],
    forms: {
      faceLevel: 1,
      serviceQuality: 1,
      envLevel: 1,
    },
    options: {},
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad (options) {
    this.options = { ...options };
  },
  methods: {
    ...mapActions(['updateUserInfo']),

    upLoader (name) {
      //  如果是上传视频只能选择视频
      if (name === 'surroundImg') {
        uni.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          success: res => {
            console.log('选择的视频', res);
            const { tempFilePath } = res;
            uni.showLoading({ title: '视频上传中', mask: true });
            uni.$api.uploadFile(tempFilePath).then(async f => {
              console.log('f===', f)
              this.$set(this.forms, [name], f.url) // 更新头像路径
            }).finally(() => {
              uni.hideLoading();
            });
            // this.forms[name] = res.tempFile
          },
          fail: () => {
            uni.$toast('视频选择失败');
          }
        });
      } else {
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: res => {
            uni.showLoading({ title: '图片上传中', mask: true });
            console.log('选择的图片', res);
            const [tempFilePaths] = res.tempFilePaths;
            // this.forms[name] = tempFilePaths;
            uni.$api.uploadFile(tempFilePaths).then(async f => {
              console.log('f===', f)
              this.$set(this.forms, [name], f.url) // 更新头像路径
            }).finally(() => {
              uni.hideLoading();
            });
          },
          fail: () => {
            uni.$toast('图片选择失败');
          }
        });
      }
    },

    oper (type) {
      ({
        submit: async () => {
          // this.forms.userId = this.getUserInfo.id;
          await this.rules() // 验证表单规则
          console.log('提交的数据', this.forms)
          const res = await uni.$api.orderReport({
            ...this.forms,
            userId: this.options.userId,
            productId: this.options.productId,
            orderId: this.options.orderId,
            orderNo: this.options.orderNo,
            isVideo: this.forms.surroundImg ? 1 : 0, // 是否上传了视频
            reportType: this.options.productId ? 1 : 0
          })
          console.log('提交认证', res)
          this.$store.dispatch('updatateOrder', this.options.orderId)
          await new Promise(resolve => setTimeout(resolve, 500));
          uni.navigateBack()
        }
      }[type])?.()
    },

    previewVideo (file) {
      console.log('预览视频文件', file);
      let url = '';

      if (typeof file === 'string') {
        url = file;
      } else if (file && file.url) {
        url = file.url;
      } else {
        return uni.$toast('视频文件不存在');
      }

      uni.navigateTo({
        url: `/pages/common/videoPreview?url=${encodeURIComponent(url)}`
      });
    },


    rules () {
      return new Promise((resolve, reject) => {
        const rules = [
          { name: 'stageName', required: true, message: '请输入妹子花名' },
          { name: 'items', required: true, message: '请输入体验项目' },
          { name: 'cup', required: true, message: '请输入胸器罩杯' },
          { name: 'tasteTime', required: true, message: '请输入体验时间' },
          { name: 'address', required: true, message: '请输入所在位置' },
          { name: 'amount', required: true, message: '请输入消费情况' },
          { name: 'duration', required: true, message: '请输入服务时长' },
          { name: 'faceLevel', required: true, message: '请选择颜值评分' },
          { name: 'serviceQuality', required: true, message: '请选择服务质量' },
          { name: 'envLevel', required: true, message: '请选择环境质量' },
          { name: 'description', required: true, message: '请输入服务详情' },
          { name: 'payImg', required: true, message: '请上传支付凭证' }, // 支付凭证
          { name: 'customerImg', required: true, message: '请上传人物照片' }, // 人物照片
          { name: 'indoorImg', required: true, message: '请上传室内环境' }, // 室内环境

        ];
        for (let rule of rules) {
          if (rule.required && !this.forms[rule.name]) {
            uni.$toast(rule.message, 2000);
            return reject(rule.message);
          }
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

    &-pic {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.025);
      position: relative;

      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
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
  /* 禁止点击 */
  pointer-events: none;
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
