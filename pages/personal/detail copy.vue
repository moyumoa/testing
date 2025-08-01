<template>
  <view style="background: #fdfdfd;" @touchmove="hide_keyboard">
    <view class="tui-banner-swiper">
      <!-- :style="{'height': `calc(${statusBar + 44}px + 800rpx)`}" -->
      <swiper class="tui-banner__height" :style="{ 'height': `calc(${statusBar + 44}px + 800rpx)` }"
        @change="bannerChange" circular :indicator-dots="false" :autoplay="false" :interval="5000" :duration="150">
        <block v-for="(item, index) in swiperlist" :key="index">
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
          <text class="numerical-item-boldt">{{ formatNum(detail.attentionCount) }}</text>
          <text class="numerical-item-t">关注</text>
        </view>
        <view class="numerical-item">
          <text class="numerical-item-boldt">{{ formatNum(detail.fansCount) }}</text>
          <text class="numerical-item-t">粉丝</text>
        </view>
        <view class="numerical-item">
          <text class="numerical-item-boldt">{{ formatNum(detail.dealCount) }}</text>
          <text class="numerical-item-t">成交单数</text>
        </view>
      </view>

      <view class="ptitle">
        <text class="ptitle-t">{{ detail.nickName }}</text>
        <image class="ptitle-icon" src="/static/per/hy-icon.png" v-if="detail.isVip" />
        <image class="ptitle-icon" src="/static/per/p-2.png" v-if="detail.certificationType === 2" />
        <text class="ptitle-t2">00后</text>
      </view>
      <view class="ptitle2" v-if="detail.certificationType === 2">
        <image class="ptitle2-icon" src="/static/per/p-5.png" />
        <text class="ptitle2-t">店铺押金保障</text>
      </view>
      <view class="introduction">
        <text class="introduction-t">个人介绍: {{ detail.remark }}</text>
      </view>

      <view class="navbar">
        <view class="navbar-item" :class="{ 'navbar-item-active': currentNav === 1 }" @tap="changeNav(1)">
          <text class="navbar-item-t">{{ whose }}资料</text>
        </view>
        <view class="navbar-item" :class="{ 'navbar-item-active': currentNav === 2 }" @tap="changeNav(2)">
          <text class="navbar-item-t">{{ whose }}发布</text>
        </view>
      </view>

      <template v-if="currentNav === 1">
        <view class="simplegrid">
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">身高</text>
            <text class="simplegrid-item-t2">{{ detail.height }}cm</text>
          </view>
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">体重</text>
            <text class="simplegrid-item-t2">{{ detail.weight }}kg</text>
          </view>
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">三围</text>
            <text class="simplegrid-item-t2">{{ detail.size }}</text>
          </view>
          <view class="simplegrid-item">
            <text class="simplegrid-item-t1">颜值</text>
            <text class="simplegrid-item-t2">{{ detail.faceScore }}</text>
          </view>
        </view>

        <view class="ctext">
          <text class="ctext-t">活跃城市：</text>
          <text class="ctext-t2">{{ detail.activeCity }}</text>
        </view>
        <view class="ctext">
          <text class="ctext-t">最低消费：</text>
          <text class="ctext-t2">{{ detail.minCharge }}</text>
        </view>
        <view class="ctext">
          <text class="ctext-t">服务介绍：</text>
          <text class="ctext-t2">{{ detail.description }}</text>
        </view>
      </template>

      <template v-if="currentNav === 2">
        <view class="visgrid">
          <view class="visgrid-title">
            <text class="visgrid-title-t">{{ whose }}动态</text>
            <u-icon name="arrow-right" color="#333" size="16" />
          </view>
          <view class="visgrid-list">
            <view class="visgrid-list-item">
              <video class="visgrid-list-item-video" ref="video1"
                src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4" id="videoId" @play="play"
                @fullscreenchange="fullscreenchange"></video>
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
          </view>
        </view>
        <view class="visgrid">
          <view class="visgrid-title">
            <text class="visgrid-title-t">{{ whose }}帖子</text>
            <u-icon name="arrow-right" color="#333" size="16" />
          </view>
          <view class="visgrid-list">
            <view class="visgrid-list-item">
              <video class="visgrid-list-item-video" src=""></video>
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
            <view class="visgrid-list-item">
              <image class="visgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
            </view>
          </view>
        </view>
        <view class="visgrid-title visgrid-title-bg">
          <view class="visgrid-title-box">
            <image class="visgrid-title-box-icon" src="/static/per/p-4.png" />
            <view class="visgrid-title-box-txts">
              <text class="visgrid-title-box-txts-t1">商户名称商户名称</text>
              <text class="visgrid-title-box-txts-t2">入驻商家</text>
            </view>
          </view>
          <u-icon name="arrow-right" color="#333" size="16" />
        </view>
        <view class="visgrid">
          <view class="visgrid-title">
            <text class="visgrid-title-t">{{ whose }}报告</text>
            <u-icon name="arrow-right" color="#333" size="16" />
          </view>
          <view class="visgrid-items">
            <view class="uoverview">
              <view class="uoverview-l">
                <image class="uoverview-l-avatar" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="uoverview-c">
                <view class="uoverview-c-top">
                  <text class="uoverview-c-top-t">哈哈哈哈</text>
                  <u-icon label="黄金会员" size="16" labelColor="#9C7E58" labelSize="12" name="/static/per/hy-icon.png" />
                </view>
                <view class="uoverview-c-bottom">
                  <text class="uoverview-c-bottom-t">0000-00-00 00:00 发布</text>
                </view>
              </view>
            </view>

            <view class="ctext">
              <text class="ctext-t">妹子花名：</text>
              <text class="ctext-t2">思思</text>
            </view>
            <view class="ctext">
              <text class="ctext-t">交易时间：</text>
              <text class="ctext-t2">0000-00-00 00:00</text>
            </view>
            <view class="ctext">
              <text class="ctext-t">所在位置：</text>
              <text class="ctext-t2">哦哦哦发哦iu否啊搜i</text>
            </view>
            <view class="ctext" style="justify-content: space-between;">
              <view class="ctext-inner">
                <text class="ctext-t">消费评价：</text>
                <u-rate :value="3" readonly></u-rate>
              </view>
              <view class="ctext-inner">
                <text class="ctext-t">消费金额：¥1000</text>
              </view>
            </view>
            <view class="ctext-t3">消费评价消费评价消费评价消费评价</view>
          </view>

          <view class="visgrid-items">
            <view class="uoverview">
              <view class="uoverview-l">
                <image class="uoverview-l-avatar" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="uoverview-c">
                <view class="uoverview-c-top">
                  <text class="uoverview-c-top-t">哈哈哈哈</text>
                  <u-icon label="黄金会员" size="16" labelColor="#9C7E58" labelSize="12" name="/static/per/hy-icon.png" />
                </view>
                <view class="uoverview-c-bottom">
                  <text class="uoverview-c-bottom-t">0000-00-00 00:00 发布</text>
                </view>
              </view>
            </view>

            <text class="visgrid-items-positiont">精品</text>
            <image class="visgrid-items-positionicon" src="/static/per/p-3.png" />

            <view class="ctext">
              <text class="ctext-t">妹子花名：</text>
              <text class="ctext-t2">思思</text>
            </view>
            <view class="ctext">
              <text class="ctext-t">交易时间：</text>
              <text class="ctext-t2">0000-00-00 00:00</text>
            </view>
            <view class="ctext">
              <text class="ctext-t">所在位置：</text>
              <text class="ctext-t2">哦哦哦发哦iu否啊搜i</text>
            </view>
            <view class="ctext" style="justify-content: space-between;">
              <view class="ctext-inner">
                <text class="ctext-t">消费评价：</text>
                <u-rate :value="3" readonly></u-rate>
              </view>
              <view class="ctext-inner">
                <text class="ctext-t">消费金额：¥1000</text>
              </view>
            </view>
            <view class="ctext-t3">消费评价消费评价消费评价消费评价</view>
          </view>
        </view>
      </template>

    </view>

    <view class="subbtns" v-if="oneself && detail.isCertification === 1">
      <view class="subbtns-item" @tap="oper('修改资料')">
        <text class="subbtns-item-t">修改资料</text>
      </view>
    </view>
    <view class="subbtns" v-if="!oneself">
      <view class="subbtns-item subbtns-nobg" @tap="oper('follow')">
        <text class="subbtns-item-t">{{ relation.attion ? '已关注' : '关注' }}</text>
      </view>
      <view class="subbtns-item subbtns-nobg" @tap="oper('unlock')">
        <text class="subbtns-item-t">{{ relation.chat ? '查看联系方式' : '解锁联系方式' }}</text>
      </view>
      <view class="subbtns-item">
        <text class="subbtns-item-t">去预约</text>
      </view>
    </view>

    <t-pay-way neededs="3,4" payTxt="立即解锁" :payPrice="1" :show="showPay" @close="showPay = false" @pay="submitPay" />


    <u-popup :show="showUnlock" :round="10" mode="bottom" @close="closeUnlock" @open="openUnlock" closeable>
      <view class="unlock">
        <view class="unlock-header">
          <text class="unlock-header-t">联系方式已解锁</text>
        </view>

        <view class="unlock-body">
          <view class="unlock-list">
            <view class="unlock-list-item" v-for="(item, index) in ContactInformation" :key="index">
              <view class="unlock-list-item-l">
                <text class="unlock-list-item-l-t">{{ item.type }}: {{ item.value }}</text>
              </view>
              <view class="unlock-list-item-r">
                <text class="unlock-list-item-r-t">复制</text>
              </view>
            </view>
          </view>

        </view>

        <view class="unlock-btns">
          <view class="unlock-btns-item" @tap="oper('chat')">
            <text class="unlock-btns-item-t">去聊天</text>
          </view>
          <view class="unlock-btns-item unlock-btns-item-active" @tap="closeUnlock">
            <text class="unlock-btns-item-t">查看订单</text>
          </view>
        </view>
      </view>
    </u-popup>
    <u-loading-page :loading="loading" loading-text="loading..." font-size="14" iconSize="20"></u-loading-page>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatNum } from '@mvmoo/us'

export default {
  data: () => ({
    oneself: false, // 是否是自己
    currentNav: 1, // 当前导航
    value: 1, // 评分
    loading: false,
    statusBar: uni.getSystemInfoSync().statusBarHeight,
    current: 0,
    count: 20,
    // swiperHeight: 0,

    showPay: false, // 是否显示支付弹窗
    showUnlock: false, // 是否显示解锁联系方式弹窗

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
    swiperlist: [],
    listArr: [],
    detail: {},
    price: 0,
    selected: {},
    category: 3,
    ptype: 1, //1是商城跳详情 2是拍卖跳详情

    showPop: false,
    previewContent: {},
    options: {},
    // 关系
    relation: {},
  }),

  onShow () {
    this.getUserRelation()
  },

  async onLoad (options) {
    if (options.source === 'mc') {
      const res = await uni.$api.authDetailById({ id: options.id })
      options.userId = res.data?.userId || options.id // 获取用户ID
    }
    this.options = options
    this.oneself = String(options.userId) === String(this.getUserInfo.id)
    this.getAuthDetail()
  },

  computed: {
    ...mapGetters(['getUserInfo']),
    whose () {
      return this.oneself ? '我的' : 'Ta的'
    },
    ContactInformation () {
      return [
        { type: '手机号', value: this.detail.phone },
        { type: '微信', value: this.detail.wechat },
        { type: 'QQ', value: this.detail.qq },
        { type: '与你', value: this.detail.yuni },
        { type: 'Telegeam', value: this.detail.telegeam },
      ].filter(item => item.value) // 过滤掉没有值的联系方式
    },
  },

  methods: {
    openUnlock () {
      this.showUnlock = true
    },
    closeUnlock () {
      this.showUnlock = false
    },


    formatNum (val) { return formatNum(val) },
    /* 根据传入的出生日计算年龄段 例如:85后 90后 00后 10后 */
    ageGroup (birthday) {
      const year = new Date(birthday).getFullYear();
      if (isNaN(year)) return '未知';
      const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
      return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
    },
    // 获取自己与他人的关系
    async getUserRelation () {
      const res = await uni.$api.userRelation({ userId: this.getUserInfo.id, customerId: this.options.userId })
      console.log('获取自己与他人的关系', res)
      this.relation = res.data || {}
    },
    changeNav (index) {
      this.currentNav = index
      if (index === 1) {
        // 切换到个人资料
      } else if (index === 2) {
        // 切换到个人发布
      }
    },
    // 获取认证详情
    async getAuthDetail () {
      this.loading = true
      const res = await uni.$api.authDetail({ userId: this.options.userId })
      const imgArr = res.data?.images?.split(',')?.map(item => {
        return item.trim()
      }) || []
      this.swiperlist = await Promise.all(imgArr.map(async (url, index) => {
        const height = await this.computedImgInfo(url);
        return { url, height }
      }))
      this.count = this.swiperlist.length
      this.listArr = this.swiperlist.map(item => item.url)
      this.detail = {
        ...res.data,
        images: this.swiperlist,
        dealCount: formatNum(res.data.dealCount),
        fansCount: formatNum(res.data.fansCount),
        attentionCount: formatNum(res.data.attentionCount),
        ageGroup: this.ageGroup(res.data.birthday)
      }
      this.loading = false
    },

    submitPay ({ amount, payType }) {
      console.log('提交支付', amount, payType)
      // // 提交支付
      // uni.$api.unlockContact({
      //   userId: this.getUserInfo.id,
      //   attentionId: this.options.userId,
      //   amount,
      //   payType
      // }).then(res => {
      //   uni.$toast('支付成功')
      //   this.showUnlock = false
      //   this.relation.chat = true // 更新关系状态
      //   this.getAuthDetail() // 刷新认证详情
      // }).catch(err => {
      //   console.error('支付失败', err)
      //   uni.$toast('支付失败，请稍后再试')
      // })
      this.showPay = false;
      this.openUnlock()
    },

    // 去聊天
    naviChat (item) {
      uni.navigateTo({
        url: `/pages/message/chat?channelID=${item.imUid}&channelType=1`
      })
    },

    // oper操作
    oper (val) {
      ({
        '修改资料': () => {
          // 跳转到修改资料页面
          uni.navigateTo({ url: `/pages/certification/individual` })
        },
        'follow': async () => {
          // 已关注就取消关注 未关注就关注
          if (this.relation?.attion) {
            await uni.$api.unfollowUser({ userId: this.getUserInfo.id, attentionId: this.options.userId })
          } else {
            await uni.$api.followUser({ userId: this.getUserInfo.id, attentionId: this.options.userId })
          }

          this.$set(this.relation, 'attion', !this.relation.attion)
          uni.$toast(this.relation.attion ? '已关注' : '已取消关注')
          this.getAuthDetail()
        },
        'unlock': () => {
          // 查看联系方式
          if (this.relation?.chat) {
            // uni.navigateTo({ url: `/pages/personal/chat?userId=${this.options.userId}` })
            this.openUnlock()
          } else {
            this.showPay = true
            // this.showUnlock = true
          }
        },
        'chat': () => {
          // 去聊天
          this.naviChat(this.detail)
          this.closeUnlock()
        },
      }[val] || (() => {
        console.warn(`未定义的操作: ${val}`);
      }))?.();
    },

    // 播放时进入全屏
    play (index) {
      let videoContext = uni.createVideoContext('videoId', this)
      videoContext.requestFullScreen()
    },

    //退出全屏时暂停
    fullscreenchange (e) {
      if (!e.detail.fullScreen) {
        uni.createVideoContext('videoId', this).pause();
      }
    },
    //退出全屏时停止
    fullscreenchange (e) {
      if (!e.detail.fullScreen) {
        uni.createVideoContext('videoId', this).stop();
      }
    },
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


.simplegrid {
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

.visgrid {
  margin: 16px 0;
  padding-bottom: 22px;
  background-color: #fff;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &-bg {
      background-color: #f8f8fe;
      padding: 12px;
      border-radius: 8px;
    }

    &-t {
      font-size: 15px;
      color: #333;
    }

    &-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px;

      &-icon {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }

      &-txts {
        display: flex;
        flex-direction: column;

        &-t1 {
          font-size: 14px;
          color: #333;
        }

        &-t2 {
          font-size: 12px;
          color: #adadad;
        }
      }
    }
  }



  &-list {
    display: flex;
    overflow-x: scroll;

    &-item {
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      border-radius: 8px;
      margin-right: 12px;
      overflow: hidden;

      &-video {
        width: 100%;
        height: 100%;
      }

      &-pic {
        width: 100%;
        height: 100%;
      }
    }
  }

  &-items {
    padding: 16px 0;
    border-bottom: 1px dashed #eee;
    position: relative;

    &-positiont {
      position: absolute;
      top: 32px;
      right: 16px;
      font-size: 16px;
      color: rgba(255, 96, 101, 1);
      transform: rotate(45deg);
    }

    &-positionicon {
      position: absolute;
      top: 82px;
      right: 16px;
      width: 32px;
      height: 26px;
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

.unlock {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;

  &-header {
    padding: 16px;
    border-bottom: 1px solid #eee;

    &-t {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
  }

  &-body {
    padding: 16px;
    overflow-y: auto;
    height: calc(100% - 80px); // 减去头部和底部按钮的高度

    &::-webkit-scrollbar {
      display: none; // 隐藏滚动条
    }
  }

  &-list {
    margin: 0;
    padding: 0;
    list-style: none;

    &-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #eee;

      &-l {
        flex: 1;
        font-size: 14px;
        color: #333;
      }

      &-r {
        flex-shrink: 0;
        color: #739af7;
        cursor: pointer;

        &-t {
          font-size: 13px;
        }
      }
    }
  }

  &-btns {
    display: flex;
    justify-content: space-between;
    padding: 16px;

    &-item {
      flex: 1;
      text-align: center;
      padding: 8px 12px;
      border-radius: 32px;
      background-color: #efefef;
      color: #223;
      font-size: 15px;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }

      &-active {
        background-color: #e79959; // 深绿色
        color: #fff;
      }

      &-t {
        // font-weight: bold;
      }
    }
  }

}
</style>
