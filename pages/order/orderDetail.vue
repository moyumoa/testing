<template>
  <view class="container">
    <view class="tui-order-header">
      <image :src="getIcon('img_detail_bg.png')" mode="widthFix" class="tui-img-bg"></image>
      <view class="tui-header-content">
        <view>
          <!-- <view class="tui-status-text">{{ getStatusText(info.status) }}</view> -->
          <view class="tui-status-text">{{ info.statusTitle }}</view>
          <view class="tui-reason">
            <text class="tui-reason-text">{{ info.orderStatusMsg }}</text>
            <!-- <text class="tui-reason-text">{{ getReason(info.status) }}</text>
            <tui-countdown :time="1800" color="rgba(254,254,254,0.75)" colonColor="rgba(254,254,254,0.75)"
              borderColor="transparent" backgroundColor="transparent" v-if="info.status === 1"></tui-countdown> -->
          </view>
        </view>
        <!-- <image :src="getImg(info.status)" class="tui-status-img" mode="widthFix"></image> -->
        <image :src="info.statusPic" class="tui-status-img" mode="widthFix"></image>
      </view>
    </view>
    <tui-list-cell arrow backgroundColor="#fefefe" @click="logistics" v-if="false">
      <view class="tui-flex-box">
        <image :src="getIcon('img_order_logistics3x.png')" class="tui-icon-img"></image>
        <view class="tui-logistics">
          <view class="tui-logistics-text">快递已到收货点，请注意查收哦! 投递员: echo. 联系电话: 17788849992</view>
          <view class="tui-logistics-time">2019-06-03 12:02</view>
        </view>
      </view>
    </tui-list-cell>
    <tui-list-cell unlined :hover="false">
      <view class="tui-flex-box">
        <image :src="getIcon('img_order_address3x.png')" class="tui-icon-img"></image>
        <view class="tui-addr">
          <view class="tui-addr-userinfo">{{ info.realName }}<text class="tui-addr-tel">{{ info.userPhone }}</text></view>
          <view class="tui-addr-text">{{ info.userAddress }}</view>
        </view>
      </view>
    </tui-list-cell>

    <view class="tui-order-item">
      <tui-list-cell :hover="false" lineLeft="0">
        <view class="tui-goods-title">
          商品信息
        </view>
      </tui-list-cell>
      <block v-for="(item, index) in info.orderInfoList" :key="item.productId">
        <tui-list-cell padding="0" @click="to_detail(item)">
          <view class="tui-goods-item">
            <image :src="item.image" class="tui-goods-img"></image>
            <view class="tui-goods-center">
              <view class="tui-goods-name">{{ item.storeName }}</view>
              <view class="tui-goods-attr">{{ item.sku }}</view>
            </view>
            <view class="tui-price-right">
              <view>￥{{ item.price }}</view>
              <view>x{{ item.cartNum }}</view>
            </view>
          </view>
        </tui-list-cell>
      </block>
      <view class="tui-goods-info">
        <view class="tui-price-flex tui-size24">
          <view>商品总额</view>
          <view>￥{{ info.proTotalPrice }}</view>
        </view>
        <view class="tui-price-flex  tui-size24" v-if="false">
          <view>优惠券</view>
          <view>￥0.00</view>
        </view>
        <view class="tui-price-flex  tui-size24">
          <view>运费</view>
          <view>￥{{ info.payPostage }}</view>
        </view>
        <view class="tui-price-flex tui-size32 tui-pbtm20" v-if="false">
          <view class="tui-flex-shrink">合计</view>
          <view class="tui-goods-price">
            <view class="tui-size-24">￥</view>
            <view class="tui-price-large">{{ info.totalPrice }}</view>
          </view>
        </view>
        <view class="tui-price-flex tui-size32">
          <view class="tui-flex-shrink">实付款</view>
          <view class="tui-goods-price tui-primary-color">
            <view class="tui-size-24">￥</view>
            <view class="tui-price-large">{{ info.totalPrice }}</view>
            <!-- <view class="tui-size-24">.00</view> -->
          </view>
        </view>
      </view>
    </view>

    <view class="tui-order-info">
      <tui-list-cell :hover="false">
        <view class="tui-order-title">
          {{ info.category === 1 ? '购买信息' : '订单信息' }}
        </view>
      </tui-list-cell>
      <view class="tui-order-content">
        <view class="tui-order-flex" v-if="info.orderId">
          <view class="tui-item-title">订单号:</view>
          <view class="tui-item-content">{{ info.orderId }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.deliveryName">
          <view class="tui-item-title">物流信息:</view>
          <view class="tui-item-content">{{ info.deliveryName }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.deliveryId">
          <view class="tui-item-title">物流单号:</view>
          <view class="tui-item-content">{{ info.deliveryId }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.createTime">
          <view class="tui-item-title">创建时间:</view>
          <view class="tui-item-content">{{ info.createTime }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.payTime">
          <view class="tui-item-title">付款时间:</view>
          <view class="tui-item-content">{{ info.payTime }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.deliveryTime">
          <view class="tui-item-title">发货时间:</view>
          <view class="tui-item-content">{{ info.deliveryTime }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.shippingType">
          <view class="tui-item-title">配送方式:</view>
          <view class="tui-item-content">{{ ['其它', '包邮'][info.shippingType] }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.buyPayTypeStr">
          <view class="tui-item-title">支付方式:</view>
          <view class="tui-item-content">{{ info.buyPayTypeStr }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.mark">
          <view class="tui-item-title">订单备注:</view>
          <view class="tui-item-content">{{ info.mark }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.contactName">
          <view class="tui-item-title">卖家姓名:</view>
          <view class="tui-item-content">{{ info.contactName }}</view>
        </view>
        <view class="tui-order-flex" v-if="info.category === 1">
          <view class="tui-item-title">付款凭证</view>
          <view class="tui-item-content" @tap.stop="lookCredentials(info, 'show_pop')">点击查看</view>
        </view>
        <view class="tui-order-flex" v-if="info.category === 1">
          <view class="tui-item-title">卖家电话</view>
          <view class="tui-item-content" @tap.stop="$fn.copy(info.contactPhone)">{{ info.contactPhone }}</view>
        </view>
      </view>

      <tui-list-view unlined="bottom" v-if="info.contactPhone">
        <tui-list-cell unlined>
          <view class="tui-contact" @tap="dial(info.contactPhone)">
            <image src="/static/images/mall/icons/icon_order_contactmerchant.png" />
            <text>{{ info.category === 1 ? '联系卖家' : '联系商家' }}</text>
          </view>
        </tui-list-cell>
      </tui-list-view>
    </view>

    <view class="tui-order-info" v-if="info.category === 1 && info.sellUserName">
      <tui-list-cell :hover="false">
        <view class="tui-order-title">
          出售信息
        </view>
      </tui-list-cell>
      <view class="tui-order-content">
        <view class="tui-order-flex">
          <view class="tui-item-title">支付方式:</view>
          <view class="tui-item-content">{{ info.sellPayTypeStr || '无' }}</view>
        </view>
        <view class="tui-order-flex">
          <view class="tui-item-title">买家姓名:</view>
          <view class="tui-item-content">{{ info.sellUserName || '无' }}</view>
        </view>
        <view class="tui-order-flex">
          <view class="tui-item-title">买家电话</view>
          <view class="tui-item-content" @tap.stop="$fn.copy(info.sellPhone)">{{ info.sellPhone }}</view>
        </view>

        <view class="tui-order-flex" v-if="info.category === 1">
          <view class="tui-item-title">收款凭证</view>
          <view class="tui-item-content" @tap.stop="lookCredentials(info, 'show_pop2')">点击查看</view>
        </view>
      </view>

      <tui-list-view unlined="bottom" v-if="info.sellPhone">
        <tui-list-cell unlined>
          <view class="tui-contact" @tap="dial(info.sellPhone)">
            <image src="/static/images/mall/icons/icon_order_contactmerchant.png" />
            <text>联系买家</text>
          </view>
        </tui-list-cell>
      </tui-list-view>
    </view>
    <view class="tui-safe-area"></view>

    <view class="tui-tabbar tui-order-btn" v-if="false">
      <view class="tui-btn-mr">
        <tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle">删除订单</tui-button>
      </view>
      <view class="tui-btn-mr">
        <tui-button type="black" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle"
          @click="refund">申请售后</tui-button>
      </view>
      <view class="tui-btn-mr">
        <tui-button type="danger" :plain="true" width="152rpx" height="56rpx" :size="26" shape="circle"
          @click="btnPay">立即支付</tui-button>
      </view>
    </view>

    <view class="tui-tabbar">
      <mall-btns notShowDetail :model="info" @reset="getOrderDetail" @showPay="btnPay" />
    </view>

    <t-pay-way :info="info" :orderNoId="orderId" :show="show" @close="show = false"
      v-if="[1, 3].includes(info.category)" />
    <offline-payment :show="show" @close="show = false" v-else />

    <!-- 付款凭证 -->
    <u-popup :show="show_pop" @close="show_pop = false" :round="16" @touchmove.stop.prevent="() => ({})">
      <view class="voucher">
        <image class="voucher-img" :src="model.voucher" @tap="$fn.previewImage(model.voucher)" v-if="model.voucher" />
        <view class="voucher-desc" v-if="!model.voucher && !model.payRemark">
          <text class="voucher-desc-t">暂无凭证</text>
        </view>
        <view class="voucher-desc" v-if="model.voucher">
          <text class="voucher-desc-t">备注: {{ model.payRemark || '暂无' }}</text>
        </view>
      </view>
    </u-popup>

    <!-- 收款凭证 -->
    <u-popup :show="show_pop2" @close="show_pop2 = false" :round="16" @touchmove.stop.prevent="() => ({})">
      <view class="voucher">
        <image class="voucher-img" :src="model.sellVoucher" @tap="$fn.previewImage(model.sellVoucher)"
          v-if="model.sellVoucher" />
        <view class="voucher-desc" v-if="!model.sellVoucher && !model.sellPayRemark">
          <text class="voucher-desc-t">暂无凭证</text>
        </view>
        <view class="voucher-desc" v-if="model.sellVoucher">
          <text class="voucher-desc-t">备注: {{ model.sellPayRemark || '暂无' }}</text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data () {
    return {
      category: 3,
      webURL: "https://www.thorui.cn/wx/static/images/mall/order/",
      //1-待付款 2-付款成功 3-待收货 4-订单已完成 5-交易关闭
      status: 1,
      show: false,
      info: {},
      orderId: '',
      show_pop: false,
      show_pop2: false,
      model: {},
      shopOrder: '',
      uinfo: {}
    }
  },
  async onLoad ({ orderId, shopOrder, flipBeat }) {
    this.orderId = orderId
    this.shopOrder = shopOrder
    await this.getOrderDetail()
    console.log(this.info.category, this.info.status, flipBeat)
    if (flipBeat) {
      this.info.category === 1 && this.info.status === 3 && await this.flipBeat()
      this.info.category === 4 && this.info.status === 2 && await this.flipBeat()
    }
    // flipBeat && this.info.category === 1  && this.info.status === 3 && await this.flipBeat()
  },
  methods: {

    // 获取订单详情
    async getOrderDetail () {
      const res = await uni.$api.orderDetail(this.orderId, this.shopOrder)
      this.info = res.data
    },

    logistics () {
      this.tui.href("/pages/my/logistics/logistics")
    },
    btnPay () {
      console.log('this.model==', this.info.orderId)
      // this.show = true
      if (this.info.category === 1) {
        uni.showActionSheet({
          itemList: ['点对点支付', '余额支付'],
          success: async (res) => {
            if (res.tapIndex === 0) {
              uni.navigateTo({ url: `/pages/payment/uploadCredentials?orderNo=${this.info.orderId}` })
            } else if (res.tapIndex === 1) {
              this.show = true
            }
          }
        })
      } else {
        this.show = true
      }

    },
    refund () {
      this.tui.href("/pages/my/refund/refund")
    },

    // 联系商家
    dial (phone) {
      uni.makePhoneCall({
        phoneNumber: phone
      })
    },

    getIcon (path) {
      return require(`static/images/mall/icons/${path}`)
    },

    getImg (status) {
      const icons = {
        '1': 'img_order_payment3x.png',
        '2': 'img_order_send3x.png',
        '3': 'img_order_received3x.png',
        '4': 'img_order_signed3x.png',
        '5': 'img_order_closed3x.png'
      }[status]
      return status && require(`static/images/mall/icons/${icons}`)
    },

    // 订单状态
    getStatusText (status) {
      return {
        '1': {
          '1': '等待您付款',
          '2': '付款成功',
          '3': '待收货',
          '4': '订单已完成',
          '5': '交易关闭'
        },
        '2': {
          '1': '等待您付款',
          '2': '付款成功',
          '3': '待收货',
          '4': '订单已完成',
          '5': '交易关闭'
        },
        '3': {
          '1': '等待您付款',
          '2': '付款成功',
          '3': '待收货',
          '4': '订单已完成',
          '5': '交易关闭'
        },
        '4': {
          '1': '等待您付款',
          '2': '付款成功',
          '3': '待收货',
          '4': '订单已完成',
          '5': '交易关闭'
        }
      }[this.category][status]
    },

    // 订单说明
    getReason (status) {
      return {
        '1': {
          '1': '剩余时间',
          '2': '等待卖家发货',
          '3': '还剩X天XX小时自动确认',
          '4': '',
          '5': '超时未付款，订单自动取消'
        },
        '2': {
          '1': '剩余时间',
          '2': '等待卖家发货',
          '3': '还剩X天XX小时自动确认',
          '4': '',
          '5': '超时未付款，订单自动取消'
        },
        '3': {
          '1': '剩余时间',
          '2': '等待卖家发货',
          '3': '还剩X天XX小时自动确认',
          '4': '',
          '5': '超时未付款，订单自动取消'
        },
        '4': {
          '1': '剩余时间',
          '2': '等待卖家发货',
          '3': '还剩X天XX小时自动确认',
          '4': '',
          '5': '超时未付款，订单自动取消'
        }
      }[this.category][status]
    },

    async lookCredentials (model, popName) {
      uni.showLoading()
      const res = await uni.$api.orderDetail(model.orderId, this.shopOrder || '-1')
      this.model = res.data
      this[popName] = true
      uni.hideLoading()
    },

    to_detail (item) {
      // return console.log(this.info, item)
      // uni.navigateTo({
      //   url: `/pages/mall/detail/detail?id=${item.productId}`
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.voucher {
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: calc(env(safe-area-inset-bottom) + 116px);

  &-img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }

  &-desc {
    margin-top: 16px;

    &-t {
      font-size: 14px;
      color: #999;
    }
  }

}

.container {
  padding-bottom: 118rpx;
}

.tui-order-header {
  width: 100%;
  height: 160rpx;
  position: relative;
  background-color: #EB0909;
}

.tui-img-bg {
  width: 100%;
  height: 160rpx;
}

.tui-header-content {
  width: 100%;
  height: 160rpx;
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 70rpx;
  box-sizing: border-box;
}

.tui-status-text {
  font-size: 34rpx;
  line-height: 34rpx;
  color: #FEFEFE;
}

.tui-reason {
  font-size: 24rpx;
  line-height: 24rpx;
  color: rgba(254, 254, 254, 0.75);
  padding-top: 15rpx;
  display: flex;
  align-items: center;
}

.tui-reason-text {
  padding-right: 12rpx;
}

.tui-status-img {
  width: 80rpx;
  height: 80rpx;
  display: block;
}

.tui-flex-box {
  width: 100%;
  display: flex;
  align-items: center;
}

.tui-icon-img {
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}

.tui-logistics {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24rpx 0 20rpx;
  box-sizing: border-box;
}

.tui-logistics-text {
  font-size: 26rpx;
  line-height: 32rpx;
}

.tui-logistics-time {
  font-size: 24rpx;
  line-height: 24rpx;
  padding-top: 16rpx;
  color: #666
}

.tui-addr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20rpx;
  box-sizing: border-box;
}

.tui-addr-userinfo {
  font-size: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.tui-addr-text {
  font-size: 24rpx;
  line-height: 32rpx;
  padding-top: 16rpx;
}

.tui-addr-tel {
  padding-left: 40rpx;
}

.tui-order-item {
  margin-top: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.tui-goods-title {
  width: 100%;
  font-size: 28rpx;
  line-height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.tui-goods-item {
  width: 100%;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.tui-goods-img {
  width: 180rpx;
  height: 180rpx;
  display: block;
  flex-shrink: 0;
}

.tui-goods-center {
  flex: 1;
  padding: 20rpx 8rpx;
  box-sizing: border-box;
}

.tui-goods-name {
  max-width: 310rpx;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 26rpx;
  line-height: 32rpx;
}

.tui-goods-attr {
  font-size: 22rpx;
  color: #888888;
  line-height: 32rpx;
  padding-top: 20rpx;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.tui-price-right {
  text-align: right;
  font-size: 24rpx;
  color: #888888;
  line-height: 30rpx;
  padding-top: 20rpx;
}

.tui-color-red {
  color: #E41F19;
  padding-right: 30rpx;
}

.tui-goods-price {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  font-size: 24rpx;
}

.tui-size-24 {
  font-size: 24rpx;
  line-height: 24rpx;
}

.tui-price-large {
  font-size: 32rpx;
  line-height: 30rpx;
}

.tui-goods-info {
  width: 100%;
  padding: 30rpx;
  box-sizing: border-box;
  background: #fff;
}

.tui-price-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tui-size24 {
  padding-bottom: 20rpx;
  font-size: 24rpx;
  line-height: 24rpx;
  color: #888;
}

.tui-size32 {
  font-size: 32rpx;
  line-height: 32rpx;
  font-weight: 500;
}

.tui-pbtm20 {
  padding-bottom: 20rpx;
}

.tui-flex-shrink {
  flex-shrink: 0;
}

.tui-primary-color {
  color: #EB0909;
}

.tui-order-info {
  margin-top: 20rpx;
}

.tui-order-title {
  position: relative;
  font-size: 28rpx;
  line-height: 28rpx;
  padding-left: 12rpx;
  box-sizing: border-box;
}

.tui-order-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  border-left: 4rpx solid #EB0909;
  height: 100%;
}

.tui-order-content {
  width: 100%;
  padding: 24rpx 30rpx;
  box-sizing: border-box;
  background: #fff;
  font-size: 24rpx;
  line-height: 30rpx;
}

.tui-order-flex {
  display: flex;
  padding-top: 18rpx;
}

.tui-order-flex:first-child {
  padding-top: 0
}

.tui-item-title {
  width: 132rpx;
  flex-shrink: 0;
}

.tui-item-content {
  color: #666;
  line-height: 32rpx;
}

.tui-safe-area {
  height: 1rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.tui-tabbar {
  width: 100%;
  height: 98rpx;
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 26rpx;
  box-shadow: 0 0 1px rgba(0, 0, 0, .3);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 996;
}

.tui-btn-mr {
  margin-right: 30rpx;
}

.tui-contact {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.tui-contact image {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
}
</style>
