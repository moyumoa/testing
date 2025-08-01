<template>
  <view class="pagecontainer">

    <view class="crad">
      <view class="crad-top">
        <text class="crad-top-t">{{ item.orderTypeTxt }}</text>
        <text class="crad-top-t2">{{ item.rt }}</text>
      </view>
      <view class="crad-body">
        <view class="crad-body-l">
          <image :src="item.avatar" class="crad-body-l-img" />
        </view>
        <view class="crad-body-r" v-if="item.infos">
          <text class="crad-body-r-title">{{ item.infos.title }}</text>
          <text class="crad-body-r-t" v-for="(cell, cellIndex) in item.infos.rows" :key="cellIndex">{{ cell.label }}：{{
            cell.value }}</text>
        </view>
      </view>
      <view class="crad-subbody">
        <text class="crad-subbody-t">{{ 3 === 3 ? '实收金额' : '支付金额' }}</text>
        <text class="crad-subbody-t2">¥ {{ item.realAmount / 100 }}</text>
      </view>
    </view>

    <view class="cell" v-if="item.infos">
      <view class="cell-item">
        <text class="cell-item-t">订单编号</text>
        <div class="cell-item-v">
          {{ item.orderNo }}
          <text class="cell-item-v-copy" @tap="copy(item)">复制</text>
        </div>
      </view>
      <view class="cell-item" v-for="(cell, _index) in item.infos.list" :key="_index">
        <text class="cell-item-t">{{ cell.label }}</text>
        <div class="cell-item-v">{{ cell.value }}</div>
      </view>

    </view>

    <view class="crad-btns">
      <text class="crad-btns-item" :class="{ 'btndisabled': btn.disabled }" v-for="(btn, i) in item.buttons" :key="i"
        @tap.stop="!btn.disabled && btn.action()">
        <!-- {{ btn.text }} -->
        {{ typeof btn.text === 'function' ? btn.text(item, getUserInfo.id) : btn.text }}
      </text>
    </view>

    <t-pay-way neededs="4" :payPrice="payPrice" :show="showPay" @close="showPay = false" @pay="submitPay" />

  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { formatNum } from '@mvmoo/us'

export default {
  data: () => ({
    currentNav: 0, // 当前选中的导航
    finished: false, // 是否加载完毕
    options: {},
    item: {},
    tabList: [
      { name: '全部订单', id: 1, value: '' },
      { name: '待支付', id: 2, value: 10 },
      { name: '待接单', id: 3, value: 11 },
      { name: '进行中', id: 4, value: 12 },
      { name: '已完成', id: 5, value: { params: { "orderStatus": 4 } } },
    ],
    relation: {},
    payPrice: 0, // 支付金额
    showPay: false, // 是否显示支付弹窗
  }),
  computed: {
    ...mapGetters(['getUserInfo', 'getUpdatedOrders']),
  },
  onShow () {
    // 判断是否有更新的订单
    if (this.getUpdatedOrders.length > 0) {
      this.getUpdatedOrders.forEach(async id => {
        await this.getOrderDetail(id);
      });
    }
  },
  async onLoad (options) {
    this.options = { ...options };
    this.getOrderDetail(options.orderId);
  },
  // 监听选中导航变化
  watch: {
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    formatNum (num) { return formatNum(num) },
    /* 根据传入的出生日计算年龄段 例如:85后 90后 00后 10后 */
    ageGroup (birthday) {
      const year = new Date(birthday).getFullYear();
      if (isNaN(year)) return '未知';
      const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
      return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
    },

    getButtons (item, userId = this.getUserInfo.id) {
      return uni.$gc.buttonRules
        .filter(rule => rule.show(item, this.getUserInfo.id))
        .map(rule => ({
          text: typeof rule.text === 'function' ? rule.text(item, userId) : rule.text,
          disabled: typeof rule.disabled === 'function' ? rule.disabled(item, userId) : false,
          action: () => rule.action(item, this)
        }))
    },

    // 获取订单详情
    async getOrderDetail (orderId) {
      const res = await uni.$api.orderDetail({ id: orderId });
      this.item = this.replaceData(res.data);
      this.payPrice = this.item.realAmount / 100; // 设置支付金额
    },

    // 修改单条数据的值
    async updatateItem (id) {
      const res = await uni.$api.orderDetail({ id });
      this.item = this.replaceData(res.data);
      this.payPrice = this.item.realAmount / 100; // 更新支付金额
    },

    // 删除单条数据
    async deleteItem (id) {
      uni.showLoading({ title: '即将跳转' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      uni.navigateBack();
    },

    // 替换数据
    replaceData (item) {
      // 是否为自己
      const isSelf = item.userId === this.getUserInfo.id;
      return {
        ...item,
        buttons: this.getButtons(item),
        ageGroup: this.ageGroup(item.birthday), // 年龄段
        rt: { '-1': '已取消', 11: '待接单', 12: '进行中', 10: '支付中', 4: '已完成' }[item.orderStatus] || '未知状态',
        orderTypeTxt: { 0: '充值', 1: '押金充值', 2: '购买会员', 3: '认证费用', 4: '解锁聊天', 5: '预约下单', 6: '解锁帖子' }[item.orderType] || '未知',
        infos: {
          0: {
            paytxt: '实付金额',
            title: item.userName,
            rows: [
              { label: '充值账号', value: item.account },
              { label: '充值金额', value: item.realAmount / 100 },
            ],
            list: [
              { label: '订单时间', value: item.createTime },
              { label: '付款时间', value: item.payTime },
            ]
          },
          1: {
            paytxt: '实付金额',
            title: item.userName,
            rows: [
              { label: '充值账号', value: item.account },
              { label: '支付金额', value: item.realAmount / 100 },
            ],
            list: [
              { label: '订单时间', value: item.createTime },
              { label: '付款时间', value: item.payTime },
            ]
          },
          2: {
            title: item.userName,
            paytxt: '支付金额',
            rows: [
              { label: '开通账号', value: item.account },
              { label: '支付金额', value: item.realAmount / 100 },
            ],
            list: [
              { label: '订单时间', value: item.createTime },
              { label: '付款时间', value: item.payTime },
            ]
          },
          3: {
            paytxt: '支付金额',
            title: item.userName,
            rows: [
              { label: '认证账号', value: item.account },
            ],
            list: [
              { label: '订单时间', value: item.createTime },
              { label: '付款时间', value: item.payTime },
            ]
          },
          4: {
            paytxt: !isSelf ? '实收金额' : '支付金额',
            title: !isSelf ? item.userName : item.productId ? item.productName : item.customerName,
            rows: !isSelf ? [
              { label: '付款账号', value: item.account },
            ] : [
              { label: '', value: `颜值${item.faceScore}丨身高${item.height}丨体重${item.weight}丨三围${item.size}` },
              { label: '消费情况', value: item.minCharge },
            ],
            list: [
              { label: '订单时间', value: item.createTime },
              { label: '付款时间', value: item.payTime },
              { label: '接单时间', value: item.acceptTime },
              { label: '成交时间', value: item.endTime },
            ]
          },
          5: {
            paytxt: !isSelf ? '实收金额' : '支付金额',
            title: !isSelf ? item.userName : item.productId ? item.productName : item.customerName,
            rows: !isSelf ? [
              { label: '付款账号', value: item.account },
            ] : [
              { label: '', value: `颜值${item.faceScore}丨身高${item.height}丨体重${item.weight}丨三围${item.size}` },
              { label: '消费情况', value: item.minCharge },
            ],
            list: [
              { label: '订单时间', value: item.createTime },
              { label: '付款时间', value: item.payTime },
              { label: '接单时间', value: item.acceptTime },
              { label: '成交时间', value: item.endTime },
            ]
          },
          6: {
            paytxt: !isSelf ? '实收金额' : '支付金额',
            title: item.invitaitonTitle,
            rows: [
              { label: '帖子标识', value: item.invitaitonId }
            ],
            list: [
              { label: '订单时间', value: item.createTime },
            ]
          }
        }[item.orderType] || {},
      }
    },

    async submitPay ({ amount, payType }) {
      this.showPay = false;
    },

    copy (item) {
      uni.setClipboardData({
        data: item.orderNo,
        success: () => {
          uni.showToast({ title: '复制成功', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'none' });
        }
      });
    },

  },
}
</script>

<style>
page {
  background-color: #FAFCFE;
  padding-bottom: 88px;
}
</style>
<style lang="scss" scoped>
.pagecontainer {
  padding-bottom: calc(44px + env(safe-area-inset-bottom));
}

.tabclass {
  background-color: #FAFCFE;
}

.crad {
  padding: 12px;
  box-sizing: border-box;
  margin-bottom: 8px;
  background-color: #fff;

  &-top {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &-t {
      width: 0;
      flex: 1;
      font-size: 14px;
      color: #333;
    }

    &-t2 {
      flex-shrink: 0;
      font-size: 12px;
      color: $ec;
    }
  }

  &-body {
    display: flex;

    &-l {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      margin-right: 12px;
      background-color: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
      overflow: hidden;

      &-img {
        width: 100%;
        height: 100%;
      }
    }

    &-r {
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;

      &-title {
        font-size: 15px;
        color: #333;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-sub {
        font-size: 11px;
        color: #777;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-t,
      &-t2,
      &-t3 {
        font-size: 11px;
        color: #666;
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  &-subbody {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;

    &-t {
      font-size: 12px;
      color: #333;
    }

    &-t2 {
      margin-left: 8px;
      font-size: 14px;
      // color: #e54d42;
      // font-weight: bold;
    }
  }

  &-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    display: flex;
    justify-content: flex-end;
    padding: 12px;
    box-sizing: border-box;

    &-item {
      width: 64px;
      margin-left: 8px;
      padding: 5px 8px;
      border-radius: 64px;
      background-color: #F7F9FB;
      color: #222;
      font-size: 12px;
      text-align: center;

      &:last-child {
        background-color: #3c9cff;
        color: #fff;
      }
    }

    .btndisabled {
      background-color: #f0f0f0;
      color: #ccc;
      cursor: not-allowed;
    }
  }
}

.cell {
  background-color: #fff;

  &-item {

    display: flex;
    justify-content: space-between;
    padding: 12px;

    &-t {
      flex-shrink: 0;
      font-size: 13px;
      color: #333;
    }

    &-v {
      width: 0;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 13px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &-copy {
        margin-left: 8px;
        font-size: 12px;
        color: #3c9cff;
        cursor: pointer;
      }
    }
  }
}
</style>