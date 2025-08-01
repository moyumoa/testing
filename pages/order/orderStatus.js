export const od_title = {
  1: '抢拍订单',
  2: '上拍订单',
  3: '商城订单',
  4: '兑换订单',
  5: '竞拍订单',
  6: '我的售卖'
}

export const od_tabs = {
  // 1: [{id: 0, name: "全部"}, {id: 1, name: "待付款"}, {id: 2, name: "待收款"}, {id: 3, name: "待处理"}, {id: 4, name: "已完成"}],
  1: [{ id: 0, name: "全部" }, { id: 1, name: "待付款" }, { id: 3, name: "转拍/提货" }, { id: 7, name: "待收款" }, { id: 8, name: "已完成" }],
  // 2: [{id: 0, name: "全部"}, {id: 1, name: "待审核"}, {id: 2, name: "待抢购"}, {id: 3, name: "待付款"}, {id: 4, name: "待收款"}, {id: 5, name: "已完成"}],
  3: [{ id: 0, name: "全部" }, { id: 1, name: "待付款" }, { id: 2, name: "待发货" }, { id: 3, name: "待收货" }, { id: 4, name: "已完成" }],
  4: [{ id: 0, name: "全部" }, { id: 2, name: "待处理" }, { id: 3, name: "已完成" }],

  5: [{ id: 0, name: "全部" }, { id: 2, name: "待开拍" }, { id: 3, name: "竞价中" }, { id: 4, name: "已结束" }, { id: 5, name: "已拍下" }],
  6: [{ id: 0, name: "全部" }, { id: 2, name: "付尾款" }, { id: 3, name: "待发货" }, { id: 4, name: "待收货" }, { id: 5, name: "已完成" }, { id: 6, name: "取消/关闭" }],
}

export const is_show_btn = (btn, { category, status }) => {
  if (!btn || !category || !status) return false
  const shopManager = getApp().globalData.shopManager
  // [category] 1竞拍订单 2转拍订单 3商城订单 4兑换订单
  return {
    // [status] -1已取消 1待付款 2待收款 3待处理 4已完成
    1: {
      '删除订单': [-1, 9].includes(status),
      '取消订单': status === 1,
      '立即支付': status === 1,
      '查看付款凭证': status === 7,
      '确认收款': [7, 2].includes(status),
      '提货': status === 3,
      '转拍': status === 3,
      '查看详情': true,
    },
    // [status] -1已取消 1待审核 2待抢购 3待付款 4待收款 5已完成
    2: {
      '删除订单': status === -1,
      // '取消订单': status === 1,
      '查看详情': status === 1,
      '查看详情': status === 2,
      '查看详情': status === 3,
      '查看付款凭证': status === 4,
      '确认收款': status === 4,
      '删除订单': status === 5,
    },
    // [status] -1已取消 1待付款 2待发货 3待收货 4已完成
    3: {
      '删除订单': [-1, 4, 5].includes(status),
      '取消订单': status === 1,
      '立即支付': status === 1,
      '联系商家': status === 2,
      '查看物流单号': status === 3,
      '确认收货': status === 3,
      '查看详情': status === 4,
      // '删除订单': status === 4,
    },
    // [status] -1已取消 1待付款 2待处理 3已完成
    4: {
      '删除订单': [-1, 3].includes(status),
      '取消订单': status === 1,
      '立即支付': status === 1,
      '提货': status === 2,
      '转拍': status === 2,
      '查看详情': status === 3,
    },
    5: {
      '删除订单': status === 0,
      '取消订单': status === 2,
      '立即支付': status === 2,
      '查看详情': status === 3,
    }
  }[category][btn]
}


// getButtonForCategoryAndStatus
export const btn_for_cas = ({ category, status, orderId }, notShowDetail) => {
  console.log(notShowDetail)
  if (!category || !status) return null;

  // [ primary,white,danger,warning,green,blue,gray,black,brown]
  const buttonMap = {
    // 我的竞拍
    5: [
      {
        status: 2,
        type: 'warning',
        name: '等待开拍',
        event: () => {
          console.log('等待开拍');
        }
      },
      {
        status: 3,
        type: 'warning',
        name: '立即出价',
        event: (callback) => {
          console.log('立即出价');
          callback && callback()
        }
      },
      {
        status: 4,
        type: 'gray',
        name: '查看详情',
        event: () => {
          console.log('查看详情');
          uni.navigateTo({ url: `/pages/order/orderDetail?orderId=${orderId}` })
        }
      },
      {
        status: 4,
        type: 'danger',
        name: '删除订单',
        event: () => {
          console.log('删除订单');
        }
      },
      {
        status: 5,
        name: '支付尾款',
        event: () => {
          console.log('支付尾款');
        }
      },
    ],

    // 我的售卖
    6: [
      {
        status: 2,
        type: 'warning',
        name: '联系店铺',
        event: () => {
          console.log('联系店铺');
        }
      },
      {
        status: 2,
        type: 'brown',
        name: '取消',
        event: () => {
          console.log('取消');
        }
      },
      {
        status: [3, 4],
        type: 'gray',
        name: '查看详情',
        event: () => {
          console.log('查看详情');
          uni.navigateTo({ url: `/pages/order/orderDetail?orderId=${orderId}` })
        }
      },
    ],
  };

  return (buttonMap[category] || []).filter(button => Array.isArray(button.status) ? button.status.includes(status) : button.status === status)
};