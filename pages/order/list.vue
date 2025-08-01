<template>
  <view class="pagecontainer">

    <u-sticky>
      <u-tabs class="tabclass" :list="tabList" @click="changeTab" lineWidth="36" activeStyle="color: #3c9cff;" />
    </u-sticky>

    <template v-if="paginated && paginated.data">
      <view class="crad" v-for="(item, index) in paginated.data" :key="index" @tap="gc.orderDetail(item.id)">
        <view class="crad-top">
          <text class="crad-top-t">{{ item.orderTypeTxt }}</text>
          <text class="crad-top-t2">{{ item.rt }}</text>
        </view>
        <view class="crad-body">
          <view class="crad-body-l">
            <image :src="item.avatar" class="crad-body-l-img" />
          </view>
          <view class="crad-body-r">
            <text class="crad-body-r-title">{{ item.infos.title }}</text>
            <text class="crad-body-r-t" v-for="(cell, cellIndex) in item.infos.rows" :key="cellIndex">{{ cell.label
              }}：{{
                cell.value }}</text>

            <!-- <text class="crad-body-r-sub" v-if="item.showSub">颜值{{ item.faceScore }}丨身高{{ item.height }}丨体重{{
              item.weight }}丨三围{{ item.size }}</text>
            <template v-if="item.showRecharge">
              <text class="crad-body-r-t">充值账号：{{ item.account }}</text>
              <text class="crad-body-r-t2">充值金额：{{ item.realAmount / 100 }}</text>
              <text class="crad-body-r-t2">充值时间：{{ item.payTime || item.createTime }}</text>
            </template>
<template v-if="item.showMember">
              <text class="crad-body-r-t2">开通账号：{{ item.account }}</text>
              <text class="crad-body-r-t2">支付金额：{{ item.realAmount / 100 }}</text>
            </template>
<template v-if="item.showPost">
              <text class="crad-body-r-t2">关联帖子：{{ item.invitaitonTitle }}</text>
            </template>
<text class="crad-body-r-t2">订单编号：{{ item.orderNo }}</text>
<text class="crad-body-r-t2">订单时间：{{ item.createTime }}</text>
<text class="crad-body-r-t2">付款时间：{{ item.payTime }}</text>
<text class="crad-body-r-t3">支付方式：{{ item.payText }}</text> -->
          </view>
        </view>
        <view class="crad-subbody">
          <text class="crad-subbody-t">{{ item.infos.paytxt }}</text>
          <text class="crad-subbody-t2">¥ {{ item.realAmount / 100 }}</text>
        </view>
        <view class="crad-btns">
          <text class="crad-btns-item" :class="{ 'btndisabled': btn.disabled }" v-for="(btn, i) in item.buttons" :key="i"
            @tap.stop="!btn.disabled && btn.action()">
            <!-- {{ btn.text }} -->
            {{ typeof btn.text === 'function' ? btn.text(item, getUserInfo.id) : btn.text }}
          </text>
        </view>
      </view>
    </template>
    <t-pay-way neededs="4" :payPrice="payPrice" :show="showPay" @close="showPay = false" @pay="submitPay" />

    <u-empty v-if="paginated && !paginated.data.length" mode="data" text="暂无数据" />
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { createPaginated } from '@mvmoo/optionsapi'
import { formatNum } from '@mvmoo/us'

export default {
  data: () => ({
    currentNav: 0, // 当前选中的导航
    paginated: null, // 分页数据
    finished: false, // 是否加载完毕
    options: {},
    mcInfo: {},
    tabList: [
      { name: '全部订单', id: 1, value: '' },
      { name: '待支付', id: 2, value: 10 },
      { name: '待接单', id: 3, value: 11 },
      { name: '进行中', id: 4, value: 12 },
      { name: '已完成', id: 5, value: { params: { "orderStatus": 4 } } },
    ],
    gc: uni.$gc,
    relation: {},
    payPrice: 0, // 支付金额
    showPay: false, // 是否显示支付弹窗
  }),
  computed: {
    ...mapGetters(['getUserInfo', 'getDeletedOrders', 'getUpdatedOrders']),
  },
  onShow () {
    // 判断是否有删除的订单
    if (this.getDeletedOrders.length > 0) {
      this.getDeletedOrders.forEach(id => {
        this.deleteItem(id);
      });
      this.$store.commit('clearDeletedOrders', []); // 清空已删除订单
    }
    // 判断是否有更新的订单
    if (this.getUpdatedOrders.length > 0) {
      this.getUpdatedOrders.forEach(async id => {
        await this.updatateItem(id);
        await this.$store.commit('updatateOrderItem', id);
      });
    }
  },
  async onLoad (options) {
    this.options = { ...options };
    this.currentNav = (options.type && Number(options.type)) || 1;
  },
  // 监听选中导航变化
  watch: {
    async currentNav (newVal) {
      const value = this.tabList.find(i => i.id === newVal)?.value || '';

      // 根据 value 类型判断参数结构
      const baseParams = { userId: this.getUserInfo.id };
      let queryParams = {};

      if (typeof value === 'object' && value !== null) {
        // value 是对象，如 { params: { orderStatus: 111 } }
        queryParams = { ...baseParams, ...value };
      } else {
        // 普通情况：直接使用 orderStatus
        queryParams = { ...baseParams, orderStatus: value };
      }
      this.paginated = createPaginated(uni.$api.orderList, queryParams, {
        ...uni.$paging,
        transformData: (rows, res, query) => {
          console.log('rows', rows)
          return rows.map(item => ({
            ...item,
            ...this.replaceData(item),
          }))
        }
      }, 'concat')
      await this.paginated.reload({}, 1)
    }
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

    /* 根据秒数计算在线时间分钟/小时/天数 */
    onlineTime (Second) {
      if (Second < 60) return `${Second}秒`;
      if (Second < 3600) return `${Math.floor(Second / 60)}分钟`;
      if (Second < 86400) return `${Math.floor(Second / 3600)}小时`;
      return `${Math.floor(Second / 86400)}天`;
    },

    /* 切换tab */
    changeTab (tab) {
      console.log('切换tab', tab);
      this.currentNav = tab.id;
    },

    getButtons (item, userId = this.getUserInfo.id) {
      return uni.$gc.buttonRules
        .filter(rule => rule.show(item, this.getUserInfo.id))
        .map(rule => ({
          // text: rule.text,
          // action: () => rule.action(item, this)
          text: typeof rule.text === 'function' ? rule.text(item, userId) : rule.text,
          disabled: typeof rule.disabled === 'function' ? rule.disabled(item, userId) : false,
          action: () => rule.action(item, this)
        }))
    },

    // 修改单条数据的值
    async updatateItem (id, value) {
      const res = await uni.$api.orderDetail({ id });
      const index = this.paginated.data.findIndex(i => i.id === id);
      if (index !== -1) {
        const newData = { ...this.paginated.data[index], ...res.data }
        this.$set(this.paginated.data, index, this.replaceData(newData));
      }
    },

    // 删除单条数据
    async deleteItem (id) {
      // await uni.$api.deleteOrder({ id });
      const index = this?.paginated?.data?.findIndex(i => i.id === id);
      if (index !== -1) {
        this.paginated?.data?.splice(index, 1);
      }
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
        // title: item.productId ? item.productName : { 0: item.userName, 1: item.userName, 2: '购买会员', 3: item.userName, 4: item.customerName, 5: item.customerName, 6: item.invitaitonTitle }[item.orderType] || '未知',
        // showSub: [4, 5].includes(item.orderType),
        // showRecharge: [0, 1].includes(item.orderType),
        // showMember: [2].includes(item.orderType),
        // showAuth: [3].includes(item.orderType),
        // showPost: [6].includes(item.orderType),
        // payText: uni.$gc.getPayMethodName(item.payType),
        infos: {
          0: {
            paytxt: '实付金额',
            title: item.userName,
            rows: [
              { label: '充值账号', value: item.account },
              { label: '充值金额', value: item.realAmount / 100 },
              { label: '充值时间', value: item.payTime || item.createTime }
            ]
          },
          1: {
            paytxt: '实付金额',
            title: item.userName,
            rows: [
              { label: '充值账号', value: item.account },
              { label: '支付金额', value: item.realAmount / 100 },
              { label: '充值时间', value: item.payTime || item.createTime }
            ]
          },
          2: {
            title: item.userName,
            paytxt: '支付金额',
            rows: [
              { label: '开通账号', value: item.account },
              { label: '支付金额', value: item.realAmount / 100 },
              { label: '订单编号', value: item.orderNo }
            ]
          },
          3: {
            paytxt: '支付金额',
            title: item.userName,
            rows: [
              { label: '认证账号', value: item.account },
              { label: '认证时间', value: item.payTime || item.createTime }
            ]
          },
          4: {
            paytxt: !isSelf ? '实收金额' : '支付金额',
            title: !isSelf ? item.userName : item.productId ? item.productName : item.customerName,
            rows: !isSelf ? [
              { label: '付款账号', value: item.account },
              { label: '解锁时间', value: item.payTime || item.createTime },
              { label: '订单编号', value: item.orderNo }
            ] : [
              { label: '', value: `颜值${item.faceScore}丨身高${item.height}丨体重${item.weight}丨三围${item.size}` },
              { label: '消费情况', value: item.minCharge },
              { label: '付款时间', value: item.payTime || item.createTime }
            ]
          },
          5: {
            paytxt: !isSelf ? '实收金额' : '支付金额',
            title: !isSelf ? item.userName : item.productId ? item.productName : item.customerName,
            rows: !isSelf ? [
              { label: '付款账号', value: item.account },
              { label: '付款时间', value: item.payTime || item.createTime },
              { label: '订单编号', value: item.orderNo },
            ] : [
              { label: '', value: `颜值${item.faceScore}丨身高${item.height}丨体重${item.weight}丨三围${item.size}` },
              { label: '消费情况', value: item.minCharge },
              { label: '付款时间', value: item.payTime || item.createTime }
            ]
          },
          6: {
            paytxt: !isSelf ? '实收金额' : '支付金额',
            title: item.invitaitonTitle,
            rows: [
              { label: '付款时间', value: item.payTime || item.createTime },
              { label: '订单编号', value: item.orderNo }
            ]
          }
        }[item.orderType] || {},
      }
    },

    async submitPay ({ amount, payType }) {
      this.showPay = false;
    },

  },
  async onReachBottom () {
    const { page, limit, total, count } = this.paginated.pagination
    if (count < limit) return
    this.paginated.onChangePage(page + 1, limit)
  },
}
</script>

<style>
page {
  background-color: #FAFCFE;
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
      font-size: 13px;
      color: $ec;
      font-weight: bold;
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
      color: #e54d42;
      font-weight: bold;
    }
  }

  &-btns {
    display: flex;
    justify-content: flex-end;

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

    .btndisabled{
      background-color: #f0f0f0;
      color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>