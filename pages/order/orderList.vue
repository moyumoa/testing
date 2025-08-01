<template>
  <view class="container">
    <!-- <view class="tabsview"> -->
    <!-- <tui-tabs :tabs="tabs" :isFixed="false" :currentTab="currentTabIndex" scroll selectedColor="#E41F19" sliderBgColor="#E41F19" @change="change"></tui-tabs>
       -->
    <!-- <tui-tab :tabs="tabs" scroll :current="currentTab" @change="change"></tui-tab> -->

    <view class="switching">
      <view class="switching-item" :class="{ 'switching-item-active': currentTabIndex === index }"
        v-for="(item, index) in tabs" :key="item.id" @tap.stop="change(item, index)">
        <text class="switching-item-t">{{ item.name }}</text>
        <image class="switching-item-active-icon" src="/static/images/index/banyuan.png"
          v-show="currentTabIndex === index" />
      </view>
    </view>
    <!-- </view> -->

    <view :class="{ 'tui-order-list': true }">
      <view class="tui-order-item" v-for="(model, orderIndex) in orderList" :key="orderIndex">
        <tui-list-cell :hover="false" lineLeft="0">
          <view class="tui-goods-title">
            <view>{{ model.createTime }}</view>
            <view class="tui-order-status">{{ model.orderStatus }}</view>
          </view>
        </tui-list-cell>
        <block v-for="(item, index) in model.orderInfoList" :key="index">
          <tui-list-cell padding="0" :hover="false" @click="detail(model, model.orderInfoList)">
            <view class="tui-goods-item">
              <image :src="item.image" class="tui-goods-img"></image>
              <view class="tui-goods-center">
                <view class="tui-goods-name">{{ item.storeName }}</view>
                <view class="tui-goods-attr">{{ item.sku }}</view>
                <view class="tui-goods-attr">保证金: {{ item.price }} 起拍价: {{ item.startPrice }}</view>
                <view class="tui-goods-attr">当前价: ¥
                  <text class="tui-goods-attr-price">{{ item.payPrice }}</text>
                </view>
              </view>
              <view class="tui-price-right" v-if="false">
                <view>￥{{ item.price }}</view>
                <view>x{{ item.cartNum }}</view>
              </view>
            </view>
          </tui-list-cell>
        </block>
        <tui-list-cell :hover="false" unlined v-if="false">
          <view class="tui-goods-price">
            <view>共{{ model.orderInfoList.length }}件商品 合计：</view>
            <view class="tui-size-24">￥</view>
            <view class="tui-price-large">{{ model.payPrice }}</view>
            <!-- <view class="tui-size-24">.00</view> -->
          </view>
        </tui-list-cell>
        <mall-btns :model="model" :shopOrder="shopOrder" :category="categoryNum" @reset="reset" @showPay="showPay"
          @lookCredentials="lookCredentials" />
      </view>
    </view>

    <t-pay-way :info="payInfo" :orderNoId="payInfo.orderId" :show="show" @close="show = false"
      v-if="[1, 3].includes(categoryNum)" />
    <!-- <offline-payment :show="show" @close="show = false" v-else /> -->

    <u-popup :show="show_pop" @close="show_pop = false" :round="16">
      <view class="voucher">
        <image class="voucher-img" :src="model.sellVoucher" @tap="perview(model.sellVoucher)" v-if="model.sellVoucher" />
        <view class="voucher-desc" v-if="!model.sellVoucher && !model.sellPayRemark">
          <text class="voucher-desc-t">暂无凭证</text>
        </view>
        <view class="voucher-desc" v-if="model.sellVoucher">
          <text class="voucher-desc-t">备注: {{ model.sellPayRemark || '暂无' }}</text>
        </view>
      </view>
    </u-popup>

    <view class="page-bottom">
      <tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
      <tui-nomore v-if="finished" backgroundColor="#f5f5f5"></tui-nomore>
    </view>

  </view>
</template>

<script>
import { od_title, od_tabs } from './orderStatus'
export default {
  data () {
    return {
      tabs: [], // 订单状态
      currentTabIndex: 0, // 当前选中的tab索引
      currentTab: 0, // 当前选中的tab
      show: false, // 是否显示支付弹窗
      loadding: false, // 是否正在加载
      finished: false, // 是否加载完成

      show_pop: false,

      page: 1,
      limit: 20,
      category: 3, //1=竞拍订单,2=转拍订单,3=商城订单,4=兑换订单
      orderList: [], // 订单列表
      payInfo: {}, // 支付信息
      model: {},
      shopOrder: -1
    }
  },

  computed: {
    categoryNum () {
      return Number(this.category)
    },
  },
  onLoad ({ category, shopOrder, index }) {
    this.category = category
    this.shopOrder = shopOrder || -1
    const title = od_title[category]
    title && uni.setNavigationBarTitle({ title })
    this.tabs = od_tabs[category]
    if (index) {
      this.currentTabIndex = Number(index)
      this.currentTab = od_tabs[category][index].id
    }
    // Number(shopOrder) === 1 ? this.tabs = od_tabs[category] : this.tabs = od_tabs[category].filter(item => item.name !== '待收款')
  },
  onShow () {
    this.reset(this.currentTabIndex, this.currentTab)
  },
  onUnload () {
    console.log('页面卸载')
  },
  methods: {
    // 切换tab
    change ({ id }, index) {
      this.currentTabIndex = index
      this.currentTab = id
      this.reset(index, id)
    },

    // 获取订单列表
    async getOrderList (currentTab = 0, callback) {
      this.loadding = true
      const res = await uni.$api.orderList({
        shopOrder: this.shopOrder,
        category: this.category,
        type: currentTab,
        page: this.page,
        limit: this.limit
      })
      callback ? callback(res.data.list) : this.orderList = [...this.orderList, ...res.data.list]
      this.loadding = false
      if (res.data.list && res.data.list.length < this.limit) return this.finished = true
    },

    // 重置
    reset (index, id) {
      this.currentTabIndex = index
      this.currentTab = id
      this.page = 1
      this.finished = false
      this.getOrderList(id, orderList => {
        this.orderList = []
        this.orderList = orderList
      })
      // this.getOrderList(index)
    },

    // 显示支付弹窗
    showPay (model) {
      if (model.category === 1) {
        uni.showActionSheet({
          itemList: ['点对点支付', '余额支付'],
          success: async (res) => {
            console.log('操作菜单', res)
            if (res.tapIndex === 0) {
              uni.navigateTo({ url: `/pages/payment/uploadCredentials?orderNo=${model.orderId}` })
            } else if (res.tapIndex === 1) {
              console.log('余额支付')
              this.payInfo = model
              this.show = true
            }
          }
        })
      } else {
        console.log('走了else')
        this.payInfo = model
        this.show = true
      }
    },

    async lookCredentials (model) {
      const res = await uni.$api.orderDetail(model.orderId, this.shopOrder || '-1')
      this.model = res.data
      this.show_pop = true
    },

    perview (url) {
      uni.previewImage({ urls: [url] })
    },

    // 订单详情
    detail ({ orderId, category }, row) {
      // uni.navigateTo({
      //   url: `/pages/my/orderDetail?orderId=${orderId}&shopOrder=${this.shopOrder}`
      // })
      uni.navigateTo({ url: `/pages/detail/goods?i=${row.productId || -1}&p=${category === 3 ? 1 : 2}` })
    },

  },
  onReachBottom () {
    if (this.finished) return
    console.log('上拉加载')
    this.loadding = true
    this.page++
    this.getOrderList()
  },
}
</script>

<style lang="scss" scoped>
.switching {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin: 8px 12px;

  &-item {
    // margin-right: 12px;
    position: relative;

    &-icon {
      display: none;
    }

    &-t {
      font-size: 15px;
      color: #777;
      transition: color 0.3s ease-in-out;
      transform: translate3d(0, 0, 0);
      will-change: transform;
      backface-visibility: hidden;
    }

    &-active {
      .switching-item-t {
        font-size: 15px;
        color: #161616;
        font-weight: bold;
      }

      &-icon {
        position: absolute;
        left: 50%;
        bottom: -4px;
        transform: translateX(-50%);
        width: 14px;
        height: 5px;
      }
    }
  }
}

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
  padding-bottom: env(safe-area-inset-bottom);
}

.tui-order-list {
  // margin-top: 50px;
  // margin-top: 0;
  // padding-top: 44px;
}

.tui-order-item {
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.tui-goods-title {
  width: 100%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tui-order-status {
  color: #333;
  font-size: 14px;
  font-weight: bold
}

.tui-goods-item {
  width: 100%;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.tui-goods-img {
  width: 90px;
  height: 90px;
  display: block;
  flex-shrink: 0;
}

.tui-goods-center {
  flex: 1;
  padding: 10px 4px;
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
  font-size: 14px;
  line-height: 16px;
  font-weight: bold;
}

.tui-goods-attr {
  font-size: 12px;
  color: #333;
  line-height: 16px;
  padding-top: 10px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  &-price {
    font-size: 18px;
    font-weight: bold;
    color: #161616;
  }
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
  font-weight: 500;
}


.page-bottom {
  padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}
</style>
