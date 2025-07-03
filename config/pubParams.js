
module.exports = {
  // 店铺管理底部按钮
  storeManagementTabs: [
    {
      text: '订单管理',
      color: '#333',
      //1-选中切换，2-跳转、请求、其他操作，3-菜单
      type: 2,
      //自定义参数，类型自定义
      parameter: '/pages/my/myOrder?category=1&shopOrder=1',
      //子菜单left值,不传默认50%,当菜单贴近左右两边可用此参数调整
      popupLeft: '',
    },
    {
      text: '场次设置',
      color: '#333',
      //1-选中切换，2-跳转、请求、其他操作，3-菜单
      type: 2,
      //自定义参数，类型自定义
      parameter: '/pages/storeManagement/eventManagement',
      //子菜单left值,不传默认50%,当菜单贴近左右两边可用此参数调整
      popupLeft: '',
    }, {
      text: '店铺成员',
      color: '#333',
      //1-选中切换，2-跳转、请求、其他操作，3-菜单
      type: 2,
      //自定义参数，类型自定义
      parameter: '/pages/storeManagement/storeMember',
      //子菜单left值,不传默认50%,当菜单贴近左右两边可用此参数调整
      popupLeft: '',
    }, {
      text: '商品管理',
      iconPath: '/static/images/icons/more3.png',
      selectedIconPath: '/static/images/icons/more3.png',
      color: '#333',
      //1-选中切换，2-跳转、请求、其他操作，3-菜单
      type: 3,
      //自定义参数，类型自定义
      parameter: null,
      //子菜单left值,不传默认50%,当菜单贴近左右两边可用此参数调整
      popupLeft: '',
      itemList: [
        {
          //不建议超过6个字，请自行控制
          text: '店铺商品',
          //自定义参数，类型自定义
          parameter: '/pages/storeManagement/commodityManagement'
        },
        {
          text: '上架审核',
          //自定义参数，类型自定义
          parameter: '/pages/storeManagement/putawayAudit'
        },
      ]
    }
  ],

  /* // 个人中心功能列表
  myFunctionList: [
    { name: '购物订单', url: '/pages/my/myOrder?category=3', icon: '/static/images/per/icon/1-1.png' },
    // { name: '兑换订单', url: '/pages/my/myOrder?category=4', icon: '/static/images/per/icon/1-2.png' },
    { name: '邀请拍友', url: '/pages/personal/other/invite', icon: '/static/images/per/icon/1-3.png' },
    { name: '会员中心', url: '/pages/personal/other/memberCenter', icon: '/static/images/per/icon/1-4.png' },
    // { name: '收款信息', url: '/pages/personal/other/collectionInformation', icon: '/static/images/per/icon/1-5.png' },
    { name: '好物兑换', url: '/pages/index/exchange', icon: '/static/images/per/icon/1-6.png' },

    // #ifdef APP-PLUS
    { name: '实名认证', url: '/pages/verified/verified', icon: '/static/images/per/icon/1-5.png' },
    // #endif
    // { name: '银行卡管理', url: '/pages/wallet/bankList', icon: '/static/images/per/icon/1-5.png' },
  ], */

  // 个人中心功能列表
  myFunctionList: [
    // { name: '邀请好友', url: '/pages/personal/other/invite', icon: '/static/images/per/icon/1-3.png' },
    { name: '购物订单', url: '/pages/my/myOrder?category=3', icon: '/static/images/per/icon/1-3.png' },
    { name: '成为拍客', url: '/pages/personal/other/auctionPromoter', icon: '/static/images/per/icon/1-3.png' },
    { name: '直播中心', url: '/pages/community/live-center', icon: '/static/images/per/icon/1-1.png' },
    // { name: '兑换订单', url: '/pages/my/myOrder?category=4', icon: '/static/images/per/icon/1-2.png' },
    { name: '卖家中心', url: '/pages/sellerCenter/index', icon: '/static/images/per/icon/1-4.png' },
    { name: '入驻店铺', url: '/pages/sellerCenter/sellersSettledIn', icon: '/static/images/per/icon/1-4.png' },
    // { name: '收款信息', url: '/pages/personal/other/collectionInformation', icon: '/static/images/per/icon/1-5.png' },
    // #ifdef APP-PLUS
    { name: '实名认证', url: '/pages/verified/verified', icon: '/static/images/per/icon/1-5.png' },
    // #endif
    // { name: '帮助中心', url: '/pages/index/exchange', icon: '/static/images/per/icon/1-6.png' },
    
  ],

  /* 个人中心tab */
  myTabs: [
    { name: '全部', value: 0, icon: '/static/images/per/icon/0.png' },
    { name: '待付款', value: 1, icon: '/static/images/per/icon/2.png' },
    { name: '提货/转拍', value: 2, icon: '/static/images/per/icon/5.png' },
    { name: '待收款', value: 3, icon: '/static/images/per/icon/3.png' },
    // { name: '待审核', value: 3, icon: '/static/images/per/icon/3.png' },
    { name: '已完成', value: 4, icon: '/static/images/per/icon/4.png' },
  ],

  /* 个人中心功能列表 */
  grids: [
    { name: '我参拍的', url: '/pages/order/orderList?category=5', icon: '/static/images/personal/jingpai.png' },
    { name: '我拍到的', url: '/pages/order/orderList?category=7', icon: '/static/images/personal/dingdan.png' },
    { name: '我发布的', url: '/pages/order/orderList?category=6', icon: '/static/images/personal/wfabu.png' },
    { name: '我卖出的', url: '/pages/order/orderList?category=8', icon: '/static/images/personal/maichu.png' },
    // { name: '我拍到的', url: '/pages/my/myOrder?category=5&status=2', icon: '/static/images/personal/dingdan.png' },
    // { name: '会员', url: '/pages/personal/other/memberCenter', icon: '/static/images/personal/huiyuani.png' },
  ],

  /* 店铺功能列表 */
  storeFunctionList: [
    { name: '拍品管理', url: 'lotManagement', icon: '/static/images/icons/ppgl.png' },
    { name: '拍品审核', url: 'lotReview', icon: '/static/images/icons/ppsh.png' },
    { name: '发布拍品', url: '/pages/issue/issue', icon: '/static/images/icons/fbpp.png' },
    { name: '订单管理', url: '/pages/order/orderList?category=8&shopOrder=1', icon: '/static/images/icons/ddgl.png' },
  ],
}

