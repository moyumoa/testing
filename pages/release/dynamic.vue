<template>
  <view class="pagecontainer">
    <view class="cell">
      <view class="cell-item" style="border: none;">
        <u--textarea border="none" v-model="forms.description" placeholder="此时此刻想和大家说点什么呢~" maxlength="300" count />
      </view>

      <view class="cell-address">
        <view class="cell-address-item">
          <u-icon name="map" color="#333" size="12" style="margin-right: 2px;" />
          <text class="cell-address-item-t">{{ forms.cityAddress }}</text>
        </view>
      </view>

      <view class="cell-item">
        <view class="cell-item-several">
          <template v-if="fileListPic.length > 0">
            <view class="cell-item-pic" v-for="(item, index) in fileListPic" :key="index">
              <image :src="item" />
            </view>
          </template>
          <view class="cell-item-pic" v-if="forms.videoUrl" @tap="previewVideo(forms.videoUrl)">
            <video :src="forms.videoUrl" />
          </view>
          <view v-if="showUploaderBtn" class="cell-item-pic cell-item-btn" @tap="prepareChoice">
            <u-icon name="camera-fill" color="#ceced1" size="44" />
          </view>
        </view>
      </view>


      <view class="cell-item">
        <text class="cell-item-label">谁可以看</text>
        <div class="cell-item-radio"></div>
        <text class="cell-item-radio-item" :class="{ 'cell-item-radio-active': forms.seeStatus === 1 }"
          @tap="forms.seeStatus = 1">
          粉丝
        </text>
        <text class="cell-item-radio-item" :class="{ 'cell-item-radio-active': forms.seeStatus === 0 }"
          @tap=" forms.seeStatus = 0">
          所有人
        </text>
      </view>

      <view class="cell-item">
        <text class="cell-item-label">是否隐藏位置</text>
        <div class="cell-item-radio"></div>
        <text class="cell-item-radio-item" :class="{ 'cell-item-radio-active': forms.addHidden === 1 }"
          @tap="forms.addHidden = 1">
          是
        </text>
        <text class="cell-item-radio-item" :class="{ 'cell-item-radio-active': forms.addHidden === 0 }"
          @tap=" forms.addHidden = 0">
          否
        </text>
      </view>

      <view class="cell-item">
        <text class="cell-item-label">是否隐藏个人信息</text>
        <div class="cell-item-radio"></div>
        <text class="cell-item-radio-item" :class="{ 'cell-item-radio-active': forms.userHidden === 1 }"
          @tap="forms.userHidden = 1">
          是
        </text>
        <text class="cell-item-radio-item" :class="{ 'cell-item-radio-active': forms.userHidden === 0 }"
          @tap=" forms.userHidden = 0">
          否
        </text>
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item" @tap="oper('submit')">
        <text class="subbtns-item-t">
          发布
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { parseTime } from '@mvmoo/us'
import { getLocationAndAddress } from '@/utils/getLocation';

export default {
  data: () => ({
    fileListPic: [],
    forms: {
      title: '', // 帖子标题
      description: '', // 帖子内容
      wechat: '', // 微信号
      qq: '', // QQ号 
      phone: '', // 手机号
      yuni: '', // 与你号
      telegeam: '', // Telegeam号
      videoUrl: '', // 视频地址
      payType: 0, // 0 不收费 1 虚拟币解锁
      payAmount: 0, // 解锁所需虚拟币
      addHidden: 0, // 是否隐藏位置 1 是 0 否
      userHidden: 0, // 是否隐藏个人信息 1 是 0 否
      seeStatus: 0, // 谁可以看 0 所有人 1 粉丝
      lat: '', // 纬度
      lng: '', // 经度
      cityAddress: '', // 地址
    },
    options: {},
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
    showUploaderBtn () {
      // 如果没有视频和图片，则显示上传按钮
      return !this.forms.videoUrl && this.fileListPic.length < 9;
    }
  },
  async onLoad (options) {
    this.options = { ...options };
    const { lng, lat, address, regeocode } = await getLocationAndAddress()
    console.log('lng lat', lng, lat, address, regeocode)
    const sliceAddress = address.replace(/(.*?省|.*?市|.*?区|.*?县|.*?街道)/g, '').trim();
    this.forms.lat = lat;
    this.forms.lng = lng;
    this.forms.cityAddress = sliceAddress || '未知位置';
  },
  methods: {
    ...mapActions(['updateUserInfo']),

    prepareChoice () {
      // 如果列表中已经有图片就不可选视频 如果有视频不可选照片
      const hasVideo = this.forms?.videoUrl;
      const hasPic = this.fileListPic.length > 0;
      // 1. 选择图片 2. 选择视频
      uni.showActionSheet({
        itemList: ['选择图片', '选择视频'],
        success: (res) => {
          if (res.tapIndex === 0) {
            if (hasVideo) {
              uni.$toast('已选择视频，不能再选择图片');
              return;
            }
            this.upLoader('images');
          } else if (res.tapIndex === 1) {
            if (hasPic) {
              uni.$toast('已选择图片，不能再选择视频');
              return;
            }
            this.upLoader('videoUrl');
          }
        }
      });
    },

    upLoader (name) {
      //  如果是上传视频只能选择视频
      if (name === 'videoUrl') {
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
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: async res => {
            uni.showLoading({ title: '图片上传中', mask: true });
            const urls = [];
            try {
              for (const tempFilePath of res.tempFilePaths) {
                const f = await uni.$api.uploadFile(tempFilePath);
                urls.push(f.url); // 每张图上传完再上传下一张
              }

              this.$set(this.forms, [name], urls);
              this.fileListPic = [...urls];
            } finally {
              uni.hideLoading();
            }
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
          const res = await uni.$api.dynamicAdd({
            ...this.forms,
            // userId: this.options.userId,
            userId: this.getUserInfo.id,
            images: this.fileListPic.join(','),
          })
          await new Promise(resolve => setTimeout(resolve, 500));
          uni.$toast('发布成功');
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
          { name: 'description', required: true, message: '请输入动态内容' },
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

.title {
  padding: 16px;
  display: flex;
  align-items: center;

  &-t {
    font-size: 14px;
    color: #333;
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

  &-address {
    display: inline-block;
    max-width: 80dvw;
    border-radius: 24px;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.025);
    margin-bottom: 16px;

    &-item {
      display: flex;
      align-items: center;
      font-size: 11px;
      color: #333;

      &-t {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

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

    &-several {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    &-pic {
      width: calc((85dvw - 48px) / 3);
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      // background-color: rgba(0, 0, 0, 0.025);
      position: relative;

      &:nth-child(3n) {
        margin-right: 15dvw;
      }

      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      video {
        // 禁止点击
        pointer-events: none;
      }
    }

    &-btn {
      background-color: rgba(0, 0, 0, 0.025);
      transform: scale(0.9);
      transform-origin: center;
      border-radius: 12px;
    }

    &-label {
      flex-shrink: 0;
      width: 80px;
      font-size: 14px;
      color: #333;
      white-space: nowrap;
    }

    &-radio {
      flex: 1;
      display: flex;
      align-items: flex-end;

      &-item {
        padding: 2px 8px;
        border-radius: 24px;
        margin-left: 16px;
        font-size: 12px;
        color: #333;
        background-color: #f5f5f5;

        &.cell-item-radio-active {
          background-color: $ec;
          color: #fff;
        }
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
