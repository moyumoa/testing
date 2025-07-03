import { server, upLoad, uploadToQiniu } from './request.js'
const loading = true
const popTips = true

// 示例: get请求 export const xxx = params => server('/xxx/xxx','GET',params)
// 示例: POST(json) export const xxx = params => server('/xxx/xxx','POST',params)
// 示例: 需要携带token请在末尾加true api.xxx = server => server('/xxx/xxx','POST',params,true)

// 登录
export const login = params => server({ url: '/user/login', method: 'POST', params }) // 登录
// 获取消息列表
export const conversation = params => server({ url: '/conversation/sync', method: 'POST', params })
// 获取指定频道消息
export const getMessages = params => server({ url: '/message/channel/sync', method: 'POST', params })
// 通过uid获取用户信息
export const getImUser = params => server({ url: `/users/${params}?group_no=`, method: 'GET' })

// 商品分类(商城1 拍卖2)
export const category = params => server({ url: '/category', method: 'GET', params })
// 竞拍商品列表
export const auctionList = params => server({ url: '/auction/list', method: 'GET', params })
// 拍卖商品详情
export const auctionDetail = params => server({ url: `/auction/detail/${params}`, method: 'GET' })
// 出价记录
export const auctionRecord = params => server({ url: `/auction/record`, params, method: 'GET' })
// 获取默认地址
export const defaultAddress = params => server({ url: '/address/default', method: 'GET', params })
// 直播点击拍卖
export const auctionStart = params => server({ url: `/auction/start/${params}`, method: 'POST' })

// 缴纳保证金
export const payBond = params => server({ url: '/order/createDirect', method: 'POST', params, loading })
// 出价
export const auctionBid = params => server({ url: '/auction/addPrice', method: 'POST', params, loading })

// 获取服务店铺列表
export const getShopList = params => server({ url: '/auction/getChooseStoreList', method: 'GET', params })
// 发布拍卖
export const auctionPublish = params => server({ url: '/auction/addOrUpdate', method: 'POST', params, loading })

// 通过单号获取需要支付的金额
export const getPayPrice = params => server({ url: '/order/getOrderPrice', method: 'GET', params })

// 店铺入驻
export const shopJoin = params => server({ url: '/system/storeApply/save', method: 'POST', params, loading })
// 店主查看店铺信息
export const shopInfo = params => server({ url: '/system/store/getInfo', method: 'GET', params })
// 查询店铺状态
export const shopStatus = params => server({ url: '/system/store/checkStoreStatus', method: 'GET', params })
// 店铺收益概览
export const shopIncome = params => server({ url: '/system/store/getIncome', method: 'GET', params })
// 修改店铺信息
export const editShop = params => server({ url: '/system/store/updateInfo', method: 'POST', params, popTips })
// 查看店铺申请信息
export const shopApplyInfo = params => server({ url: '/system/storeApply/getInfo', method: 'GET', params })
// 修改店铺状态
export const editShopStatus = params => server({ url: `/system/store/updateStatus/${params}`, method: 'POST', loading })
// 店铺拍品管理列表
export const shopGoods = params => server({ url: '/system/store/getAuctionProduct', method: 'GET', params })
// 店铺拍品上下架
export const shopGoodsUpDown = params => server({ url: `/system/store/putRack`, method: 'POST', params, loading })
// 店铺拍品审核
export const shopGoodsAudit = params => server({ url: `/system/store/examine`, method: 'POST', params, loading })

// 拍客推广统计、邀请码
export const getPromotion = params => server({ url: '/promoter/people/count', method: 'GET', params })
// 拍客推广列表
export const getPromotionList = params => server({ url: '/promoter/people', method: 'GET', params })

// 注销账号
export const logoutAccount = params => server({ url: '/user/logout', method: 'POST', params, loading })

// 获取二维码
export const getQrcode = params => server({ url: '/user/getQRCode', method: 'POST', params })
// 验证实名认证结果
export const verified = params => server({ url: '/user/getAuthResult', method: 'GET', params, loading })
// 获取收款账户
export const getAccount = params => server({ url: '/extract/bank/list', method: 'GET', params })
// 添加/修改收款账户
export const editAccount = params => server({ url: '/extract/bank/add', method: 'POST', params, loading })

// 验证手机号是否注册过
export const checkPhone = params => server({ url: '/checkPhone', method: 'GET', params })
// 发送验证码
export const sendCode = params => server({ url: '/sendCode', method: 'GET', params, loading })
// 手机号登录
export const phoneLogin = params => server({ url: '/login/mobile', method: 'POST', params, loading })
// 获取临时token信息
export const getTempToken = params => server({ url: '/getTempToken', method: 'POST', params })
// 退出登录
export const logout = params => server({ url: '/logout', method: 'GET', params, loading })
// 获取用户信息
export const userInfo = params => server({ url: '/user', method: 'GET', params })
// 获取个人主页关联信息
export const userRelation = params => server({ url: '/userProfile/get', method: 'GET', params })
// 获取关注粉丝列表
export const getFansList = params => server({ url: '/userFollows/followList', method: 'GET', params })
// 关注/取消操作
export const follow = params => server({ url: `/userFollows/follow/${params}`, method: 'POST', loading })
// 修改个人资料
export const editUserInfo = params => server({ url: '/user/edit', method: 'POST', params, loading })
// 换绑手机号
export const changePhone = params => server({ url: '/update/binding', method: 'POST', params, loading })
// 文件上传
export const uploadFile = params => upLoad('/user/upload/image', params, loading)
// 提交反馈
export const submitFeedback = params => server({ url: '/user/feedback', method: 'POST', params, loading })
// 获取会员中心数据
export const getMemberData = params => server({ url: '/user/level/grade', method: 'GET', params })

// 获取个人收款信息列表
export const getBankList = params => server({ url: '/userAccount/list', method: 'GET', params })
// 获取收款账户详情
export const getBankDetail = params => server({ url: `/userAccount/getDetail`, method: 'GET', params })
// 添加/编辑收款账户
export const editBank = params => server({ url: '/userAccount/edit', method: 'POST', params, loading })
// 删除收款账户
export const delBank = params => server({ url: `/userAccount/delete?id=${params}`, method: 'DELETE', loading })

// 积分信息
export const getPointInfo = params => server({ url: '/integral/user', method: 'GET', params })
// 积分记录
export const getPointList = params => server({ url: '/integral/list', method: 'GET', params })
// 收益信息
export const getIncomeInfo = params => server({ url: '/exp/user', method: 'GET', params })
// 收益记录
export const getIncomeList = params => server({ url: '/user/expList', method: 'GET', params })
// 余额信息
export const getCommissionInfo = params => server({ url: '/commission', method: 'GET', params })
// 余额记录
export const getCommissionList = params => server({ url: '/commission/list', method: 'GET', params })
// 保证金记录
export const getBondList = params => server({ url: '/cautionMoney/list', method: 'GET', params })
// 根据月份统计收入和支出
export const getMonthCount = params => server({ url: '/getIncomeByMonth', method: 'GET', params })
// 提现申请
export const withdrawApply = params => server({ url: '/extract/cash', method: 'POST', params })
// 充值
export const recharge = params => server({ url: '/pay/pay', method: 'POST', params, loading })

// 获取是否有店长资格
export const getShopStatus = params => server({ url: '/checkShopRight', method: 'GET', params })
// 提交店铺申请
export const shopApply = params => server({ url: '/shop/apply', method: 'POST', params, popTips })
// 获取店铺信息
export const getShopInfo = params => server({ url: '/shop/getInfo', method: 'GET', params })
// 店铺日经营数据
export const getShopData = params => server({ url: '/shop/getDayCount', method: 'GET', params })

// 获取可选场次列表
export const getShopTime = params => server({ url: '/shop/getTimeHeader', method: 'GET', params })
// 添加场次
export const addShopTime = params => server({ url: `/shop/addTimeHeadr/${params}`, method: 'POST', loading })
// 删除场次
export const delShopTime = params => server({ url: `/shop/deleteTimeHeadr/${params}`, method: 'DELETE', loading })

// 获取店铺商品列表
export const getShopGoods = params => server({ url: '/shop/getShopProduct', method: 'GET', params })
// 获取店铺商品组合详细列表
export const getShopGroup = params => server({ url: '/shop/groupProList', method: 'GET', params })
// 获取店铺商品详情
export const getShopGoodsDetail = params => server({ url: `/shop/detail/${params}`, method: 'GET' })
// 店铺商品上下架
export const shopGoodsStatus = (id, isShow) => server({ url: `/shop/setShopProductShow/${id}/${isShow}`, method: 'GET', loading })
// 店铺订单批量上架
export const shopGoodsBatch = params => server({ url: '/shop/setShopProductShowAll', method: 'GET', params, loading })
// 获取店铺成员
export const getShopMember = params => server({ url: '/shop/team', method: 'GET', params })

// 店铺成员转移申请
export const transferApply = params => server({ url: '/shop/changeApplySubmint', method: 'POST', params, popTips })
// 查询转移审核列表
export const transferList = params => server({ url: '/shop/changeApplyList', method: 'GET', params })
// 转移审核
export const transferAudit = (lutId, status) => server({ url: `/shop/changeApplyVerify/${lutId}/${status}`, method: 'POST', loading })
// 根据店铺号获取店铺信息
export const getShopByShopNo = params => server({ url: '/shop/getInfoByCode', method: 'GET', params })
// 根据id获取转移成员列表
export const getTransferMember = params => server({ url: '/shop/getShiftUserInfo', method: 'GET', params })

// 获取商户收款信息
// export const getShopBank = params => server({ url: '/userAccount/order', method: 'GET', params })
export const getShopBank = params => server({ url: '/userAccount/getPayAccount', method: 'GET', params, loading })


/* 邀请有礼 */
// 获取邀请信息
export const getInviteInfo = params => server({ url: '/spread/people/count', method: 'GET', params })
// 邀请记录
export const inviteList = params => server({ url: '/spread/people', method: 'GET', params })

/* 社区 */
//新建|修改直播间信息
export const saveAdnUpdate = params => server({ url: '/userLiveBroadcastRoom/saveAdnUpdate', method: 'POST', params, loading })
//批量删除动态
export const articleDelete = params => server({ url: `/shareArticle/delete/${params}`, method: 'POST' })
//查询直播间列表
export const getLiveList = params => server({ url: '/userLiveBroadcastRoom/list', method: 'GET', params })
//获取所有直播分类
export const getLiveSort = params => server({ url: '/liveBroadcastingRoomSort/get', method: 'GET', params })
//获取用户直播间信息
export const getLiveInfoByUserId = params => server({ url: '/userLiveBroadcastRoom/getByUserId', method: 'GET', params, loading })
//获取所有动态分类
export const getArticleSort = params => server({ url: '/shareArticleSort/get', method: 'GET', params })
//发布帖子
export const articleInsert = params => server({ url: '/shareArticle/insert', method: 'POST', params, loading })
//社区动态列表
export const articleList = params => server({ url: '/shareArticle/list', method: 'GET', params })
//短视频列表
export const videoList = params => server({ url: '/shareArticle/videoList', method: 'GET', params })
//根据房间号获取直播间信息
export const getByRoomNum = params => server({ url: '/userLiveBroadcastRoom/getByRoomNum', method: 'GET', params, loading })
//获取互动消息列表
export const interactionMessages = params => server({ url: '/interactionMessages/list', method: 'GET', params, loading })
//我的点赞列表/收藏列表
export const likeList = params => server({ url: '/shareArticleLikes/likeList', method: 'GET', params })
//点赞/取消点赞
export const likePost = params => server({ url: `/shareArticleLikes/likePost/${params}`, method: 'POST', params, loading })
//获取用户未读互动消息数量
export const likeGetCount = params => server({ url: '/interactionMessages/getCount', method: 'GET', params })
//标记所有未读消息为已读
export const setReadStatus = params => server({ url: '/interactionMessages/setReadStatus', method: 'GET', params })
//用户举报
export const reportAdd = params => server({ url: '/report/add', method: 'POST', params })
//获取违法类型
export const getViolationType = params => server({ url: '/report/getViolationType', method: 'GET', params })
//获取通知
export const noticeList = params => server({ url: `/notice/list/${params.type}`, method: 'GET', params })
//动态详情
export const articleDetail = params => server({ url: `/shareArticle/detail`, method: 'GET', params })
//根据userIds获取用户昵称头像
export const getByUserIds = params => server({ url: `/userFollows/getByUserIds`, method: 'GET', params })
//获取收藏店铺列表
export const favoriteStoreList = params => server({ url: `/userFavoriteStore/list`, method: 'GET', params })
//收藏/取消收藏
export const saveStoreOrUpdate = params => server({ url: `/userFavoriteStore/saveOrUpdate`, method: 'POST', params })

// 商品列表
export const goodsList = params => server({ url: '/products', method: 'GET', params })
// 首页轮播商品
export const bannerGoods = params => server({ url: '/index/getBanner', method: 'GET', params })
// 首页轮播图
export const banner = params => server({ url: '/article/banner/list', method: 'GET', params })
// 获取轮播详情
export const bannerDetail = params => server({ url: `/article/info`, method: 'GET', params })

// 商品详情
export const goodsDetail = params => server({ url: `/product/detail/${params}`, method: 'GET' })
// 商品预下单
export const preOrder = params => server({ url: '/order/pre/order', method: 'POST', params, loading })
// 获取预下单信息
export const getOrderInfo = params => server({ url: `/order/load/pre/${params}`, method: 'GET' })
// 创建订单
export const createOrder = params => server({ url: '/order/create', method: 'POST', params, loading })
// 订单支付
export const orderPay = params => server({ url: '/pay/payment', method: 'POST', params, loading })
// 查询支付结果
export const payResult = params => server({ url: `/pay/queryPayResult`, method: 'GET', params })


/* 订单管理 */
// 获取订单列表
export const orderList = params => server({ url: '/order/list', method: 'GET', params })
// 取消订单
export const cancelOrder = params => server({ url: `/order/cancel/${params}`, method: 'POST', loading })
// 删除订单
export const delOrder = params => server({ url: `/order/del/${params}`, method: 'POST', loading })
// 确认收货
export const confirmOrder = (id, type) => server({ url: `/order/take/${id}/${type}`, method: 'POST', loading })
// 获取订单详情
export const orderDetail = (orderId, shopOrder) => server({ url: `/order/detail/${orderId}/${shopOrder}`, method: 'GET', loading })
// 获取快递公司列表
export const expressList = params => server({ url: '/express/list', method: 'GET', params })
// 发货
export const sendGoods = params => server({ url: '/order/deliverGoods', method: 'POST', params, loading })
// 提货/转拍
export const takeOrder = (orderId, type) => server({ url: `/order/orderShift/${orderId}/${type}`, method: 'POST', popTips })
// 合并订单
export const mergeOrder = params => server({ url: '/order/merge', method: 'POST', params, popTips })
// 计算价格
export const calcPrice = params => server({ url: '/order/calTotalPrice', method: 'POST', params })
// 上架确认列表
export const confirmList = params => server({ url: '/order/preGroundinglist', method: 'GET', params, loading })
// 获取订单组合列表详情列表
export const getGroupDetail = params => server({ url: '/order/groupProList', method: 'GET', params })

// 获取收货地址列表
export const addressList = params => server({ url: '/address/list', method: 'GET', params, })
// 保存收货地址
export const saveAddress = params => server({ url: '/address/edit', method: 'POST', params, loading })
// 获取地址详情
export const addressDetail = params => server({ url: `/address/detail/${params}`, method: 'GET', })
// 删除收货地址
export const delAddress = params => server({ url: `/address/del`, method: 'POST', params, loading })

// 获取专拍标签
export const getSpecialTag = params => server({ url: '/shopProducts/header', method: 'GET', params })
// 获取专拍列表
export const getSpecialList = params => server({ url: `/shopProducts/list`, method: 'GET', params })

// 获取商品组合列表
export const getGroupList = params => server({ url: '/shopProducts/groupProList', method: 'GET', params })

// 获取专拍详情
export const getSpecialDetail = params => server({ url: `/shopProducts/detail/${params}`, method: 'GET', })
// 预约专拍
export const preSpecial = params => server({ url: `/bespoken/${params}`, method: 'POST', loading })


// 获取兑换商品列表
export const getExchangeList = params => server({ url: '/pointProducts', method: 'GET', params })
// 获取兑换商品详情
export const getExchangeDetail = params => server({ url: `/pointProducts/detail/${params}`, method: 'GET', })





/* ============================ */


// 获取七牛云token
export const getQiniuToken = params => server({ url: '/common/qn-token', method: 'GET', params, loading })
// 客户端直传七牛云
export const uploadToqn = (filePath, fileName, token) => uploadToQiniu(filePath, fileName, token)


// 微信授权
export const wxLogin = data => server('/login/wxLogin', 'POST', data)




