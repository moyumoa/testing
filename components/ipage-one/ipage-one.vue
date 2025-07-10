<template>
  <view class="tui-product-box">
    <view class="tui-product-list">
      <view class="tui-product-container">
        <block v-for="(item, index) in list" :key="item.id">
          <!--商品列表-->
          <view v-if="(index + 1) % 2 != 0" class="tui-pro-item" hover-class="hover" :hover-start-time="150"
            @tap="to_detail(item)">
            <image :src="item.image" class="tui-pro-img" mode="widthFix" />
            <view class="tui-pro-content">
              <view class="tui-pro-tit">{{ item.storeName }}</view>
              <view class="bottom-warp">
                <view class="bottom-warp-l">
                  <text class="bottom-warp-l-t">{{ item.ficti + item.sales }}人购买</text>
                </view>
                <view class="tui-pro-price">
                  <text class="tui-sale-price">一口价</text>
                  <text class="tui-sale-price-c">{{ $fn.split_price(item.price)[0] }}</text>
                  <text class="tui-sale-price-s">.{{ $fn.split_price(item.price)[1] }}</text>
                </view>
              </view>
            </view>
          </view>
          <!--商品列表-->
        </block>
      </view>
      <view class="tui-product-container">
        <block v-for="(item, index) in list" :key="index">
          <!--商品列表-->
          <view v-if="(index + 1) % 2 == 0" class="tui-pro-item" hover-class="hover" :hover-start-time="150"
            @tap="to_detail(item)">
            <image :src="item.image" class="tui-pro-img" mode="widthFix" />
            <view class="tui-pro-content">
              <view class="tui-pro-tit">{{ item.storeName }}</view>
              <view class="bottom-warp">
                <view class="bottom-warp-l">
                  <text class="bottom-warp-l-t">{{ item.ficti + item.sales }}人购买</text>
                </view>
                <view class="tui-pro-price">
                  <text class="tui-sale-price">一口价 </text>
                  <text class="tui-sale-price-c">{{ $fn.split_price(item.price)[0] }}</text>
                  <text class="tui-sale-price-s">.{{ $fn.split_price(item.price)[1] }}</text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>

    <tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
    <tui-nomore v-if="finished"></tui-nomore>
  </view>
</template>

<script>
import { getLocationAndAddress } from '@/utils/getLocation';

export default {
  props: {
    currentTab: {
      type: [Number, String],
      default: 1
    }
  },

  data: () => ({
    loadding: false,
    finished: false,
    list: [],
    condition: {
      pageSize: 10,
      pageNum: 1,
      certificationType: 1, // 认证类型 1-个人 2-企业
    },

    scrollBarPosition: 0
  }),

  async created () {
    const { lng, lat } = await getLocationAndAddress()
    this.condition = {
      ...this.condition,
      lng: lng || 0,
      lat: lat || 0,
    }
    // console.log('currentTab', this.currentTab)
    this.currentTab === 1 && this.init()
  },

  watch: {
    currentTab (val) {
      console.log('currentTab', val)
      this.init()
    }
  },

  methods: {
    // 跳转商品详情
    to_detail (row) {
      uni.navigateTo({ url: `/pages/detail/goods?i=${row.id}&p=1` })
    },

    async init () {
      this.condition.pageNum = 1
      this.finished = false
      this.getProductList(list => {
        this.list = list
        this.scrollBarPosition = 0
        this.$nextTick(() => {
          this.scrollTo()
        })
      })
    },

    // 商品列表
    async getProductList (callback) {
      this.loadding = true
      const res = await uni.$api['authList'](this.condition)
      callback ? callback(res.data.list) : this.list = this.list.concat(res.data.list)
      this.loadding = false
      this.finished = res.data.list.length < this.condition.pageSize
    },

    async reachBottom () {
      if (this.finished) return
      this.condition.pageNum++
      await this.getProductList()
      console.log('上拉加载')
    },

    scrollTo () {
      uni.pageScrollTo({
        scrollTop: this.scrollBarPosition,
        duration: 0
      })
    }
  },

}
</script>
<style lang="scss" scoped>
.tui-product-box {
  // margin-top: 20rpx;
  padding: 0 12px calc(50px + env(safe-area-inset-bottom));
  // box-sizing: border-box;
}


.tui-product-list {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
  /* padding-top: 20rpx; */
}

.tui-product-container {
  flex: 1;
  margin-right: 12px;
}

.tui-product-container:last-child {
  margin-right: 0;
}

.tui-pro-item {
  width: 100%;
  margin-bottom: 8px;
  background: #fff;
  box-sizing: border-box;
  border-radius: 12rpx;
  overflow: hidden;
}

.tui-pro-img {
  width: 100%;
  display: block;
}

.tui-pro-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 8px 5px;
}

.tui-pro-tit {
  color: #2e2e2e;
  font-size: 14px;
  line-height: 16px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.bottom-warp {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // align-items: flex-end;
  align-items: baseline;
  margin-top: 10px;

  &-l {
    display: flex;
    flex-direction: column;

    &-t {
      font-size: 11px;
      color: #8a8a8a;
    }
  }
}

.tui-pro-price {
  // padding-top: 18rpx;
  line-height: 1;
  display: flex;
  align-items: baseline;
}

.tui-sale-price {
  font-size: 10px;
  color: #666;
  margin-right: 2px;

  &-c {
    font-size: 14px;
    font-weight: bold;
    color: $ec;
  }

  &-s {
    color: $ec;
    font-size: 12px;
    opacity: 0.7;
  }
}

.tui-factory-price {
  font-size: 10px;
  color: #a0a0a0;
  // text-decoration: line-through;
  padding-left: 12rpx;
}

.tui-pro-pay {
  padding-top: 10rpx;
  font-size: 24rpx;
  color: #656565;
}
</style>