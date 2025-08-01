import { server, upLoad, uploadToQiniu } from './request.js'
const loading = true
const popTips = true

// 示例: get请求 export const xxx = params => server('/xxx/xxx','GET',params)
// 示例: POST(json) export const xxx = params => server('/xxx/xxx','POST',params)
// 示例: 需要携带token请在末尾加true api.xxx = server => server('/xxx/xxx','POST',params,true)

// 注册
export const register = params => server({ url: '/app-api/app/user/add', method: 'POST', params })
// 生成头像
export const generateAvatar = params => server({ url: '/app-api/app/user/api/avatar', method: 'POST', params })
// 生成用户名
export const generateUsername = params => server({ url: '/app-api/app/user/api/nickname', method: 'GET', params })
// 登录
export const login = params => server({ url: '/app-api/app/login', method: 'POST', params })
// 退出登录
export const logout = params => server({ url: '/app-api/app/logout', method: 'GET', params, loading })
// 注销账号
export const cancelAccount = params => server({ url: '/app-api/app/del', method: 'GET', params })
// 重置密码
export const resetPassword = params => server({ url: '/app-api/app/user/update', method: 'POST', params })
// 切换接单/休息状态
export const updateOrderStatus = params => server({ url: '/app-api/app/user/checkOrderStatus', method: 'POST', params, loading })

// 获取个人信息
export const userInfo = params => server({ url: '/app-api/app/user/getUserInfo', method: 'GET', params })
// 认证专区列表
export const authList = params => server({ url: '/app-api/app/user/authPage', method: 'POST', params })
// 获取认证详情
export const authDetail = params => server({ url: '/app-api/app/user/getUserDetail', method: 'POST', params })
// 查看自己与他人的关系
export const userRelation = params => server({ url: '/app-api/app/user/getAttentionAndChat', method: 'POST', params })
// 关注
export const followUser = params => server({ url: '/app-api/app/attention/add', method: 'POST', params })
// 取消关注
export const unfollowUser = params => server({ url: '/app-api/app/attention/cancelAttention', method: 'POST', params })
// 关注列表
export const followList = params => server({ url: '/app-api/app/attention/list', method: 'GET', params })
// 收藏列表
export const favoriteList = params => server({ url: '/app-api/app/collect/list', method: 'GET', params })

// 赔付专区列表
export const compensationList = params => server({ url: '/app-api/app/user/compensatePage', method: 'POST', params })


// 商户认证类型列表
export const authType = params => server({ url: '/app-api/app/authType/list', method: 'GET', params })
// 商户发布女郎
export const authAdd = params => server({ url: '/app-api/app/merchantProject/createProjectInfo', method: 'POST', params, loading })
// 店铺女郎列表
export const authListByShop = params => server({ url: '/app-api/app/merchantProject/list', method: 'GET', params })
// 店铺女郎认证列表
export const authListShop = params => server({ url: '/app-api/app/projectAuth/list', method: 'GET', params })
// 店铺女郎上下架
export const authStatus = params => server({ url: '/app-api/app/merchantProject/checkPutStatus', method: 'POST', params, loading })
// 店铺女郎详情
export const authDetailById = params => server({ url: `/app-api/app/merchantProject/projectDetail`, method: 'POST', params })

// 开通会员
export const openMember = params => server({ url: '/app-api/app/order/membership', method: 'POST', params, loading })
// 会员套餐
export const memberPackage = params => server({ url: '/app-api/app/memberPackage/list', method: 'GET', params })

// 余额充值
export const recharge = params => server({ url: '/app-api/app/order/orderRecharge', method: 'POST', params })
// 余额明细
export const rechargeRecord = params => server({ url: '/app-api/app/detailWallet/list', method: 'GET', params })
// 提现记录
export const withdrawRecord = params => server({ url: '/app-api/app/incarnate/list', method: 'GET', params })
// 获取提现手续费率
export const withdrawRate = params => server({ url: '/app-api/app/config/getFeeRate', method: 'GET', params })
// 发起提现
export const withdraw = params => server({ url: '/app-api/app/incarnate/add', method: 'POST', params, loading })
// 认证支付
export const authPay = params => server({ url: '/app-api/app/order/authPay', method: 'POST', params })
// 认证记录
export const authRecord = (params) => server({ url: `/app-api/app/auth/list`, method: 'GET', params })
// 用户认证
export const userAuth = params => server({ url: '/app-api/app/user/updateUserInfo', method: 'POST', params })
// 修改联系方式
export const updateContact = params => server({ url: '/app-api/app/user/updateUserContact', method: 'POST', params })

// 解锁费用
export const unlockPrice = params => server({ url: '/app-api/app/config/getUserChat', method: 'GET', params })
// 发起解锁
export const unlockUser = params => server({ url: '/app-api/app/order/checkChat', method: 'POST', params, loading })
// 查看预约金 | 意向金
export const getUnlockPrice = params => server({ url: '/app-api/app/config/getSubAmount', method: 'GET', params })
// 预约下单
export const reservationOrder = params => server({ url: '/app-api/app/order/subOrder', method: 'POST', params, loading })
// 订单列表
export const orderList = params => server({ url: '/app-api/app/order/list', method: 'GET', params })
// 取消订单
export const cancelOrder = params => server({ url: '/app-api/app/order/cancelOrder', method: 'POST', params, loading })
// 删除订单
export const deleteOrder = params => server({ url: '/app-api/app/order/delOrder', method: 'POST', params, loading })
// 接单
export const acceptOrder = params => server({ url: '/app-api/app/order/acceptOrder', method: 'POST', params, loading })
// 确认订单
export const confirmOrder = params => server({ url: '/app-api/app/order/confirmOrder', method: 'POST', params, loading })
// 订单详情
export const orderDetail = params => server({ url: '/app-api/app/order/getDetail', method: 'POST', params })
// 填写报告
export const orderReport = params => server({ url: '/app-api/app/report/add', method: 'POST', params, loading })
// 报告列表
export const reportList = params => server({ url: '/app-api/app/report/list', method: 'GET', params })
// 发布帖子
export const postAdd = params => server({ url: '/app-api/app/invitation/add', method: 'POST', params, loading })
// 帖子列表
export const postList = params => server({ url: '/app-api/app/invitation/list', method: 'GET', params })
// 发布动态
export const dynamicAdd = params => server({ url: '/app-api/app/dynamic/add', method: 'POST', params, loading })
// 动态列表
export const dynamicList = params => server({ url: '/app-api/app/dynamic/list', method: 'GET', params })




// 文件上传
export const uploadFile = params => upLoad('/app-api/app/common/minioUpload', params)






/* ================IM================ */

// export const login = params => server({ url: '/user/login', method: 'POST', params }) // 登录
// 获取消息列表
export const conversation = params => server({ url: '/im-api/api/v1/conversation/sync', method: 'POST', params })
// 清除未读消息
export const clearUnread = params => server({ url: `/im-api/api/v1/coversation/clearUnread`, method: 'PUT', params })
// 获取指定频道消息
export const getMessages = params => server({ url: '/im-api/api/v1/message/channel/sync', method: 'POST', params })
// 通过uid获取用户信息
export const getImUser = params => server({ url: `/im-api/api/v1/users/${params}?group_no=`, method: 'GET' })


/* ============================ */


// 获取七牛云token
export const getQiniuToken = params => server({ url: '/common/qn-token', method: 'GET', params, loading })
// 客户端直传七牛云
export const uploadToqn = (filePath, fileName, token) => uploadToQiniu(filePath, fileName, token)


// 微信授权
export const wxLogin = data => server('/login/wxLogin', 'POST', data)




