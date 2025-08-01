<template>
  <view class="pagecontainer">
    <view class="navbar">
      <view class="navbar-left" @tap="goback">
        <u-icon name="arrow-left" color="#fff" size="21" />
      </view>
      <view class="navbar-center">
        <text class="navbar-center-t">提现</text>
      </view>
      <view class="navbar-right" @tap="oper('detail')">
        <text class="navbar-right-t">提现记录</text>
      </view>
    </view>
    <view class="pinfo" :style="{ 'padding-top': `${66}px` }">
      <image class="pageback-pic" src="/static/per/wallet-bg.png" />
      <view class="pbox">
        <view class="pbox-top">
          <view class="pbox-top-item">
            <text class="pbox-top-item-t">余额</text>
            <text class="pbox-top-item-t2">{{ getUserInfo.balance / 100 }}</text>
          </view>
          <!-- <view class="pbox-top-item">
            <text class="pbox-top-item-t">可用余额</text>
            <text class="pbox-top-item-t2">{{ getUserInfo.balance / 100 }}</text>
          </view> -->
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="rate">提现手续费{{ withdrawRateNum / 100 }}%, 兑换比例1:1</view>
      <view class="panel-topposition">
        <view class="panel-topposition-title">提现金额</view>
        <view class="panel-topposition-box">
          <text class="panel-topposition-box-t">¥</text>
          <!-- <text class="panel-topposition-box-t2">{{ value }}</text> -->
          <u-input type="number" placeholder="请输入金额" border="none" clearable v-model="amount" />
          <!-- <text class="cursor"></text> -->
          <text class="allfunds" @tap.stop="amount = getUserInfo.balance / 100">全部提现</text>
        </view>
        <view class="panel-topposition-desc">手续费: <text>{{ calculateFee }}</text> 元</view>

      </view>

      <view class="panel-iptbox">
        <text class="panel-iptbox-title">提现至</text>
        <u-input type="text" placeholder="请输入支付宝号" border="none" clearable v-model="account" />
      </view>
    </view>

    <view class="subbtns" @tap="withdrawal">
      <view class="subbtns-item">
        <text class="subbtns-item-t">确认提现</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
  data: () => ({
    payPrice: 0, // 充值金额
    gridData: [
      { name: '88', price: 88, id: 1 },
      { name: '188', price: 188, id: 2 },
      { name: '388', price: 388, id: 3 },
      { name: '588', price: 588, id: 4 },
      { name: '888', price: 888, id: 5 },
      { name: '1288', price: 1288, id: 6 },
    ],
    amount: '', // 自定义金额输入框的值
    account: '', // 提现账号
    withdrawRateNum: 0, // 提现费率
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
    // 根据费率计算手续费
    calculateFee() {
      if (this.amount && this.withdrawRateNum) {
        return (this.amount * (this.withdrawRateNum / 100) / 100).toFixed(2);
      }
      return '0.00';
    }
  },
  async onLoad () {
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
    await userInfo()
    this.getWithdrawRate()
  },
  methods: {
    ...mapActions(['updateUserInfo']),

    goback () {
      uni.navigateBack({
        delta: 1
      })
    },

    // 获取提现费率
    async getWithdrawRate () {
      const res = await uni.$api.withdrawRate();
      this.withdrawRateNum = res.msg;

    },

    async withdrawal () {
      if (this.amount <= 0) return uni.$toast('请输入有效的提现金额');
      if (!this.account) return uni.$toast('请输入提现账号');
      this.payPrice = parseInt(this.amount * 100); // 转换为分
      await uni.$api.withdraw({ amount: this.payPrice, account: this.account, feeRate: this.withdrawRateNum, feeAmount: this.calculateFee * 100 });
      uni.$toast('提现申请已提交');
    },

    oper (type) {
      ({
        detail: () => {
          uni.navigateTo({
            url: '/pages/wallet/detail?source=withdraw'
          });
        }
      }[type] || (() => { }))();
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
  left: var(--window-left);
  right: var(--window-right);
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
  padding: 0 16px 64px;
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
  // transform: translateY(-10px);
  // border-radius: 16px 16px 0 0;
  background-color: #fafbfe;
  position: relative;
  padding-top: 24px;

  .rate {
    position: absolute;
    top: -88px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #e3e3e3;
  }

  &-topposition {

    position: absolute;
    top: -70px;
    left: 12px;
    right: 12px;
    z-index: 1;

    margin: 16px 12px;
    padding: 0 16px;
    background-color: #fff;
    border-radius: 12px;

    &-title {
      font-size: 12px;
      color: #a1a1a1;
      font-weight: bold;
      padding: 16px 0;
    }

    &-desc {
      font-size: 12px;
      color: #a1a1a1;
      padding-bottom: 16px;
      margin-left: 26px;

      text {
        margin: 0 8px;
        color: #e31945;
        font-weight: bold;
      }
    }

    &-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // padding: 0 16px;
      height: 60px;

      &-t {
        font-size: 24px;
        color: #161616;
        // font-weight: bold;
        margin-right: 10px;
      }

      .allfunds {
        font-size: 15px;
        color: $ec;
        margin-left: 10px;
      }

      &-t2 {
        font-size: 36px;
        color: #161616;
        font-weight: bold;
      }

      .cursor {
        width: 1px;
        height: 60%;
        background-color: #52af8a;
        margin-left: 5px;
        animation: cursor 1s infinite steps(1, start);
      }

      @keyframes cursor {
        0% {
          opacity: 0;
        }

        50% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }
    }

    &-tips {
      font-size: 12px;
      color: #999;
      font-weight: normal;
      padding: 16px;
    }

    // position: absolute;
    // top: -24px;
    // left: 24px;
    // right: 24px;
    // z-index: 1;
    // display: flex;
    // background-color: #889ae1;
    // // background-color: rgba(255, 255, 255, 0.99);
    // height: 48px;
    // border-radius: 12px;
    // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);

    // &-item {
    //   flex-shrink: 0;
    //   flex: 1;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   position: relative;

    //   &:last-child {
    //     &::after {
    //       content: '';
    //       position: absolute;
    //       left: 0;
    //       top: 50%;
    //       transform: translateY(-50%);
    //       width: 1px;
    //       height: 80%;
    //       background-color: rgba(255, 255, 255, 0.2);
    //     }
    //   }

    //   &-t {
    //     font-size: 14px;
    //     color: #fff;
    //     opacity: 0.8;
    //   }
    // }
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
    background-color: #ffffff;
    border-radius: 10px;
    margin: 88px 24px 16px;
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