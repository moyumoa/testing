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
            <u-icon :label="getUserInfo.isVip ? '高级会员' : '普通用户'" size="16" labelColor="#ccc" labelSize="12"
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
            <text class="xwarp-item-t3">≈{{ ((item.payAccount / 100) / item.expireDays).toFixed(2) }}/天</text>
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
          <view class="pgc-items" v-for="(item, index) in paginated.data" :key="index">
            <image class="pgc-items-avatar" src="/static/bgs/bg_chat.jpeg" />
            <text class="pgc-items-t">{{ item.nickName }}</text>
            <text class="pgc-items-t">{{ item.check_remark || '无' }}</text>
            <text class="pgc-items-t">{{ item.authStatusTxt }}</text>
            <text class="pgc-items-t pgc-items-t-edit" v-if="item.isShowbtn">去修改</text>
          </view>
        </view>
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item" :class="{ 'subbtns-item-disabled': btnStatus.disabled }" @tap="submit">
        <text class="subbtns-item-t">
          {{ btnStatus.txt }}
        </text>
      </view>
    </view>

    <t-pay-way neededs="4" :payPrice="current.payAccount" :show="showPay" @close="showPay = false" @pay="submitPay" />
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { createPaginated } from '@mvmoo/optionsapi'

export default {
  data: () => ({
    showPay: false,
    rowData: [],
    current: {},
    finished: false,
    paginated: createPaginated(uni.$api.authRecord, null, {
      pageKey: 'pageNum',
      limitKey: 'pageSize',
      extraList: res => res.rows,
      extraTotal: res => res.total,
      defaultPagination: { page: 1, limit: 100 },
      transformData: (rows, res, query) => {
        console.log('认证记录', rows, res, query)
        return rows.map(item => ({
          ...item,
          authStatusTxt: { 0: '未认证', 1: '认证中', 2: '已认证', 3: '认证失败' }[item.authStatus] || '未知状态',
          isShowbtn: item.authStatus === 3, // 是否显示修改按钮
        }))
      }
    }, '')
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
    btnStatus () {
      const status = this.paginated.data[0]?.authStatus || 0;
      const isUpdateCount = this.getUserInfo?.isUpdateCount || 0;
      if (!isUpdateCount && !status) return { txt: '去认证', disabled: false, navi: 'pay' };
      const statusMap = {
        1: { txt: '认证中', disabled: true, navi: '' },
        2: { txt: '修改资料', disabled: false, navi: 'info' },
        3: { txt: '去修改', disabled: false, navi: 'info' }
      };
      if (statusMap[status]) return statusMap[status];
      if (isUpdateCount > 0) return { txt: '填写资料', disabled: false, navi: 'info' };
      return { txt: '', disabled: true, navi: '' };
    }
  },
  async onShow () {
    await userInfo()
    // 获取认证记录
    this.paginated.reload({ userId: this.getUserInfo.id }, 1)
  },
  async onLoad () {
    await this.getAuthType();
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
  },
  methods: {

    // 获取商户认证类型
    async getAuthType () {
      const res = await uni.$api.authType({ authTypeValue: 2 });
      console.log('商户认证类型', res);
      this.rowData = res.rows || [];
      this.selectType(this.rowData[0], 0);
    },

    // 选择认证类型
    selectType (item, index) {
      this.current = item;
    },


    submit () {
      if (this.btnStatus.disabled) return
      ({
        pay: () => {
          // 跳转到支付页面
          this.showPay = true;
        },
        info: () => {
          // 跳转到个人信息填写页面
          this.toPersonalInfo();
        }
      }[this.btnStatus.navi])?.()
    },


    async submitPay ({ amount, payType }) {
      const res = await uni.$api.authPay({
        amount, payType,
        certificationType: 2, // 1-个人认证
        days: this.current.expireDays,
        updateCount: 1,
        createCount: this.current.createCount,
        putAwayCount: this.current.putAwayCount
      });
      await userInfo()
      // 提交支付逻辑
      console.log('提交支付，价格:', res);
      uni.$toast('支付成功');
      this.showPay = false;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.toPersonalInfo()
    },

    toPersonalInfo () {
      uni.navigateTo({ url: '/pages/merchant/info' })
    },

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

      &-t {
        font-size: 14px;
        color: #333;
        line-height: 1.5;
      }

      .pgc-items {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        margin-bottom: 12px;

        &-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 10px;
        }

        &-t {
          width: 0;
          flex: 1;
          font-size: 14px;
          color: #333;
          margin-right: 10px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &:first-child {
            text-align: left;
          }

          &:last-child {
            margin-right: 0;
            text-align: right;
          }

          &-edit {
            color: #72A5FD;
          }
        }

      }
    }
  }
}
</style>