<script>
// import * as serve from './config/api.js' //引入接口文件
import * as rf from './config/public.js'
import * as globalContent from './config/global.js'
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
					/* IM没起来 临时注释一下 */
					// this.$im.init({ imUid: newVal.imUid, imToken: newVal.imToken });
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
		uni.$gc = globalContent
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

			uni.$paging = {
				pageKey: 'pageNum',
				limitKey: 'pageSize',
				extraList: res => res.rows,
				extraTotal: res => res.total,
				defaultPagination: { page: 1, limit: 20 },
			}

		// 检查token是否过期
		setInterval(() => {
			console.log('定时检查token是否过期')
			this.checkTokenExpiration()
		}, 2000);

		uni.$previewVideo = (file) => {
			console.log('预览视频文件', file);
			let url = '';

			if (typeof file === 'string') {
				url = file;
			} else if (file && file.url) {
				url = file.url;
			} else {
				return uni.$toast('视频文件不存在');
			}

			uni.navigateTo({
				url: `/pages/common/videoPreview?url=${encodeURIComponent(url)}`
			});
		}
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
				uni.reLaunch({
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
	/* background: #F8F9FA; */
	background: #FAFCFE;
}

page::-webkit-scrollbar {
	display: none;
	/* 隐藏滚动条 */
}
</style>
<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";

.u-empty {
	margin-top: 20% !important;
	opacity: 0.5;
}

.subbtns {
	position: fixed;
	bottom: 0;
	left: var(--window-left);
	right: var(--window-right);
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #fff;
	height: 40px;
	z-index: 5;

	padding: 8px 16px calc(env(safe-area-inset-bottom) + 8px);
	box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

	&-item {
		flex: 1;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		// padding: 12px;
		border-radius: 44px;
		background-color: $btn-bc;
		margin-right: 10px;
		font-size: 14px;
		color: $btn-c;
		// background: linear-gradient(72deg, rgba(116, 143, 242, 0.4) 0%, rgba(116, 143, 242, 0.8) 100%);


		&:last-child {
			margin-right: 0;
		}

		&-gray {
			background-color: #F5F5F5;
			color: #232323;
		}

		&-disabled {
			background-color: #ddd;
			color: #999;
			cursor: not-allowed;
			pointer-events: none;
		}



		// &-t {
		// 	font-size: 15px;
		// 	// color: $btn-c;
		// 	color: #8ddfff;

		// }
	}

	&-nobg {
		// background: transparent;
		// border: 1px solid #ddd;
		color: #555;
		font-size: 14px;
		background: linear-gradient(45deg, rgba(240, 242, 255, 0.4) 0%, rgba(230, 230, 230, 0.64) 100%);

	}
}

.ctext {
	display: flex;
	margin: 8px 0;

	&-inner {
		display: flex;
		align-items: center;
	}

	&-t {
		flex-shrink: 0;
		font-size: 14px;
		color: #777;
	}

	&-t2 {
		width: 0;
		flex: 1;
		font-size: 14px;
		color: #333;
	}

	&-t3 {
		background-color: #f5f5f5;
		border-radius: 8px;
		padding: 8px;
		// margin: 8px;
		font-size: 14px;
		color: #333;

		&>text {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}
}

.uoverview {
	display: flex;
	align-items: center;

	&-l {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid #eee;
		box-sizing: border-box;
		overflow: hidden;

		&-avatar {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&-c {
		flex-grow: 1;
		margin-left: 12px;

		&-top {
			display: flex;
			align-items: center;

			&-t {
				font-size: 15px;
				color: #333;
				margin-right: 8px;
			}
		}

		&-bottom {

			&-t {
				font-size: 12px;
				color: #999;
			}
		}
	}
}
</style>