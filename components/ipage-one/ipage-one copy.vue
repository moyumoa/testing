<template>
  <view class="tui-product-box" v-if="paginated">
    <view class="tui-product-list">
      <view class="tui-product-container">
        <block v-for="(item, index) in paginated.data" :key="item.id || index">
          <!--商品列表-->
          <view v-if="(index + 1) % 2 != 0" class="tui-pro-item" hover-class="hover" :hover-start-time="150"
            @tap="to_detail(item)">
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
                    <u-icon name="map" color="#fff" size="16" style="margin-right: 2px;" />
                    {{ item.distance }}m
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!--商品列表-->
        </block>
      </view>
      <view class="tui-product-container">
        <block v-for="(item, index) in paginated.data" :key="item.id || index">
          <!--商品列表-->
          <view v-if="(index + 1) % 2 == 0" class="tui-pro-item" hover-class="hover" :hover-start-time="150"
            @tap="to_detail(item)">
            <image :src="item.bg" class="tui-pro-img" mode="widthFix" />
            <view class="positioninfo">
              <view class="positioninfo-top">
                <text class="positioninfo-top-t">
                  {{ `${item.onlineTime}前在线` }}
                </text>
                <text class="positioninfo-top-t2">
                  颜值 {{ item.faceScore }} 分
                </text>
              </view>
              <view class="positioninfo-bottom">
                <!-- <view class="positioninfo-bottom-ds">
                  成交单数 {{ item.dealCount }}
                </view> -->
                <view class="positioninfo-bottom-name">
                  <text class="positioninfo-bottom-name-t">{{ item.nickName }}</text>
                  <text class="positioninfo-bottom-name-t2">{{ item.ageGroup }}</text>
                </view>
                <view class="positioninfo-bottom-txt">
                  <!-- <text>{{ item.height }}cm</text>
                  <text>{{ item.weight }}kg</text>
                  <text>{{ item.size }}</text> -->
                  <text>成交单数 {{ item.dealCount }}</text>
                </view>
                <view class="positioninfo-bottom-content">
                  <view class="positioninfo-bottom-content-l">
                   最低消费 {{ item.minCharge }}
                  </view>
                  <view class="positioninfo-bottom-content-r">
                    <u-icon name="map" color="#fff" size="16" style="margin-right: 2px;" />
                    {{ item.distance }}m
                  </view>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>

    <tui-loadmore v-if="paginated.loading" :index="3" type="red"></tui-loadmore>
    <tui-nomore v-if="finished"></tui-nomore>
  </view>
</template>

<script>
import { getLocationAndAddress } from '@/utils/getLocation';
import { createPaginated } from '@mvmoo/optionsapi'
import { formatNum } from '@mvmoo/us'

export default {
  props: {
    currentTab: {
      type: [Number, String],
      default: 1
    }
  },

  data: () => ({
    finished: false,
    list: [],

    scrollBarPosition: 0,

    finished: false,
    paginated: null
  }),

  async created () {
    const { lng, lat } = await getLocationAndAddress()
    // console.log('currentTab', this.currentTab)
    this.paginated = createPaginated(uni.$api.authList, { certificationType: 1, lng: lng || 0, lat: lat || 0, }, {
      pageKey: 'pageNum',
      limitKey: 'pageSize',
      extraList: res => res.data,
      extraTotal: res => res.total,
      defaultPagination: { page: 1, limit: 20 },
      transformData: (rows, res, query) => {
        console.log('transformData', rows, res, query, rows[1].images.split(',')[0])
        return rows?.map(item => ({
          ...item,
          bg: item.images.split(',')[0] || item.images || '', // 背景图
          ageGroup: this.ageGroup(item.birthday), // 年龄段
          onlineTime: this.onlineTime(item.seconds), // 在线时间
          distance: item.distance ? formatNum(item.distance) : '未知', // 距离
          authStatusTxt: { 0: '未认证', 1: '认证中', 2: '已认证', 3: '认证失败' }[item.authStatus] || '未知状态',
          isShowbtn: item.authStatus === 3, // 是否显示修改按钮
        })) || []
      }
    }, 'concat')
    this.currentTab === 1 && this.init()
  },

  watch: {
    currentTab (val) {
      console.log('currentTab', val)
      this.init()
    }
  },

  methods: {

    /* 根据传入的出生日计算年龄段 例如:85后 90后 00后 10后 */
    ageGroup (birthday) {
      const year = new Date(birthday).getFullYear();
      if (isNaN(year)) return '未知';
      const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
      return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
    },

    /* 根据秒数计算在线时间分钟/小时/天数 */
    onlineTime (Second) {
      if (Second < 60) return `${Second}秒`;
      if (Second < 3600) return `${Math.floor(Second / 60)}分钟`;
      if (Second < 86400) return `${Math.floor(Second / 3600)}小时`;
      return `${Math.floor(Second / 86400)}天`;
    },

    // 跳转商品详情
    to_detail (row) {
      // uni.navigateTo({ url: `/pages/detail/goods?i=${row.id}&p=1` })
      uni.navigateTo({ url: `/pages/personal/detail?userId=${row.userId}&p=1` })
    },

    async init () {
      this.paginated.reload({ certificationType: 1 }, 1)
      this.scrollBarPosition = 0
      this.$nextTick(() => { this.scrollTo() })
      console.log('init', this.paginated?.data)
    },

    // 商品列表
    async getProductList (callback) {
      const res = await uni.$api['authList'](this.condition)
      callback ? callback(res.data.list) : this.list = this.list.concat(res.data.list)
      this.finished = res.data.list.length < this.condition.pageSize
    },

    async reachBottom () {
      if (this.finished) return
      const { page, limit, total, count } = this.paginated.pagination
      this.paginated.onChangePage(page + 1, limit)
      this.finished = count < limit
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
  position: relative;
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
        font-size: 12px;
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