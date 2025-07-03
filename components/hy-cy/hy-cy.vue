<template>
  <view class="container">
    <view class="tops">
      <view class="tops-l">
        <text class="tops-l-t">拍客数量45/50</text>
      </view>
      <view class="tops-r">
        <text class="tops-r-t">邀请拍客</text>
        <text class="tops-r-t">总邀请数</text>
      </view>
    </view>

    <view class="bottoms">
      <view class="panel" v-for="(item, index) in 10" :key="index">
        <view class="panel-l">
          <view class="panel-l-icon">
            <image style="width: 100%;height: 100%;" src="/member/static/m-0.png" />
          </view>
          <view class="panel-l-info">
            <text class="panel-l-info-title">张三张三张三{{ item }}</text>
            <text class="panel-l-info-t">今日收益: {{ 1 + index }}</text>
          </view>
        </view>
        <view class="panel-r">
          <text class="panel-r-t">{{ item + 10 }}</text>
          <text class="panel-r-t">{{ item + 200 }}</text>
        </view>
      </view>
    </view>

    <tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
    <tui-nomore v-if="finished" backgroundColor="#f9f9f9"></tui-nomore>
  </view>
</template>

<script>

export default {
  props: {
    currentTab: {
      type: [Number, String],
      default: 1
    }
  },

  data: () => ({
    loading: false,
    finished: false,
    list: [],
    condition: {
      page: 1,
      limit: 10,
      headType: 1
    },

    scrollBarPosition: 0
  }),

  created () {
    // this.init()
  },

  watch: {
    currentTab (val) {
      console.log('currentTab', val)
      this.condition.headType = val
      // this.init()
    }
  },

  methods: {

    async init () {
      this.condition.page = 1
      this.finished = false
      this.getDataList(list => {
        this.list = list
        this.scrollBarPosition = 0
        this.$nextTick(() => {
          this.scrollTo()
        })
      })
    },

    // 商品列表
    async getDataList (callback) {
      this.loadding = true
      const res = await uni.$api['goodsList'](this.condition)
      callback ? callback(res.data.list) : this.list = this.list.concat(res.data.list)
      this.loadding = false
      this.finished = res.data.list.length < this.condition.limit
    },

    async reachBottom () {
      if (this.finished) return
      this.condition.page++
      // await this.getDataList()
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
.container {
  padding: 0 12px env(safe-area-inset-bottom);
}

$rw: 100px;

.tops {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;

  &-l {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #333;
  }

  &-r {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #333;

    &-t {
      width: $rw;
      text-align: right;
    }
  }
}

.bottoms {}

.panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f9f9f9;

  &-l {
    display: flex;
    align-items: center;

    &-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      margin-right: 10px;
      box-sizing: border-box;
    }

    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &-title {
        font-size: 14px;
        color: #333;
      }

      &-t {
        font-size: 12px;
        color: #999;
      }
    }
  }

  &-r {
    display: flex;
    justify-content: center;
    font-size: 12px;
    color: #333;

    &-t {
      width: $rw;
      text-align: right;
    }
  }
}
</style>