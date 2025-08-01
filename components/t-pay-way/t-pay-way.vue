<template>
	<view>
		<tui-bottom-popup :show="show" @close="close">
			<tui-list-cell :hover="false">
				<view class="tui-pay-item__title">
					<view>请选择支付方式</view>
					<view>支付金额：<text class="tui-pay-amuont" v-if="payPrice">￥{{ payPrice / 100 }}</text></view>
				</view>
			</tui-list-cell>

			<radio-group>
				<tui-list-cell v-for="item in filteringPayList" :key="item.id" unlined @click="selectPay(item)">
					<label class="tui-pay-item">
						<text>{{ item.name }}
							<template v-if="item.id === 4">
								（可用余额：{{ getUserInfo.balance / 100 }}）
							</template>
							<template v-if="item.id === 3">
								（剩余次数：{{ getUserInfo.checkChatNum }}）
							</template>
						</text>

						<!-- 特殊按钮或提示 -->
						<view class="tui-recharge" v-if="item.requireBalance && item.disabled" @tap.stop="to_topup">去充值</view>
						<view class="tui-recharge" v-if="item.requireVip && item.disabled" @tap.stop="to_topup">升级会员</view>

						<view class="tui-radio" v-if="!item.disabled">
							<radio color="#EB0909" name="pay" :disabled="item.disable" :checked="currentPay === item.id" />
						</view>
					</label>
				</tui-list-cell>
			</radio-group>

			<view class="tui-btn-pay">
				<tui-button height="40px" type="danger" shape="circle" :shadow="false" @click="btnPay">{{ payTxt }}</tui-button>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
	name: 'tPayWay',
	emits: ['close'],
	props: {
		payPrice: Number,
		onlyBalance: { type: Boolean, default: false },
		show: Boolean,
		neededs: { type: String, default: '1,2,4,3' },
		payTxt: { type: String, default: '立即支付' }
	},
	data: () => ({
		currentPay: null,
		payMethods: uni.$gc.payMethods

	}),

	// 监听show变化刷新userInfo
	watch: {
		async show (val) {
			await userInfo() // 刷新用户信息
			if (val) {
				this.currentPay = null
				this.$nextTick(() => {
					this.currentPay = this.filteringPayList[0]?.id || null
				})
			}
		}
	},

	computed: {
		...mapGetters(['getUserInfo']),
		parsedNeededs () {
			const str = String(this.neededs || '')
			return str
				.split(',')
				.map(i => Number(i.trim()))
				.filter(i => !isNaN(i))
		},

		filteringPayList () {
			return this.parsedNeededs.map(id => {
				const base = this.payMethods[id]
				if (!base) return null

				const clone = { ...base }

				// 判断余额是否足够
				if (clone.requireBalance) {
					clone.disabled = this.getUserInfo.balance < this.payPrice
				}
				// 判断是否为会员
				if (clone.requireVip) {
					clone.disabled = !this.getUserInfo.isVip
					// 如果是会员但是getUserInfo.checkChatNum小于等于0，则禁用
					clone.disable = this.getUserInfo.checkChatNum <= 0
				}

				return clone
			}).filter(Boolean) // 去除不存在的 id
		}
	},

	methods: {
		close () {
			this.$emit("close", {})
		},
		to_topup () {
			this.close()
			uni.navigateTo({ url: '/pages/wallet/index' })
		},
		selectPay (item) {
			if(!item || item.disable) return
			if (!item.disabled) this.currentPay = item.id
		},
		btnPay () {
			const method = this.payMethods[this.currentPay]
			if (!method) return uni.$toast('请选择支付方式')
			this.$emit("pay", { payType: method.value, amount: this.payPrice })
			userInfo()
		},
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

.desc {
	color: #999;
	font-size: 24rpx;
	text-align: center;
	height: 44px;
	padding: 8px 0 calc(env(safe-area-inset-bottom) + 8px);
}
</style>
