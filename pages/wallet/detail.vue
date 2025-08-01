<template>
  <view class="pagecontainer">

    <u-sticky v-if="options.source !== 'withdraw'">
      <u-tabs class="tabclass" :list="tabList" @click="changeTab" lineWidth="30" activeStyle="color: #3c9cff;" />
    </u-sticky>

    <template v-if="paginated && paginated.data.length">
      <view class="crads" v-for="(item, index) in paginated.data" :key="index">
        <view class="crads-item">
          <view class="crads-item-left">
            <text class="crads-item-left-title">{{ item.createBy }}</text>
            <text class="crads-item-left-t">{{ typeTxt }}类型: {{ item.transTypeText }}</text>
            <text class="crads-item-left-t" v-if="options.source === 'withdraw'">提现账户: {{ item.account }}</text>
            <text class="crads-item-left-t">交易单号: {{ item.orderNo }}</text>
          </view>
          <view class="crads-item-right">
            <text class="crads-item-right-title">¥ {{ item.amount / 100 }}</text>
            <text class="crads-item-right-t crads-item-right-t-first">
              {{ options.source !== 'withdraw' ? item.payStatusText : item.checkStatusText }}
            </text>
            <text class="crads-item-right-t">{{ item.createTime }}</text>
          </view>
        </view>
        <view class="crads-desc" v-if="item.checkRemark">{{ item.checkRemark }}</view>
      </view>

    </template>
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
      { name: '支出', id: 1 },
      { name: '入账', id: 2 },
    ],
    relation: {},
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
    typeTxt: function () {
      return {
        1: '支出',
        2: '入账',
        3: '提现',
      }[this.currentNav] || '未知';
    },
  },

  watch: {
    async currentNav (newVal) {
      console.log('切换tab', newVal);
      const payStatusText = (val) => ({
        '-1': '提现失败',
        1: '提现中',
        2: '支付成功',
      }[val] || '超时');
      const transTypeText = (val) => ({
        0: '充值',
        1: '押金充值',
        2: '购买会员',
        3: '认证费用',
        4: '解锁聊天',
        5: '预约下单',
        6: this.currentNav === 1 ? '预约金订单退款' : '预约金订单支出',
        7: '解锁帖子',
        8: '用户提现',
      }[val] || '未知');
      await ({
        1: () => this.paginated = createPaginated(uni.$api.rechargeRecord, { payType: 1, }, {
          ...uni.$paging,
          extraList: res => res.rows,
          transformData: (rows, res, query) => rows?.map(item => ({
            ...item,
            payStatusText: payStatusText(item.payStatus),
            transTypeText: transTypeText(item.transType),
          })) || []
        }, 'concat'),
        2: () => this.paginated = createPaginated(uni.$api.rechargeRecord, { payType: 0, }, {
          ...uni.$paging,
          extraList: res => res.rows,
          transformData: (rows, res, query) => rows?.map(item => ({
            ...item,
          })) || []
        }, 'concat'),
      }[newVal] || (() => this.paginated = createPaginated(uni.$api.withdrawRecord, {}, {
        ...uni.$paging,
        extraList: res => res.rows,
        transformData: (rows, res, query) => rows?.map(item => ({
          ...item,
          checkStatusText: { 0: '待提现', 1: '提现成功', 2: '提现失败' }[item.checkStatus] || '未知状态',
        })) || []
      }, 'concat')))?.()
      await this.paginated.reload({}, 1)
      const { limit, count } = this.paginated?.pagination
      this.finished = count < limit
    }
  },
  async onLoad (options) {
    this.options = { ...options };
    if (options.source === 'withdraw') {
      uni.setNavigationBarTitle({ title: '提现记录' });
      this.currentNav = 3; // 设置为提现记录
    } else {
      uni.setNavigationBarTitle({ title: '钱包明细' });
      this.currentNav = 1; // 设置为支出记录
    }
    console.log('加载钱包明细', options, this.currentNav);
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
      this.paginated.reload({ type: this.currentNav }, 1)
    },

    async removeItem (item, id) {
      const objkey = { 1: 'invitationId', 2: 'reportId' }[this.currentNav];
      console.log('移除帖子', item, objkey, this.paginated.data);
      // 从列表中找到对应的项并移除
      const index = this.paginated.data.findIndex(i => i[objkey] === id);
      if (index !== -1) {
        this.paginated.data.splice(index, 1);
      }
      // await uni.$api.favoriteRemove({ id: item.id })
      uni.$toast('已移除');
    },


  },
  async onReachBottom () {
    if (this.finished) return
    const { page, limit, total, count } = this.paginated.pagination
    this.paginated.onChangePage(page + 1, limit)
    this.finished = count < limit
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

.crads {
  padding: 12px;
  box-sizing: border-box;
  margin-bottom: 8px;
  background-color: #fff;

  &-desc {
    margin-top: 6px;
    color: #ADB5C4;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 6px 8px;
    border-radius: 6px;
  }

  &-item {
    display: flex;
    justify-content: space-between;


    &-left {
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;

      &-title {
        font-size: 15px;
        word-break: break-all;
      }

      &-t {
        margin-top: 5px;
        color: #ADB5C4;
        font-size: 12px;
        word-break: break-all;
      }
    }

    &-right {
      margin-left: 12px;
      flex-shrink: 0;
      text-align: right;

      &-title {
        font-size: 15px;
        color: #3c9cff;
        font-weight: bold;
      }

      &-t {
        display: block;
        margin-top: 5px;
        color: #ADB5C4;
        font-size: 12px;

        &-first {
          font-size: 12px;
          color: #000;
        }
      }
    }
  }

}

.tabclass {
  position: sticky;
  top: 0;
  background-color: #FAFCFE;
  margin-bottom: 12px;

  // 居中显示
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>