import {
	userInfo as getUserInfo,
	userRelation,
	getShopStatus,
	shopStatus as shopStatusApi
} from '../config/api.js'

// 刷新用户信息
export const userInfo = async () => {
	return new Promise(async (resolve, reject) => {
		try {

			const res = await getUserInfo()
			const getUserRelation = await userRelation()
			uni.setStorage({
				key: 'userInfo',
				data: JSON.stringify({
					...res.data,
					other: getUserRelation.data
				}),
				success: () => {
					// console.log('用户信息缓存成功', res.data)
				}
			});
			resolve({
				...res.data,
				other: getUserRelation.data
			})
		} catch (error) {
			const storage = JSON.parse(uni.getStorageSync('userInfo') || '{}')
			reject(storage)
		}
	})
}

// 退出登录
export const logout = () => {
	uni.removeStorageSync('userInfo')
	uni.removeStorageSync('mtttoken')
}
