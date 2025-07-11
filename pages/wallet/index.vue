<template>
  <view class="pagecontainer">
    <view class="navbar">
      <view class="navbar-left" @tap="goback">
        <u-icon name="arrow-left" color="#fff" size="21" />
      </view>
      <view class="navbar-center">
        <text class="navbar-center-t">钱包</text>
      </view>
      <view class="navbar-right">
        <text class="navbar-right-t">明细</text>
      </view>
    </view>
    <view class="pinfo" :style="{ 'padding-top': `${66}px` }">
      <image class="pageback-pic" src="/static/per/wallet-bg.png" />
      <view class="pbox">
        <view class="pbox-top">
          <view class="pbox-top-item">
            <text class="pbox-top-item-t">余额</text>
            <text class="pbox-top-item-t2">{{ getUserInfo.balance }}</text>
          </view>
          <view class="pbox-top-item">
            <text class="pbox-top-item-t">可用余额</text>
            <text class="pbox-top-item-t2">{{ getUserInfo.balance }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="panel-topposition">
        <view class="panel-topposition-item" @tap="tapFn({ title: '提现' })">
          <text class="panel-topposition-item-t">提现</text>
        </view>
        <view class="panel-topposition-item" @tap="tapFn({ title: '兑换会员' })">
          <text class="panel-topposition-item-t">兑换会员</text>
        </view>
      </view>
      <view class="panel-grid">
        <view class="panel-grid-title">
          <text class="panel-grid-title-t">充值中心</text>
        </view>
        <view class="grid-box">
          <view class="grid-item" :class="{ 'grid-item-active': current.id === item.id }" v-for="item in gridData"
            :key="item.id" @tap="selectGrid(item)">
            <text class="grid-item-t">
              {{ item.name }}
              <text class="grid-item-t-m">元宝</text>
            </text>
            <text class="grid-item-t2">¥{{ item.price }}</text>
          </view>
        </view>
      </view>

      <view class="panel-iptbox">
        <text class="panel-iptbox-title">自定义金额</text>
        <u-input type="number" placeholder="请输入金额" border="none" clearable v-model="customAmount" />
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item">
        <text class="subbtns-item-t">确认充值</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
  data: () => ({
    gridData: [
      { name: '88', price: 88, id: 1 },
      { name: '188', price: 188, id: 2 },
      { name: '388', price: 388, id: 3 },
      { name: '588', price: 588, id: 4 },
      { name: '888', price: 888, id: 5 },
      { name: '1288', price: 1288, id: 6 },
    ],
    current: {}, // 当前选中的充值金额
    customAmount: '', // 自定义金额输入框的值
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad () {
    await userInfo()
    this.current = this.gridData[0] // 默认选中第一个充值金额
  },
  methods: {

    goback () {
      uni.navigateBack({
        delta: 1
      })
    },

    navtap (type) {
      ({
        kefu: () => {
          // 跳转到客服页面
          uni.navigateTo({
            url: '/pages/kefu/index'
          })
        },
        setting: () => {
          // 跳转到设置页面
          uni.navigateTo({
            url: '/pages/setting/index'
          })
        },
      }[type])?.()
    },

    selectGrid (item) {
      this.current = item; // 设置当前选中的充值金额
      this.customAmount = ''; // 清空自定义金额输入框
    },

    tapFn ({ title }) {
      ({
        '提现': () => {
          uni.navigateTo({
            url: '/pages/wallet/withdraw'
          })
        },
        '兑换会员': () => {
          uni.navigateTo({
            url: '/pages/member/center'
          })
        },
      }[title])?.()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagecontainer {
  overflow: hidden;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  color: #fff; // 设置文字颜色

  &-left {
    flex-shrink: 0;
    padding-left: 12px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;

    &-t {
      width: 40px;
      text-align: center;
      font-size: 12px;
      color: #808080;
      transition: background-color 0.25s, color 0.25s;

      &-active {
        background-color: #60B95D;
        color: #fff;
      }
    }
  }

  &-center {
    flex: 1;
    width: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &-t {
      font-size: 15px;
      color: #fff;
    }
  }

  &-right {
    margin-right: 16px;
    flex-shrink: 0;
    width: 60px;
    height: 24px;
    border-radius: 16px;
    background: #72A5FD;

    display: flex;
    align-items: center;
    justify-content: center;

    &-t {
      font-size: 12px;
      color: #fff;
    }
  }
}

.pinfo {
  position: relative;
  padding: 0 16px 24px;
  // background: linear-gradient(180deg, rgba(255, 156, 27, 0.3) 0%, rgba(255, 156, 27, 0.5) 100%);
  // background: linear-gradient(180deg, rgba(123, 161, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);


  .pageback-pic {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    transform: scale(1.25);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.1); // 添加一个半透明的白色遮罩
    }
  }

  &-top {
    position: relative;
    display: flex;
    z-index: 3;

    &-text {
      padding: 12px 0;
      font-size: 13px;
      color: #fff;
    }

    &-l {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      border: 1px solid #fff;
      box-sizing: border-box;

      &-pic {
        width: 100%;
        height: 100%;
      }
    }

    &-r {
      display: flex;
      flex-direction: column;
      justify-content: center;

      &-t {
        font-size: 15px;
        color: #fff;
        font-weight: 500;
      }

      &-t2 {
        font-size: 12px;
        color: #fff;
        // opacity: 0.8;
      }
    }
  }

  &-center {
    display: flex;
    // justify-content: space-between;
    // margin-top: 16px;

    padding: 16px 0;

    &-item {
      flex-shrink: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      &-t {
        font-size: 18px;
        color: #555;
        font-weight: 500;
        margin-bottom: 2px;
      }

      &-t2 {
        font-size: 12px;
        color: #555;
        opacity: 0.5;
      }
    }
  }
}

.pbox {
  position: relative;
  z-index: 2;
  padding: 24px 16px 52px;
  box-sizing: border-box;

  &-top {

    display: flex;
    align-items: center;

    &-item {
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;

      &-t {
        font-size: 13px;
        color: #fff;
        opacity: 0.8;
      }

      &-t2 {
        margin-top: 12px;
        font-size: 16px;
        color: #fff;
      }
    }
  }

}

.panel {
  // margin: 0 16px 16px;
  transform: translateY(-10px);
  border-radius: 16px 16px 0 0;
  background-color: #fafbfe;
  position: relative;
  padding-top: 24px;

  &-topposition {
    position: absolute;
    top: -24px;
    left: 24px;
    right: 24px;
    z-index: 1;
    display: flex;
    background-color: #889ae1;
    // background-color: rgba(255, 255, 255, 0.99);
    height: 48px;
    border-radius: 12px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);

    &-item {
      flex-shrink: 0;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      &:last-child {
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 80%;
          background-color: rgba(255, 255, 255, 0.2);
        }
      }

      &-t {
        font-size: 14px;
        color: #fff;
        opacity: 0.8;
      }
    }
  }

  &-hybox {
    height: 62px;
    margin: 0 16px;

    &-pic {
      width: 100%;
      height: 100%;
    }
  }

  &-grid {
    padding: 16px 16px 0;
    // background-color: #fff;
    border-radius: 10px;

    .grid {
      &-box {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 16px;
      }

      &-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 80px;
        padding: 12px;
        box-sizing: border-box;
        border-radius: 8px;
        background-color: #f4f4f4;

        &-active {
          border: 2px solid $ec;

          .grid-item {
            &-t {
              color: $ec;

              &-m {
                color: $ec;
              }
            }

            &-t2 {
              color: $ec;
            }
          }
        }

        &-t {
          font-size: 18px;
          color: #333;

          &-m {
            font-size: 12px;
            color: #989898;
            margin-left: 4px;
          }
        }

        &-t2 {
          margin-top: 5px;
          font-size: 14px;
          color: #6d6d6d;
          opacity: 0.6;
        }
      }
    }

    ::v-deep .grid-box-item-top {
      width: 48px;
      height: 48px;
    }

    ::v-deep .grid-box-item-top-icon {
      width: 48px;
      height: 48px;
    }

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      &-t {
        font-size: 14px;
        color: #333;
        opacity: 0.4;
        font-weight: 500;
      }

      &-r {
        display: flex;
        align-items: baseline;

        &-t {
          font-size: 12px;
          color: #666;
          margin-right: 4px;
        }
      }
    }
  }

  &-iptbox {
    padding: 12px 16px;
    background-color: #f4f4f4;
    border-radius: 10px;
    margin: 16px;
    display: flex;
    align-items: center;

    &-title {
      font-size: 14px;
      color: #333;
      margin-right: 16px;
    }
  }
}
</style>