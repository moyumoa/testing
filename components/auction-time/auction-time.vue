<template>
  <view class="warp">
    <view class="warp-left">
      <image class="warp-left-icon" src="/static/public/chuizi.png" />
    </view>
    <view class="warp-right">
      <view class="warp-right-time">
        <text class="warp-right-time-t">12月12日 开始</text>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  props: {
  },
  data: () => ({
  }),
  mounted () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.warp {
  position: absolute;
  left: 10;
  top: 10;
  display: flex;
  justify-content: space-between;
  padding: 2px;
  background-color: #1a1a1a;
  border-radius: 2px;

  &-left {
    margin-right: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;

    &-icon {
      width: 16px;
      height: 16px;
    }
  }

  &-right {
    display: flex;
    align-items: center;
    justify-content: center;

    &-time {
      background: #fff;
      border-radius: 2px;
      padding: 2px 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      &-t {
        color: #333;
        font-size: 12px;
      }
    }
  }
}
</style>