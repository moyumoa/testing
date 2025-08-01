<template>
  <view class="invite-page">
    <view class="invite">
      <view class="invite-code">
        <image class="invite-code-bg" src="/static/images/per/icon/1171701229601.png"></image>
        <text class="invite-code-t">专属邀请码</text>
        <text class="invite-code-t2" @tap.stop="$fn.copy(info.spreadCode)">{{ info.spreadCode }}</text>
        <!-- <u-icon name="file-text" size="16" color="#fff" style="display: inline-block;" /> -->
      </view>

      <!-- <text class="rule" @tap="to_web">规则</text> -->

      <view class="invite-box">
        <view class="invite-box-item">
          <text class="invite-box-item-t">{{ info.total }}</text>
          <text class="invite-box-item-t2">我的邀请</text>
        </view>
        <view class="invite-box-item">
          <text class="invite-box-item-t">{{ info.teamTotal }}</text>
          <text class="invite-box-item-t2">团队成员</text>
        </view>
      </view>
    </view>

    <view class="invite-title">
      <text class="invite-title-t">邀请记录</text>
      <text class="invite-title-t2">共{{ info.total }}人</text>
    </view>

    <view class="list">
      <view class="list-item">
        <text class="list-item-t list-item-t-first">昵称</text>
        <text class="list-item-t list-item-t-first" v-if="false">身份</text>
        <text class="list-item-t list-item-t-first">邀请时间</text>
      </view>
      <view class="list-item" v-for="item in list" :key="item.id">
        <text class="list-item-t">{{ item.nickname }}</text>
        <text class="list-item-t" v-if="false">普通会员</text>
        <text class="list-item-t">{{ $fn.parseTime(item.time, '{y}-{m}-{d}') }}</text>
      </view>
    </view>

    <view class="perch"></view>

    <view class="share">
      <text class="share-t" @tap="basicDraw">生成邀请码</text>
      <text class="share-t" @tap="copy">复制邀请链接</text>
    </view>

    <tui-poster :width="560" :height="890" ref="poster" @ready="ready"></tui-poster>
  </view>
</template>

<script>
// import qrCode from '@/utils/weapp-qrcode.js';
export default {
  data: () => ({
    info: {},
    list: [],
    page: 1,
    finished: false,

    poster: '',
    init: false,
    basicPosterUrl: '',
    basicPosterData: [
      {
        type: 'image',
        src: '/static/images/poster.jpg',
        imgType: 2,
        style: {
          left: 0,
          top: 0,
          width: 560,
          height: 890,
          borderRadius: 0
        }
      },
      {
        type: 'image',
        src: '/static/images/169512418457534504.png',
        imgType: 2,
        style: {
          top: 760,
          left: 430,
          width: 120,
          height: 120,
          borderRadius: 10
        }
      }
    ],
  }),

  methods: {
    to_web () {
      uni.$web('https://cos.dajiapaipai.com/yszc/hygz.html')
    },

    // 获取邀请信息
    async getData () {
      const { data } = await uni.$api.getInviteInfo()
      this.info = data
    },

    // 获取邀请记录
    async getList () {
      const { data } = await uni.$api.inviteList({ page: this.page, limit: 10 })
      this.list = [...this.list, ...data.list]
      if (data.list.length < 10) {
        this.finished = true
      }
    },

    // 复制当前页面地址
    copy () {
      uni.setClipboardData({
        data: `${uni.publicUrl}/pages/login/login?c=${this.info.spreadCode}`,
        success: function () {
          uni.$toast('复制成功')
        }
      })
    },

    ready () {
      this.init = true
    },

    async basicDraw () {
      uni.showLoading()
      const result = await uni.$api.getQrcode({ content: `${uni.publicUrl}/pages/login/login?c=${this.info.spreadCode}` })
      this.basicPosterData[1].src = result.message
      uni.hideLoading()

      if (!this.init || !this.$refs.poster) return;
      if (this.basicPosterUrl) {
        uni.previewImage({
          urls: [this.basicPosterUrl]
        });
        return
      }
      uni.showLoading()
      this.$refs.poster.draw(this.basicPosterData, (filePath) => {
        // console.log('filePath', filePath)
        this.basicPosterUrl = filePath;
        console.log('basicPosterUrl', this.basicPosterUrl)

        uni.previewImage({
          urls: [filePath]
        });
        uni.hideLoading()
      })
    },

  },

  onLoad () {
    this.getData()
    this.getList()
  },

  onReachBottom () {
    console.log('上拉加载')
    if (this.finished) return
    this.page++
    this.getList()
    this.finished = true;
  }
}
</script>

<style lang="scss" scoped>
.invite-page {
  padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
}

.invite {
  position: relative;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 16px;
  border-radius: 5px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);

  .rule {
    position: absolute;
    top: 0;
    right: 0;
    padding: 16px;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
    opacity: 0.6;
  }

  &-code {
    width: 90%;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    // background-color: #f5f5f5;
    // background: linear-gradient(90deg, #d5e3ff 0%, #bad5ff 100%);
    margin-bottom: 16px;
    box-sizing: border-box;
    position: relative;

    &-bg{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      z-index: 1;
    }

    &-t {
      z-index: 2;
      position: absolute;
      left: 10%;
      top: 20%;
      font-size: 13px;
      color: #333;
      opacity: 0.8;
    }

    &-t2 {
      z-index: 2;
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -40%);
      font-size: 28px;
      color: #333;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgb(3, 255, 142);
    }
  }

  &-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 80px;
    padding: 12px;
    box-sizing: border-box;
    border-radius: 8px;

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      &-t {
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }

      &-t2 {
        margin-top: 5px;
        font-size: 14px;
        color: #333;
        opacity: 0.6;
      }
    }
  }

  &-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;

    &-t {
      font-size: $title-size;
      color: #333;
      font-weight: bold;
    }

    &-t2 {
      margin-left: 10px;
      font-size: 13px;
      color: #333;
      opacity: 0.6;
    }
  }
}

.list {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin: 16px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    box-sizing: border-box;
    border-bottom: 1px solid #f5f5f5;

    &-t {
      flex: 1;
      flex-shrink: 0;
      font-size: 14px;
      color: #333;
      opacity: 0.8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &-first {
        color: #333;
        opacity: 1;
        font-weight: bold;
      }
    }

  }
}

.perch {
  height: calc(env(safe-area-inset-bottom) + 100px);
  width: 100%;
}

.share {
  position: fixed;
  // bottom: calc(env(safe-area-inset-bottom) + 16px);
  bottom: env(safe-area-inset-bottom);
  left: var(--window-left);
	right: var(--window-right);

  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 16px;
  box-sizing: border-box;
  margin: 16px;

  &-t {
    background-color: #c4db9f;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    height: 44px;
    width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    margin-right: 10px;
    font-size: 16px;
    color: #fff;
    opacity: 0.8;
  }
}
</style>