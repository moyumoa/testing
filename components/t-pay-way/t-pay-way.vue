<template>
	<view>
		<tui-bottom-popup :show="show" @close="close">
			<tui-list-cell :hover="false">
				<view class="tui-pay-item__title">
					<view>请选择支付方式</view>
					<view>支付金额：<text class="tui-pay-amuont" v-if="info">￥{{ info.payPrice }}</text></view>
				</view>
			</tui-list-cell>
			<radio-group>
				<tui-list-cell unlined v-for="item in payList" :key="item.id" @click="selection(item)" v-if="!item.disabled">
					<label class="tui-pay-item">
						<u-icon :name="item.icon" size="22" :color="item.color" class="tui-pay-logo" />
						<text>{{ item.name }}{{ item.id === 4 ? `（可用余额 ${balance || 0}）` : '' }}</text>
						<view class="tui-radio" v-if="item.id !== 4 || Number(balance) > Number(info.payPrice)">
							<radio color="#EB0909" name="pay" :disabled="item.disabled" :checked="currentPay === item.id"></radio>
						</view>
						<view class="tui-recharge"
							v-if="item.id === 4 && (Number(balance) <= Number(info.payPrice) || !info.payPrice)"
							@tap.stop="to_topup">去充值</view>
					</label>
				</tui-list-cell>
			</radio-group>
			<view class="tui-btn-pay">
				<tui-button height="40px" type="danger" shape="circle" :shadow="false" @click="btnPay">去付款</tui-button>
			</view>
		</tui-bottom-popup>

		<u-modal :show="show_pop" title="" content="是否已完成支付？" confirmText="已完成支付" cancelText="取消支付" showCancelButton
			@confirm="confirm" @cancel="cancel"></u-modal>
	</view>
</template>

<script>
export default {
	name: 'tPayWay',
	emits: ['close'],
	props: {
		//控制显示
		show: {
			type: Boolean,
			default: false
		},
		page: {
			type: Number,
			default: 1
		},
		info: {
			type: Object,
			default: () => { }
		},
		params: {
			type: Object,
			default: () => { }
		},
		orderNoId: {
			type: String,
			default: ''
		}
	},
	data: () => ({
		show_pop: false,
		balance: 0,
		payList: [
			{
				id: 4,
				name: '余额支付',
				icon: 'rmb-circle-fill',
				color: '#ff7979',
				disabled: false
			},
			{
				id: 1,
				name: '微信支付',
				icon: 'weixin-circle-fill',
				color: '#4c9d44',
				disabled: true
			},
			{
				id: 2,
				name: '支付宝支付',
				icon: 'zhifubao-circle-fill',
				color: '#307df6',
				disabled: false
			}
		],
		currentPay: 4,
		orderNo: '',
		isSkip: false
	}),

	watch: {
		async show (val) {
			if (val) {
				if (this.info.category === 1) {
					this.payList = this.payList.filter(item => item.id === 4)
				}

				const res = await uni.$rf.userInfo()
				this.balance = res.brokeragePrice
				if (res.brokeragePrice <= 0 && this.info.category === 3) {
					this.currentPay = 2
				}
			}
		},
		orderNoId (val) {
			this.orderNo = val
		}
	},
	methods: {
		close () {
			this.$emit("close", {})
		},

		// 去充值
		to_topup () {
			this.close()
			uni.navigateTo({ url: '/pages/wallet/topup' })
		},

		selection (item) {
			// if (item.disabled) return uni.$toast('暂不支持该支付方式')
			if (item.id === 4 && this.balance <= 0) return
			this.currentPay = item.id
		},
		async btnPay () {
			// 下单
			console.log('this.params?.preOrderNo', this.params?.preOrderNo)
			if (this.params?.preOrderNo) {
				const res = await uni.$api.createOrder(this.params)
				this.orderNo = res.data.orderNo
			}

			try {
				// 支付
				const result = await uni.$api.orderPay({
					orderNo: this.orderNo || this.orderNoId,
					// # ifdef H5
					payChannel: 1,
					// # endif
					// # ifdef APP-PLUS
					payChannel: 2,
					// # endif
					payType: this.currentPay
				})

				console.log('result 支付结果', result)

				if (this.currentPay === 4) {
					const balanceResult = await uni.$api.payResult({ orderNo: this.orderNo, orderType: 1 })
					if (balanceResult.data) {
						this.close()
						uni.redirectTo({
							url: `/pages/order/success?orderNo=${this.orderNo}`
						})
					}
				}

				if (this.currentPay !== 4) {
					this.close()
					const url = result.data.jsConfig.mwebUrl
					// #ifdef H5
					let ua = navigator.userAgent.toLowerCase()
					let isWebView = /micromessenger|weibo|bytedance|zhihu|qq/gi.test(ua)
					if (isWebView) {
						// 提示复制链接在浏览器打开
						uni.showModal({
							title: '提示',
							content: '请点击复制链接在浏览器打开',
							showCancel: false,
							confirmText: '复制链接',
							success: (res) => {
								if (res.confirm) {
									uni.setClipboardData({
										data: url,
										success: () => {
											uni.$toast('复制成功')
											setTimeout(() => { this.show_pop = true }, 5000);
										}
									})
								}
							}
						})
					} else {
						uni.$web(encodeURIComponent(url))
						// uni.$web('https://www.baidu.com')
						setTimeout(() => { this.show_pop = true }, 2000);
					}
					// #endif

					// #ifdef APP-PLUS
					// uni.$web(url)
					// 打开支付宝
					// plus.runtime.openURL(url)

					// 正则判断url是否包含'//qr'
					let reg = new RegExp("//qr")
					console.log('reg.test(url)', reg.test(url))
					let urls = `alipays://platformapi/startapp?saId=10000007&qrcode=${encodeURI(url)}?_s=web-other`

					if (reg.test(url)) {
						if (platform == 'android') {
							plus.runtime.openURL(urls)
						} else if (platform == 'ios') {
							plus.runtime.launchApplication({
								action: urls
							})
						}
					} else {
						console.log('url', url)
						uni.$web(encodeURIComponent(url))
						// plus.runtime.openURL(encodeURI(url))
					}

					setTimeout(() => { this.show_pop = true }, 2000);
					// #endif
				}
			} catch (error) {
				this.close()
				setTimeout(() => {
					uni.redirectTo({ url: `/pages/my/myOrder?category=${this.info.category}&index=1` })
				}, 800);
			}

			// this.close();
			// uni.redirectTo({
			// 	url: `/pages/order/success?orderNo=${this.orderNo}`
			// })
			// this.$emit("pay")
			// uni.navigateTo({
			// 	url: "/pages/order/success"
			// })
		},

		async confirm () {
			await uni.$api.payResult({ orderNo: this.orderNo, orderType: 1 })
			uni.redirectTo({
				url: `/pages/order/success?orderNo=${this.orderNo}`
			})
		},

		cancel () {
			this.show_pop = false
			uni.redirectTo({
				url: `/pages/my/myOrder?category=${this.info.category}`
			})
		}
	}
}
</script>

<style scoped>
.tui-pay-item__title {
	width: 100%;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.tui-pay-amuont {
	color: #eb0909;
	font-weight: 500;
	font-size: 34rpx;
}

.tui-pay-item {
	width: 100%;
	height: 80rpx;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.tui-pay-logo {
	width: 48rpx;
	height: 48rpx;
	margin-right: 15rpx;
}

.tui-radio {
	margin-left: auto;
	transform: scale(0.8);
	transform-origin: 100% center;
}

.tui-btn-pay {
	width: 100%;
	padding: 68rpx 60rpx calc(env(safe-area-inset-bottom) + 50rpx);
	box-sizing: border-box;
}

.tui-recharge {
	color: #fc872d;
	margin-left: auto;
	padding: 12rpx 0;
}
</style>
