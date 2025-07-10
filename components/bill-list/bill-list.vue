<template>
  <view class="bill-list">
    <view class="list" v-for="(value, options) in pageData" :key="options">
      <view class="list-title">
        <view class="list-title-l">
          <text class="list-title-l-t">{{ options }}</text>
        </view>
        <view class="list-title-r">
          <text class="list-title-r-t">收入 {{ value.income }}</text>
          <text class="list-title-r-t">支出 {{ value.expend }}</text>
        </view>
      </view>
      <view class="list-item" v-for="option in value.transactions" :key="option.id">
        <view class="list-item-top">
          <text class="list-item-top-t">{{ option.title }}</text>
          <text class="list-item-top-t2" :class="{'list-item-top-t2-active': option.type !== 1}">
            {{ option.type === 1 ? '+' : '-' }}{{ option[money] }}
          </text>
        </view>
        <view class="list-item-bottom">
          <text class="list-item-bottom-t">余额: {{ option.balance }}</text>
          <text class="list-item-bottom-t2">{{ option.updateTime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    pageData: {
      type: Object,
      default: () => ({})
    },
    money: {
      type: String,
      default: 'integral'
    }
  },
  data: () => ({
    
  }),

  methods: {
  },
// // 添加交易记录到对应的年月
      // data.forEach(transaction => {
      //   const tradeTime = transaction.tradeTime;
      //   const yearMonth = tradeTime.slice(0, 7);
      //   this.pageData[yearMonth].transactions.push(transaction);
      // });
  created() {
  },

}
</script>

<style lang="scss" scoped>
.list {
  &-title {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;

    &-l {
      flex: 1;
      display: flex;
      align-items: center;

      &-t {
        font-size: 16px;
        font-weight: bold;
      }
    }

    &-r {
      display: flex;
      align-items: center;

      &-t {
        margin-left: 10px;
        font-size: 14px;
        color: #aaa;
      }
    }
  }

  &-item {
    margin: $mg;
    background-color: #fff;
    padding: 12px;
    border-radius: 10px;

    &-top {
      display: flex;
      align-items: center;

      &-t {
        flex: 1;
        font-size: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }

      &-t2 {
        flex-shrink: 0;
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #ff0000;

        &-active {
          color: #02d102;
        }
      }
    }

    &-bottom {
      margin-top: 4px;
      display: flex;
      align-items: center;
      color: #aaa;

      &-t {
        flex: 1;
        font-size: 13px;
      }

      &-t2 {
        flex-shrink: 0;
        font-size: 13px;
      }
    }
  }
}
</style>