import store from '@/store';
import {
	userInfo as getUserInfo,
} from '../config/api.js'

// 刷新用户信息
export const userInfo = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await getUserInfo();
			const userData = {
				...res.data,
			};

			// 写入本地缓存
			uni.setStorageSync('userInfo', JSON.stringify(userData));

			// 同时更新 Vuex
			store.commit('setUserInfo', userData);

			resolve(userData);
		} catch (error) {
			try {
				const storage = JSON.parse(uni.getStorageSync('userInfo') || '{}');
				// 即使走缓存也更新 Vuex，确保一致
				store.commit('setUserInfo', storage);
				resolve(storage);
			} catch (e) {
				reject({});
			}
		}
	});
};

// 退出登录
export const logout = () => {
	uni.removeStorageSync('userInfo')
	uni.removeStorageSync('mtttoken')
}
