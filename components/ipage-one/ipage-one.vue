<template>
  <view class="tui-product-box">
    <view class="tui-product-list">
      <block v-for="(item, index) in rows" :key="item.id || index">
        <!--商品列表-->
        <view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="to_detail(item)">
          <image :src="item.bg" class="tui-pro-img" mode="widthFix" />
          <view class="positioninfo">
            <view class="positioninfo-top">
              <text class="positioninfo-top-t">
                {{ `${item.onlineTime}前在线` }}
              </text>

              <text class="positioninfo-top-t2">
                颜值{{ item.faceScore }}分
              </text>
            </view>
            <view class="positioninfo-bottom">
              <view class="positioninfo-bottom-name">
                <text class="positioninfo-bottom-name-t">{{ item.nickName }}</text>
                <text class="positioninfo-bottom-name-t2">{{ item.ageGroup }}</text>
              </view>
              <view class="positioninfo-bottom-txt">
                <text>成交单数 {{ item.dealCount }}</text>
              </view>
              <view class="positioninfo-bottom-content">
                <view class="positioninfo-bottom-content-l">
                  最低消费 {{ item.minCharge }}
                </view>
                <view class="positioninfo-bottom-content-r">
                  <u-icon name="map" color="#fff" size="12" style="margin-right: 2px;" />
                  {{ item.distance }}m
                </view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </view>

    
  </view>
</template>

<script>
import { getLocationAndAddress } from '@/utils/getLocation';
import { createPaginated } from '@mvmoo/optionsapi'
import { formatNum } from '@mvmoo/us'

export default {
  props: {
    location: {
      type: Object,
      default: () => ({})
    },
    rows: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({}),

  methods: {
    // 跳转商品详情
    to_detail (row) {
      // uni.navigateTo({ url: `/pages/detail/goods?i=${row.id}&p=1` })
      uni.navigateTo({ url: `/pages/personal/detail?userId=${row.userId}&source=rz&p=1` })
    },

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
  flex-wrap: wrap;
  justify-content: space-between;
  // padding-top: 12px;
  box-sizing: border-box;
}

.tui-pro-item {
  width: calc(50% - 6px); // 两列布局 + 间隔
  aspect-ratio: 3 / 4; // 3:4 固定宽高比
  margin-bottom: 12px;
  position: relative;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.positioninfo {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.15);
  padding: 4px;
  box-sizing: border-box;
  border-radius: 0 0 12rpx 12rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-t {
      font-size: 10px;
      color: #fff;
      background-color: rgba(74, 180, 51, 0.8);
      padding: 2px 8px;
      border-radius: 12px;

      &-against {
        background-color: rgba(180, 135, 51, 0.8);
      }
    }

    &-t2 {
      font-size: 10px;
      color: #fff;
      opacity: 0.8;
    }
  }

  &-bottom {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &-ds {
      font-size: 13px;
      color: #fff;
      opacity: 0.8;
      margin-bottom: 5px;
    }

    &-name {
      display: flex;
      align-items: center;
      margin-bottom: 2px;

      &-t {
        font-size: 13px;
        color: #fff;
        font-weight: bold;
        margin-right: 2px;
      }

      &-t2 {
        font-size: 10px;
        color: #fff;
        opacity: 0.8;
        background-color: rgba(73, 197, 255, 0.8);
        padding: 0px 8px;
        border-radius: 12px;
        transform: scale(0.9);
      }
    }

    &-txt {
      display: flex;
      margin-bottom: 2px;

      text {
        font-size: 10px;
        color: #fff;
        opacity: 0.8;
        margin-right: 8px;
      }
    }

    &-content {
      display: flex;
      justify-content: space-between;

      &-l {
        font-size: 10px;
        color: #fff;
        opacity: 0.8;
      }

      &-r {
        font-size: 10px;
        color: #fff;
        opacity: 0.8;
        display: flex;
        align-items: center;
      }
    }
  }
}

.tui-pro-img {
  width: 100%;
  height: 100%;
  object-fit: cover; // 保证填满但不拉伸
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