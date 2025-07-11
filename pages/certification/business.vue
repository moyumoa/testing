<template>
  <view class="containerwarp">
    <view class="pinfo">
      <view class="pinfo-top">
        <view class="pinfo-top-l">
          <image class="pinfo-top-l-pic" :src="getUserInfo.avatar" />
        </view>
        <view class="pinfo-top-r">
          <text class="pinfo-top-r-t">{{ getUserInfo.nickName }}</text>
          <view class="pinfo-top-r-t2">
            <u-icon :label="getUserInfo.isVip ? '会员' : '普通用户'" size="16" labelColor="#ccc" labelSize="12"
              name="/static/per/hy-icon.png" />
          </view>
        </view>

        <view class="pinfo-top-position">
          <text class="pinfo-top-position-t">
            {{ getUserInfo.isCertification ? '已认证' : '未认证' }}
          </text>
        </view>
      </view>
      <view class="pinfo-row">
        <text class="pinfo-row-text">
          到期时间: {{ getUserInfo.expireTime || '无' }}
        </text>
      </view>
    </view>

    <scroll-view scroll-x>
      <view class="xwarp">
        <view class="xwarp-item" :class="{ 'xwarp-item-active': current.id === item.id }"
          v-for="(item, index) in rowData" :key="item.id" @tap="selectType(item, index)">
          <text class="xwarp-item-t1">{{ item.expireDays }}天</text>
          <text class="xwarp-item-t2">¥{{ item.payAccount / 100 }}</text>
          <view class="xwarp-item-bottom">
            <text class="xwarp-item-t3">≈{{ (item.expireDays / item.payAccount).toFixed(2) }}/天</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="panel">
      <view class="panel-grid">
        <view class="panel-grid-title">
          <u-icon name="bookmark" color="#72A5FD" size="20" />
          <text class="panel-grid-title-t">权益</text>
        </view>
        <view class="panel-grid-centext">
          <text class="panel-grid-centext-t">
            上架女郎次数 {{ current.putAwayCount }}\n
            发布女郎个数 {{ current.createCount }}\n
            可拥有自己的店铺\n
            首页赔付专区展示等权益
          </text>
        </view>
      </view>
      <view class="panel-grid">
        <view class="panel-grid-title">
          <u-icon name="bookmark" color="#72A5FD" size="20" />
          <text class="panel-grid-title-t">说明</text>
        </view>
        <view class="panel-grid-centext">
          <text class="panel-grid-centext-t">一经认证入驻费用概不退还</text>
        </view>
      </view>
      <view class="panel-grid">
        <view class="panel-grid-title">
          <u-icon name="list" color="#72A5FD" size="20" />
          <text class="panel-grid-title-t">认证记录</text>
        </view>
        <view class="panel-grid-centext">
          <u-steps current="1" direction="column" dot>
            <u-steps-item title="失败" desc="0000-00-00 10:30">
            </u-steps-item>
            <u-steps-item title="失败" desc="0000-00-00 10:35">
            </u-steps-item>
            <u-steps-item title="审核中" desc="0000-00-00 11:40"></u-steps-item>
          </u-steps>
        </view>
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item">
        <text class="subbtns-item-t">去支付</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
  data: () => ({
    rowData: [],
    current: {},
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad () {
    await userInfo()
    await this.getAuthType();
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
  },
  methods: {

    // 获取商户认证类型
    async getAuthType () {
      const res = await uni.$api.authType({authTypeValue: 2});
      console.log('商户认证类型', res);
      this.rowData = res.rows || [];
      this.selectType(this.rowData[0], 0);
    },

    // 选择认证类型
    selectType (item, index) {
      this.current = item;
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

    onClickGrid ({ value }) {
      ({
        1: () => uni.$toast('待付款'),
      }[value])?.()
    },

    onClickFnGrid ({ title }) {
      ({
        '我的推广': () => {
          uni.navigateTo({
            // url: '/reward/pages/invite/index'
            url: '/pages/personal/invite'

          })
        },
        '会员中心': () => {
          // 跳转到分包member
          uni.navigateTo({
            url: '/member/pages/center/index'
          })
        },
      }[title])?.()
    }
  }
}
</script>

<style lang="scss" scoped>
.containerwarp {
  background-color: $bgc;
  padding-bottom: calc(58px + env(safe-area-inset-bottom));
}

.pinfo {
  position: relative;
  padding: 32px 24px 16px;

  &-top {
    position: relative;
    display: flex;
    z-index: 3;

    &-l {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      border: 1px solid #fff;
      box-sizing: border-box;
      box-shadow: 0 2px 8px 12px rgba(0, 0, 0, 0.05);

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
        font-size: 14px;
        color: #1a1a1a;
      }

      &-t2 {
        font-size: 12px;
        color: #333;
        margin-top: 5px;
        // opacity: 0.8;
      }
    }

    &-position {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #efeeee;
      padding: 4px 12px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-t {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
  }

  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding: 0 4px;

    &-text {
      font-size: 13px;
      color: #333;
      opacity: 0.8;
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

.xwarp {
  padding: 16px;
  box-sizing: border-box;
  display: flex;

  &-item {
    position: relative;
    flex-shrink: 0;
    width: 118px;
    // height: 120px;
    margin-right: 16px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    // padding: calc(16px + 12px) 12px 12px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    transition: all 0.2s ease;

    &-t1 {
      font-size: 15px;
      color: #7F4C0F;
      font-weight: bold;
      margin: 16px 0 0;
    }

    &-t2 {
      font-size: 18px;
      color: #FF6065;
      margin: 16px;
    }

    &-bottom {
      height: 32px;
      line-height: 32px;
      width: 100%;
      text-align: center;
      background: rgba(0, 0, 0, 0.1);
      color: #fff;
      font-size: 13px;
    }

    &-active {
      border: 1px solid #BB945F;
      background-color: #FEFAEF;
    }

    &-active>&-bottom {
      background: linear-gradient(104.04deg, #BB945F 0%, #FF6064 100%);
    }
  }
}

.panel {
  margin: 0 16px 16px;
  border-radius: 16px 16px 0 0;

  &-hybox {
    height: 62px;
    margin: 0 16px;

    &-pic {
      width: 100%;
      height: 100%;
    }
  }

  &-grid {
    margin-bottom: 16px;
    padding: 16px 16px 6px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);

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
      // justify-content: space-between;
      align-items: center;
      // margin-bottom: 24px;

      &-t {
        font-size: 14px;
        color: #333;
        opacity: 0.8;
        font-weight: 500;
        transform: translate(5px);
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

    &-centext {
      padding: 12px 0;
      font-size: 12px;
      color: #666;
      line-height: 1.5;
      opacity: 0.8;
    }
  }
}

</style>