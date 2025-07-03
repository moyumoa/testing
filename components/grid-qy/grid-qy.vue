<template>
  <view class="container">

    <view class="grid-box">
      <view class="grid-box-item" :style="{ 'width': width }" v-for="(item, index) in list" :key="index"
        @tap="onClick(item)">
        <view class="grid-box-item-top">
          <u-icon name="gift" bold :color="`rgba(0,0,0,${item.is ? 0.85 : 0.3})`" :size="24" />
        </view>
        <view class="grid-box-item-bottom">
          <text class="grid-box-item-bottom-t" :style="{ 'color': `rgba(0,0,0,${item.is ? 0.85 : 0.3})` }">{{ item.title }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    width: {
      type: String,
      default: "20%"
    },
  },
  data: () => ({}),
  methods: {
    onClick (item) {
      this.$emit("event", item);
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;

    &-top {
      width: 28px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;

      &-icon {
        width: 24px;
        height: 24px;
      }
    }

    &-bottom {
      display: flex;
      justify-content: center;

      &-t {
        font-size: 12px;
        color: #333;
      }
    }
  }
}
</style>