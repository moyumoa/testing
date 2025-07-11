<template>
  <view style="background: #fdfdfd;" @touchmove="hide_keyboard">
    <template>
      <view class="tui-banner-swiper">
        <!-- :style="{'height': `calc(${statusBar + 44}px + 800rpx)`}" -->
        <swiper class="tui-banner__height" :style="{ 'height': `calc(${statusBar + 44}px + 800rpx)` }"
          @change="bannerChange" circular :indicator-dots="false" :autoplay="false" :interval="5000" :duration="150">
          <block v-for="(item, index) in list" :key="index">
            <swiper-item @tap="perview(item.url, index)" :style="{ '--swiper-bg': swiperBg(item.url) }" class="sw-item">
              <view class="sw-item-bg"></view>
              <image :src="item.url" class="swiper-img" mode="aspectFill" :style="{ 'height': item.height }" />
              <!--aspectFill  aspectFit -->
            </swiper-item>
          </block>
        </swiper>
        <tui-swiper-dot :count="count" :current="current" width="48rpx" height="12rpx" radius="82rpx" bottom="44rpx"
          backgroundColor="rgba(255,255,255,0.3)" activeBgColor="#fff" />
      </view>

      <view class="panel">
        <view class="numerical">
          <view class="numerical-item">
            <text class="numerical-item-boldt">99</text>
            <text class="numerical-item-t">关注</text>
          </view>
          <view class="numerical-item">
            <text class="numerical-item-boldt">9999</text>
            <text class="numerical-item-t">粉丝</text>
          </view>
          <view class="numerical-item">
            <text class="numerical-item-boldt">72</text>
            <text class="numerical-item-t">成交单数</text>
          </view>
        </view>

        <view class="ptitle">
          <text class="ptitle-t">名字名字</text>
          <image class="ptitle-icon" src="/static/per/hy-icon.png" />
          <image class="ptitle-icon" src="/static/per/p-2.png" />
          <text class="ptitle-t2">00后</text>
        </view>
        <view class="ptitle2">
          <image class="ptitle2-icon" src="/static/per/p-1.png" />
          <text class="ptitle2-t">店铺押金保障</text>
        </view>
        <view class="introduction">
          <text class="introduction-t">个人介绍: 介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍</text>
        </view>

        <view class="navbar">
          <view class="navbar-item navbar-item-active">
            <text class="navbar-item-t">个人资料</text>
          </view>
          <view class="navbar-item">
            <text class="navbar-item-t">我的发布</text>
          </view>
        </view>

        <view class="simplegrid">
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">身高</text>
            <text class="simplegrid-item-t2">168cm</text>
          </view>
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">体重</text>
            <text class="simplegrid-item-t2">48kg</text>
          </view>
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">三围</text>
            <text class="simplegrid-item-t2">80-60-89</text>
          </view>
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">颜值</text>
            <text class="simplegrid-item-t2">9.4</text>
          </view>
        </view>


      </view>


    </template>

    <u-loading-page :loading="loading" loading-text="loading..." font-size="14" iconSize="20"></u-loading-page>
  </view>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    statusBar: uni.getSystemInfoSync().statusBarHeight,
    current: 0,
    count: 20,
    // swiperHeight: 0,

    // 是否打开SKU弹窗
    skuKey: false,
    // SKU弹窗模式
    skuMode: 3,
    // 后端返回的商品信息
    goodList: {},
    list: [
      { id: 1, url: '/static/bgs/bg_chat.jpeg', height: '100%' },
      { id: 2, url: '/static/per/bg.png', height: '100%' },
    ],
    listArr: [],
    detail: {},
    price: 0,
    selected: {},
    id: '',
    category: 3,
    ptype: 1, //1是商城跳详情 2是拍卖跳详情

    showPop: false,
    previewContent: {}
  }),
  async onLoad ({ i, p = 1, category = 3 }) {
    this.id = i
    this.ptype = Number(p)
    this.category = Number(category)
    // this.getGoodsDetail()
  },

  onShow () {
    this.id && this.getGoodsDetail()
  },

  computed: {

  },

  methods: {
    auction_introduction_infos (e) {
      this.previewContent = e
    },
    hide_keyboard () {
      uni.hideKeyboard()
    },
    computedImgInfo (url) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: url,
          success: (img) => {
            const width = img.width;
            const height = img.height;
            const aspectRatio = width / height;
            // if (width < height) resolve(`100%`);
            // if (width > height) resolve(`calc(100% - (${this.statusBar}px + 44px))`);
            // if (width === height) resolve(`calc(100% - (${this.statusBar}px + 44px))`);
            if (width < height) resolve(`100%`);
            if (width >= height) resolve('800rpx');
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    },

    swiperBg (item) {
      return `url(${item})`
    },
    // 滑动图片
    bannerChange (e) {
      this.current = e.detail.current;
    },
    // 预览图片
    perview (item, index) {
      uni.previewImage({
        current: index,
        urls: this.listArr
      })
    },

    // 获取商品信息，并打开sku弹出
    openSkuPopup (e) {
      this.skuKey = true;
    },

    // sku组件
    onOpenSkuPopup (e) {
      console.log("监听 - 打开sku组件");
    },

    skuPopup (e) {
      // 判断e是否为对象
      if (typeof e === 'object') {
        // this.selected = e;
        this.price = e.price;
      }
      console.log("监听 - 关闭sku组件", e);
    },

    // 立即购买
    buyNow (selectShop) {
      console.log("监听 - 立即购买", selectShop);
      this.selected = selectShop;
      // this.price = selectShop.price;
      this.skuKey = false
      this.submit_order_auction()
    },

    // 获取商品详情
    async getGoodsDetail () {
      /* const apiName = {
        1: 'getSpecialDetail',
        2: 'getSpecialDetail',
        3: 'goodsDetail',
        4: 'getExchangeDetail',
        5: 'getShopGoodsDetail'
      }[this.category] */
      this.loading = true
      const apiName = {
        1: 'goodsDetail',
        2: 'auctionDetail',
        3: 'goodsDetail',
        4: 'getExchangeDetail',
        5: 'getShopGoodsDetail'
      }[this.ptype]
      const res = await uni.$api[apiName](this.id)
      const imgArr = this.ptype === 1 ? JSON.parse(res.data.productInfo.sliderImage) : JSON.parse(res.data.image)
      this.listArr = imgArr
      // this.list = JSON.parse(res.data.productInfo.sliderImage)

      this.detail = this.ptype === 2 ? res.data : res.data.productInfo
      this.price = this.detail.price

      try {
        this.list = await Promise.all(imgArr.map(async item => {
          const height = await this.computedImgInfo(item);
          return {
            url: item,
            height
          }
        }))
        this.count = await this.list.length
      } catch (error) {
        this.list = imgArr.map(item => {
          return {
            url: item,
            height: '100%'
          }
        })
        this.count = await this.list.length
      }

      this.goodList = res.data.productValue

      this.loading = false
    },

    async refresh (apiName) {
      const res = await uni.$api[apiName](this.id)
      // this.detail = res.data
      // this.price = res.data.price

      this.detail = this.ptype === 2 ? res.data : res.data.productInfo
      this.price = this.detail.price

      this.$refs.ar.getBidRecord()
    },


    // 立即购买
    async submit_order_auction () {
      const { productId, id: attrValueId, buy_num: productNum } = this.selected
      console.log('立即购买')
      if (this.selected?.id) {
        const res = await uni.$api.preOrder({
          category: this.detail.category,
          preOrderType: 'buyNow',
          orderDetails: [{ productId, attrValueId, productNum }]
        })
        console.log('预下单信息 提交', res)
        uni.navigateTo({
          url: `/pages/order/confirmOrder?preOrderNo=${res.data.preOrderNo}`
        })
        // uni.navigateTo({
        //   // url: `/pages/order/confirmOrder?goodsId=${this.detail.id}&specs=${this.selected.specs.join(' ')}&price=${this.price}`
        //   url: `/pages/order/confirmOrder?productId=${productId}&attrValueId=${sukId}&productNum=${buy_num}&preOrderType=buyNow`
        // })
      } else {
        this.skuKey = true
      }
    },

    // 立即兑换
    async submit_order_exchange () {

    }

  },

  // 下拉刷新
  onPullDownRefresh () {
    console.log('下拉刷新')
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },

  // 上拉加载
  onReachBottom () {
    console.log('上拉加载')
  }

}
</script>
<style lang="scss" scoped>
.tui-title__img {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.tui-title__img image {
  width: 352rpx;
  height: 32rpx;
}

.tui-banner-swiper {
  position: relative;
}

.tui-swiper-item {
  width: 100%;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  font-weight: 600;
}

.tui-banner__height {
  // height: calc(env(safe-area-inset-top) + 44px + 800rpx);
  // height: 1120rpx;

}

.sw-item {
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--swiper-bg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    // filter: blur(10px);
    opacity: 0.8;
    z-index: 0;
  }

  &-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.4);
    filter: blur(10px);
    backdrop-filter: blur(5px);
  }
}

.swiper-img {
  // width: 100%;
  // height: 100%;
  width: 750rpx;
  // height: calc(100% - env(safe-area-inset-top));
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  right: 0;
}

.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 16px 0;
  height: 44px;
  padding: 0 16px;

  &-item {
    flex: 1;
    text-align: center;
    color: #333;

    &-active {
      position: relative;
      color: #60B95D;

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 2px;
        background-color: #60B95D;

      }
    }

    &-t {
      font-size: 15px;
      font-weight: bold;
    }
  }
}

.simplegrid{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 16px 0;

  &-item {
    background-color: #f8f8f8;
    padding: 8px 0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:nth-child(1) {
      background: linear-gradient(135deg, #60B95D, #A0D8A0);
    }

    &:nth-child(2) {
      background: linear-gradient(135deg, #FFB6C1, #FF69B4);
    }

    &:nth-child(3) {
      background: linear-gradient(135deg, #ADD8E6, #87CEFA);
    }

    &:nth-child(4) {
      background: linear-gradient(135deg, #FFD700, #FFA500);
    }

    &-t1 {
      font-size: 12px;
      color: #fff;
      margin-bottom: 4px;
    }

    &-t2 {
      font-size: 13px;
      color: #fff;
    }
  }
}

.panel {
  background-color: #ffffff;
  border-radius: 18px 18px 0 0;
  padding: 12px 16px calc(80px + env(safe-area-inset-bottom));
  // padding: 12px;
  transform: translateY(-18px);

  .ptitle {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    &-t {
      font-size: 15px;
      color: #333;
      font-weight: bold;
      margin-right: 8px;
    }

    &-t2 {
      font-size: 12px;
      color: #eee;
      padding: 1px 8px;
      font-weight: normal;
      background-color: #60B95D;
      border-radius: 12px;
      transform: scale(0.9);
    }

    &-icon {
      width: 14px;
      height: 16px;
      margin-right: 8px;
    }
  }

  .ptitle2 {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    &-icon {
      width: 14px;
      height: 16px;
      margin-right: 8px;
    }

    &-t {
      font-size: 14px;
      color: #666;
    }
  }

  .introduction {
    padding: 12px;
    background-color: #f8f8f8;
    border-radius: 8px;

    &-t {
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
  }

  .numerical {
    display: flex;
    margin: 0 0 16px;

    &-item {
      text-align: center;
      margin-right: 16px;

      &-boldt {
        font-size: 20px;
        color: #333;
        font-weight: bold;
        margin-right: 8px;
      }

      &-t {
        font-size: 12px;
        color: #b2b2b2;
      }
    }
  }
}
</style>
