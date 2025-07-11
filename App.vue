<script>
// import * as serve from './config/api.js' //引入接口文件
import * as rf from './config/public.js'
import * as utils from './utils'
import { envs } from 'config'
import { mapGetters } from 'vuex'
export default {
	globalData: {
		wxOrQQ: false, // 是否是微信或QQ浏览器
		realHeight: 0, // 实际高度
	},
	computed: {
		...mapGetters(['getUserInfo']),
	},

	watch: {
		getUserInfo: {
			handler (newVal) {
				if (newVal?.imUid && newVal?.imToken && (newVal.imUid !== this.$im?.sdk?.config?.uid || newVal.imToken !== this.$im?.sdk?.config?.token)) {
					// this.$im.init(newVal)
					this.$im.init({ imUid: newVal.imUid, imToken: newVal.imToken });
				}
			},
			immediate: true
		}
	},
	onLaunch: function () {

		let ua = navigator.userAgent.toLowerCase()
		const isWxOrQQ = ua.indexOf('micromessenger') > -1 || ua.indexOf('qq/') > -1
		this.globalData.wxOrQQ = isWxOrQQ

		// this.$nextTick()
		uni.getPageHeight = () => {
			let ua = navigator.userAgent.toLowerCase()
			const isWxOrQQ = ua.indexOf('micromessenger') > -1 || ua.indexOf('qq/') > -1

			const windowHeight = window.innerHeight
			let navHeight = 0
			if (!isWxOrQQ) {
				const nav = document.getElementsByTagName('uni-page-head')
				if (nav.length && nav[0].offsetHeight) {
					navHeight = nav[0].offsetHeight
				}
			}
			// this.globalData.realHeight = windowHeight - navHeight
			return windowHeight - navHeight
		}

		// this.$nextTick(() => {
		// 	const isWeiXinBrowser = () => {
		// 		let ua = navigator.userAgent.toLowerCase()
		// 		return ua.indexOf('micromessenger') != -1
		// 	}
		// 	const isQQBrowser = () => {
		// 		var ua = navigator.userAgent.toLowerCase()
		// 		if (ua.match(/QQ/i) == "qq") {
		// 			return true
		// 		} else {
		// 			return false
		// 		}
		// 	}
		// 	const windowHeight = window.innerHeight
		// 	let navHeight = 0
		// 	if (!(isWeiXinBrowser() || isQQBrowser())) {
		// 		const nav = document.getElementsByTagName('uni-page-head')
		// 		if (nav.length && nav[0].offsetHeight) {
		// 			navHeight = nav[0].offsetHeight
		// 		}
		// 	}
		// 	this.globalData.realHeight = windowHeight - navHeight
		// })

		// this.setRealHeight()


		console.log('App 初始化完成')
		// uni.$api = serve
		uni.$rf = rf
		uni.$fn = utils
		uni.$env = envs
		uni.$toast = (title = '', duration = 1200) => {
			uni.showToast({
				title: title,
				icon: 'none',
				position: 'top',
				duration: duration
			})
		}

		const userInfo = this.getUserInfo
		if (userInfo?.uid && userInfo?.token) {
			// this.$im.init(userInfo)
		}

		uni.$web = (url) => {
			return new Promise((resolve, reject) => {
				uni.navigateTo({
					url: `/pages/webview/webview?url=${url}`,
					success: (res) => {
						resolve(res)
					},
					fail: (err) => {
						reject(err)
					}
				})
			})
		},

			// 检查token是否过期
			setInterval(() => {
				console.log('定时检查token是否过期')
				this.checkTokenExpiration()
			}, 2000);
	},
	onShow: function () {
		console.log('App Show')
		window.addEventListener('resize', () => {
			this.setRealHeight()
		})
	},
	onHide: function () {
		console.log('App Hide')
		window.removeEventListener('resize', this.setRealHeight)
	},
	methods: {
		setRealHeight () {
			this.$nextTick(() => {
				const windowHeight = window.innerHeight
				let navHeight = 0
				if (!this.globalData.wxOrQQ) {
					const nav = document.getElementsByTagName('uni-page-head')
					if (nav.length && nav[0].offsetHeight) {
						navHeight = nav[0].offsetHeight
					}
				}
				this.globalData.realHeight = windowHeight - navHeight
			})
		},

		// 计时器定时检查token是否过期
		checkTokenExpiration () {
			// 如果已经在登录页面，则不进行检查
			if (getCurrentPages().length > 0 && getCurrentPages()[getCurrentPages().length - 1].route === 'pages/login') {
				return
			}
			const token = uni.getStorageSync('mtttoken')
			const imToken = uni.getStorageSync('imToken')
			if (!token || !imToken) {
				uni.navigateTo({
					url: '/pages/login',
					success: () => {
						uni.hideLoading()
					},
				})
				return
			}
		}

	}
}
</script>

<style>
page {
	background: #F8F9FA;
}

page::-webkit-scrollbar {
	display: none;
	/* 隐藏滚动条 */
}
</style>
<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";

.subbtns {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #fff;
	height: 44px;

	padding: 8px 16px calc(env(safe-area-inset-bottom) + 8px);
	box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

	&-item {
		flex: 1;
		height: 44px;
		display: flex;
		justify-content: center;
		align-items: center;
		// padding: 12px;
		border-radius: 44px;
		background-color: $btn-bc;
		margin-right: 12px;

		&:last-child {
			margin-right: 0;
		}

		&-t {
			font-size: 15px;
			color: $btn-c;
		}
	}
}
</style>