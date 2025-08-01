export const payMethods = {
  1: { id: 1, name: 'USDT', value: 'usdt', color: '#4c9d44' },
  2: { id: 2, name: '线下支付', value: 'offline', color: '#307df6' },
  3: { id: 3, name: '会员解锁', value: 'huiyuan', color: '#4c9d44', requireVip: true },
  4: { id: 4, name: '余额支付', value: 'balance', color: '#ff7979', requireBalance: true }
}

/**
 * 根据 value 获取支付方式名称
 * @param {string} value - 支付方式的值，例如 'usdt'、'offline' 等
 * @returns {string} 返回对应的名称，如果没有匹配项则返回 '未知'
 */
export function getPayMethodName (value) {
  const method = Object.values(payMethods).find(item => item.value === value)
  return method ? method.name : '未知'
}

/**
 * 订单按钮
 */

export const buttonRules = [
  {
    text: '删除',
    show: item => item.orderStatus === 4,
    confirm: '确定要删除该订单吗？',
    handle: 'remove',
    async action (item, self) {
      await uni.$api.deleteOrder({ id: item.id })
      // 在vuex记录删除的id
      uni.showToast({ title: '删除成功', icon: 'success' });
      self.$store.dispatch('markOrderDeleted', item.id)
      await self.deleteItem(item.id)
    }
  },
  {
    text: '联系客服',
    show: item => [12, 4].includes(item.orderStatus) && [0, 1, 2, 4, 5].includes(item.orderType),
    action: () => uni.$gc.openChat()
  },
  {
    text: '取消订单',
    show: (item, userId) => {
      const { orderType, orderStatus } = item;
      const isSelf = item.userId === userId;

      // 特殊处理：预约单（5）
      if (orderType === 5) {
        if (orderStatus === 11) return isSelf;// 下单人：待接单时可取消
        if (orderStatus === 12) return !isSelf;// 接单人：进行中可取消
      }

      // 普通订单：未支付 / 待接单，自己下的单
      const canCancel = [11, 10].includes(orderStatus);
      const isCancellableType = [0, 1, 5].includes(orderType);
      return canCancel && isCancellableType && isSelf;
    },
    action: async (item, self) => {
      await uni.$api.cancelOrder({ orderId: item.id })
      uni.showToast({ title: '取消成功', icon: 'success' });
      self.updatateItem(item.id)
    }

  },
  {
    text: '报告',
    show: (item, userId) => item.orderStatus === 4 && item.orderType === 5 && item.userId === userId && !item.isReport,
    action: (item, self) => {
      uni.navigateTo({ url: `/pages/order/report?userId=${item.userId}&customerId=${item.customerId}&orderId=${item.id}&&orderNo=${item.orderNo}&productId=${item.productId || ''}` })
    }
  },
  // {
  //   text: '去支付',
  //   show: item => item.orderStatus === 10 && [0, 1].includes(item.orderType),
  //   action: (item, self) => self.oper('去支付', item)
  // },
  {
    text: '拒绝订单',
    show: (item, userId) => item.orderStatus === 11 && item.orderType === 5 && item.userId !== userId,
    action: async (item, self) => {
      await uni.$api.cancelOrder({ orderId: item.id })
      uni.showToast({ title: '拒绝成功', icon: 'success' });
      self.updatateItem(item.id)
    }
  },
  {
    text: '接单',
    show: (item, userId) => item.orderStatus === 11 && item.orderType === 5 && item.userId !== userId,
    action: async (item, self) => {
      await uni.$api.acceptOrder({ orderId: item.id })
      uni.showToast({ title: '接单成功', icon: 'success' });
      self.updatateItem(item.id)
    }
  },
  {
    text: (item, userId) => {
      if (item.orderStatus !== 12 || item.orderType !== 5) return '';
      const isSelf = item.userId === userId;
      const isConfirmed = isSelf ? item.userConfirmStatus : item.customerConfirmStatus;
      return isConfirmed ? '对方确认中' : '完成交易';
    },
    show: (item, userId) => {
      return item.orderStatus === 12 && item.orderType === 5;
    },
    disabled: (item, userId) => {
      const isSelf = item.userId === userId;
      return isSelf ? !!item.userConfirmStatus : !!item.customerConfirmStatus;
    },
    action: async (item, self) => {
      const userId = self.getUserInfo.id;
      const isSelf = item.userId === userId;
      const isConfirmed = isSelf ? item.userConfirmStatus : item.customerConfirmStatus;

      if (isConfirmed) return;

      await uni.$api.confirmOrder({ orderId: item.id });
      uni.showToast({ title: '交易完成', icon: 'success' });
      self.updatateItem(item.id);
    }
  }
]


// 联系客服
export const openChat = (imUid = '35282d5ac6e741779c705ffe4588b9b9') => {
  uni.navigateTo({ url: `/pages/message/chat?channelID=${imUid}&channelType=1` })
}
// 订单详情
export const orderDetail = (orderId) => {
  uni.navigateTo({ url: `/pages/order/detail?orderId=${orderId}` })
}
