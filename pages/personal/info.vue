<template>
  <view class="pagecontainer">
    <view class="navbar">
      <view class="navbar-left" @tap="goback">
        <u-icon name="arrow-left" color="#333" size="20" />
      </view>
      <view class="navbar-center">
        <text class="navbar-center-t">{{source === 2 ? '发布女郎' : '认证信息'}}</text>
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
        <text class="cell-item-label">昵称</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入昵称" border="none" clearable
          v-model="forms.nickName" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">生日</text>
        <view class="cell-item-t" @tap="showdatetime = true">
          {{ forms.birthday || '选择日期' }}
        </view>
        <u-datetime-picker :show="showdatetime" v-model="forms.birthday" mode="date" :minDate="minDate"
          :maxDate="maxDate" @closeOnClickOverlay="showdatetime = false" @close="showdatetime = false"
          @cancel="showdatetime = false" @confirm="confirm_datetime"></u-datetime-picker>
      </view>
      <view class="cell-item" v-if="source !== 2">
        <text class="cell-item-label">性别</text>
        <u-radio-group v-model="forms.sex" placement="row">
          <u-radio label="男" :name="1" />
          <u-radio label="女" :name="2" style="margin-left: 12px;" />
        </u-radio-group>
      </view>
      <view class="cell-item">
        <text class="cell-item-label">身高(cm)</text>
        <u-input inputAlign="right" fontSize="14px" type="number" placeholder="请输入身高" border="none"
          v-model="forms.height" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">体重(kg)</text>
        <u-input inputAlign="right" fontSize="14px" type="number" placeholder="请输入体重" border="none"
          v-model="forms.weight" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">三围(cm)</text>
        <view class="cell-item-center">
          <u-input inputAlign="right" fontSize="14px" type="number" placeholder="请输入三围" border="none"
            v-model="forms.size" />
        </view>
      </view>
      <view class="cell-item">
        <text class="cell-item-label">颜值(1-10分)</text>
        <u-number-box class="cell-item-position-ipt" :min="1" :max="10" :showMinus="false" :showPlus="false"
          bgColor="transparent" placeholder="请输入颜值" v-model="forms.faceScore" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">个人简介</text>
        <u-input inputAlign="right" fontSize="14px" type="text" placeholder="请输入个人简介" border="none"
          v-model="forms.remark" />
      </view>
      <view class="cell-item">
        <text class="cell-item-label">活跃城市</text>
        <view class="cell-item-t" :style="!forms.activeCity ? 'color:rgb(192, 196, 204)' : ''" @tap="oper('city')">
          {{ forms.activeCity || '选择城市' }}
        </view>
      </view>
      <view class="cell-item">
        <text class="cell-item-label">最低消费(元)</text>
        <u-input inputAlign="right" fontSize="14px" type="number" placeholder="请输入最低消费" border="none"
          v-model="forms.minCharge" />
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">上传照片</text>
          <u-upload :fileList="fileListPic" @afterRead="afterReadPic" @delete="deletePic" name="1" multiple
            :maxCount="8">
          </u-upload>
        </view>
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">上传视频</text>
          <view class="flexrow" v-if="forms.videoUrl">
            <view class="videobox" @tap="previewVideo(fileListVideo[0])">
              <video :src="fileListVideo[0].url" />
            </view>
            <view class="video-delate" @tap.stop="deleteVideo(fileListVideo[0])">删除</view>
          </view>

          <u-upload v-else accept="video" :fileList="fileListVideo" @afterRead="afterReadVideo" @delete="deleteVideo"
            name="1" multiple :maxCount="1" previewFullImage>
          </u-upload>


          <!-- <u-upload accept="video" :fileList="[]" :showUploadList="false" @afterRead="afterReadVideo"
            name="videoUploader" :maxCount="1">
            <view slot="add-btn" class="custom-upload-btn">
              <u-icon name="plus" size="28" color="#999" />
              <text>上传视频</text>
            </view>
          </u-upload>

          <view v-if="forms.videoUrl" class="video-preview" @tap="previewVideo(fileListVideo[0])">
            <image src="/static/per/video_cover.png" mode="aspectFill" class="video-thumb" />
            <view class="play-icon-overlay">
              <u-icon name="play-circle" size="40" color="#fff" />
            </view>
          </view> -->

        </view>
      </view>
      <view class="cell-item">
        <view class="cell-item-vertical">
          <text class="cell-item-label" style="margin-bottom: 12px">服务介绍</text>
          <u--textarea v-model="forms.description" placeholder="请输入内容" />
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
    forms: {},
    source: 1, // 来源 1-个人认证 2-商户认证
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad ({ source, title }) {
    if (title) {
      uni.setNavigationBarTitle({ title })
    }
    this.source = Number(source) || 1; // 默认个人认证
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
      const { id: userId, nickName, avatar, birthday, height, weight, size, faceScore, remark, description, minCharge, activeCity, images, videoUrl, wechat, qq, phone, yuni, telegeam, authStatus, sex, certificationType } = this.getUserInfo

      this.fileListPic = images ? images.split(',').map(url => ({ url })) : [];
      this.fileListVideo = videoUrl ? [{ url: videoUrl, name: '视频', status: 'success', type: 'video' }] : [];

      return this.source === 2 ? {
        userId: '', // 用户ID
        nickName: '', // 昵称
        avatar: '', // 头像
        birthday: parseTime(new Date().getTime(), '{y}-{m}-{d}'), // 生日
        height: '', // 身高
        weight: '', // 体重
        size: '', // 三围
        faceScore: 6.5, // 颜值评分
        remark: '', // 个人简介
        description: '', // 详情描述
        minCharge: '', // 最低消费
        activeCity: '', // 活动城市
        images: '', // 照片
        videoUrl: '', // 视频
        wechat: '', // 微信号
        qq: '', // QQ号
        phone: '', // 手机号
        yuni: '', // 与你账号
        telegeam: '', // Telegram账号
        authStatus: 0, // 认证状态 0-未认证, 1-认证中, 2-已认证, 3-认证失败
        sex: 2, // 性别 1-男, 2-女
        certificationType: 1, // 认证类型 1-个人认证, 2-商户认证
      } : { userId, nickName, avatar, birthday: birthday || parseTime(new Date().getTime(), '{y}-{m}-{d}'), height, weight, size, faceScore: faceScore || 6.5, remark, description, minCharge, activeCity, images, videoUrl, wechat, qq, phone, yuni, telegeam, authStatus: authStatus || 0, sex: sex || 2, certificationType: certificationType || 1 }

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

    // parseTime (time, format = '{y}-{m}-{d}') {
    //   return parseTime(time, format);
    // },

    confirm_datetime (date) {
      this.showdatetime = false;
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
          const res = await uni.$api[this.source === 2 ? 'authAdd' : 'userAuth'](this.forms)
          console.log('提交认证', res)
          uni.navigateBack()
        }
      }[type])?.()
    },

    async afterReadPic (file) {
      // file 是一个对象，包含 file 和 name
      const files = Array.isArray(file.file) ? file.file : [file.file];

      uni.showLoading({ title: '图片上传中', mask: true });
      for (let f of files) {
        const res = await uni.$api.uploadFile(f.url);
        this.fileListPic.push({ url: res.url }); // 保留格式
      }

      this.forms.images = this.fileListPic.map(item => item.url).join(',');
      uni.hideLoading();
    },

    deletePic ({ file }) {
      const index = this.fileListPic.findIndex(item => item.url === file.url);
      console.log('删除的索引', index, '文件', file, '列表', this.fileListPic);
      if (index !== -1) {
        this.fileListPic.splice(index, 1);
        this.forms.images = this.fileListPic.map(item => item.url).join(',');
      }
    },


    async afterReadVideo (file) {
      const rawFile = Array.isArray(file.file) ? file.file[0] : file.file;

      if (rawFile.size > 200 * 1024 * 1024) return uni.$toast('视频不能超过200MB');

      uni.showLoading({ title: '视频上传中', mask: true });

      const res = await uni.$api.uploadFile(rawFile.url);

      this.fileListVideo = [{
        url: res.url, // 真实网络地址
        name: '视频', // 可选
        status: 'success', // 可选，部分组件用来显示状态
        type: 'video'
      }];

      this.forms.videoUrl = res.url;

      uni.hideLoading();
    },

    deleteVideo (file) {
      this.fileListVideo = [];
      this.forms.videoUrl = '';
    },

    previewVideo (file) {
      console.log('预览视频文件', file);
      if (!file || !file.url) {
        return uni.$toast('视频文件不存在');
      }
      const url = file.url;
      uni.navigateTo({
        url: `/pages/common/videoPreview?url=${encodeURIComponent(url)}`
      });
    },


    rules () {
      return new Promise((resolve, reject) => {
        const rules = [
          { name: 'avatar', required: true, message: '请上传头像' },
          { name: 'nickName', required: true, message: '请输入昵称' },
          { name: 'birthday', required: true, message: '请选择生日' },
          { name: 'sex', required: true, message: '请选择性别' },
          { name: 'height', required: true, message: '请输入身高' },
          { name: 'weight', required: true, message: '请输入体重' },
          { name: 'size', required: true, message: '请输入三围' },
          { name: 'faceScore', required: true, message: '请输入颜值评分' },
          { name: 'remark', required: true, message: '请输入个人简介' },
          { name: 'activeCity', required: true, message: '请选择活跃城市' },
          { name: 'minCharge', required: true, message: '请输入最低消费' },
          { name: 'images', required: true, message: '请上传照片' },
          { name: 'videoUrl', required: true, message: '请上传视频' },
          { name: 'description', required: true, message: '请输入详情介绍' },

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
