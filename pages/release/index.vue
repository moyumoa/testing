<template>
  <view class="container">
    <view class="slogan">
      <image class="slogan-img" src="/static/logo.png" />
    </view>

    <view class="warps">
      <view class="list">
        <view class="list-item" v-for="(item, index) in listd" :key="index" @tap="tap_to(item.ident)">
          <view class="list-item-l">
            <image class="list-item-l-icon" :src="item.icon" />
          </view>
          <view class="list-item-c">
            <text class="list-item-c-t">{{ item.name }}</text>
            <text class="list-item-c-t2">{{ item.desc }}</text>
          </view>
          <view class="list-item-r">
            <text class="list-item-r-t" v-if="item.sum >= 0">剩余 {{ item.sum }} 次</text>
            <u-icon name="arrow-right" size="14" color="#aeaeae" class="list-item-r-icon" />
          </view>
        </view>
      </view>

      <view class="horizontal-list" v-if="!getUserInfo.certificationType">
        <view class="horizontal-list-item">
          <image class="horizontal-list-item-img" src="/static/per/g-1.png" />
          <text class="horizontal-list-item-t">女郎认证</text>
        </view>
        <view class="horizontal-list-item">
          <image class="horizontal-list-item-img" src="/static/per/g-2.png" />
          <text class="horizontal-list-item-t">商家入驻</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({

  }),
  computed: {
    ...mapGetters(['getUserInfo']),
    listd () {
      return [
        ...(this.getUserInfo?.certificationType === 2 && [{ ident: 'mc', name: '商家发布', icon: '/static/images/f-g-1.png', desc: '请遵守社区规范', sum: this.getUserInfo.createCount || 0 }] || []),
        { ident: 'post', name: '发布帖子', icon: '/static/images/f-g-1.png', desc: '请遵守社区规范', sum: -1 },
        { ident: 'dynamic', name: '发布动态', icon: '/static/images/f-g-1.png', desc: '请遵守社区规范', sum: -1 }
      ]
    }
  },
  methods: {
    tap_to (ident) {
      ({
        'mc': () => uni.navigateTo({ url: '/pages/personal/info?source=2&title=发布女郎' }),
        'post': () => uni.navigateTo({ url: '/pages/release/post' }),
        'dynamic': () => uni.navigateTo({ url: '/pages/release/dynamic' })
      }[ident] || (() => uni.showToast({ title: '功能未开放', icon: 'none' })))?.()
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100dvh;
  background-color: #F7F7F7;
  position: relative;
}

.slogan {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;

  &-img {
    width: 100%;
    height: 100px;
  }
}

.warps {
  position: absolute;
  bottom: 88px;
  left: 0;
  right: 0;
}

.list {
  margin-bottom: 48px;
}

.list-item {
  display: flex;
  align-items: center;
  margin: 14px 16px;
  padding: 14px 16px;
  background-color: #fff;
  border-radius: 14px;

  // &:nth-child(1){
  //   background: linear-gradient( -270deg, #FFEBEC 0%, #FFF6F6 50%, #FFFFFF 100%);
  // }
  // &:nth-child(2){
  //   background: linear-gradient( -270deg, #ECF4FF 0%, #F8FBFF 58%, #FFFFFF 100%);
  // }
  // &:nth-child(3){
  //   background: linear-gradient( -90deg, #FFFEFE 0%, #FEF9F5 45%, #FFEEE6 100%);
  // }

  &-l {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    margin-right: 10px;

    &-icon {
      width: 100%;
      height: 100%;
      border-radius: 12px;
    }
  }

  &-c {
    width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;

    &-t {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }

    &-t2 {
      margin-top: 4px;
      font-size: 12px;
      color: #666;
    }
  }

  &-r {
    flex-shrink: 0;
    display: flex;
    align-items: center;

    &-t {
      font-size: 12px;
      color: #aeaeae;
      margin-right: 5px;
    }
  }
}

.horizontal-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 16px 16px;


  &-item {
    flex: 1;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    background-color: #fff;
    border-radius: 12px;
    padding: 12px 16px;
    box-sizing: border-box;

    &:nth-child(2n) {
      margin-left: 16px;
    }

    &-img {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      object-fit: cover;
    }

    &-t {
      margin-left: 16px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>