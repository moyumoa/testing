<template>
	<view class="container">
		<view class="navbar">
			<view class="navbar-left" @tap="myStatus = myStatus === 1 ? 2 : 1">
				<text class="navbar-left-t" :class="{ 'navbar-left-t-active': myStatus === 1 }">接单</text>
				<text class="navbar-left-t" :class="{ 'navbar-left-t-active': myStatus === 2 }">休息</text>
			</view>
			<view class="navbar-right">
				<view @tap.stop="navtap('kefu')">
					<u-icon name="server-man" color="#fff" size="21" />
				</view>
				<view @tap.stop="navtap('setting')">
					<u-icon name="setting" color="#fff" size="20" />
				</view>
			</view>
		</view>
		<view class="pinfo" :style="{ 'padding-top': `${66}px` }">
			<!-- <image class="pageback-pic" src="/static/per/bg.png" /> -->
			<image class="pageback-pic" :src="getUserInfo.avatar" />
			<view class="pinfo-top">
				<view class="pinfo-top-l">
					<image class="pinfo-top-l-pic" :src="getUserInfo.avatar" />
				</view>
				<view class="pinfo-top-r">
					<text class="pinfo-top-r-t">{{ getUserInfo.nickName }}</text>
					<view class="pinfo-top-r-t2">
						<u-icon :label="getUserInfo.isVip ? '会员' : '普通用户'" size="16" labelColor="#eee" labelSize="12"
							name="/static/per/hy-icon.png" />
					</view>
				</view>
			</view>
			<view class="pinfo-top">
				<text class="pinfo-top-text">个人介绍: 个人介绍个人介绍个人介绍个人介绍</text>
			</view>
		</view>

		<view class="panel">

			<view class="pinfo-center">
				<view class="pinfo-center-item">
					<text class="pinfo-center-item-t">123</text>
					<text class="pinfo-center-item-t2">关注</text>
				</view>
				<view class="pinfo-center-item">
					<text class="pinfo-center-item-t">0</text>
					<text class="pinfo-center-item-t2">粉丝</text>
				</view>
				<view class="pinfo-center-item">
					<text class="pinfo-center-item-t">1</text>
					<text class="pinfo-center-item-t2">谁看过我</text>
				</view>
			</view>

			<view class="panel-hybox">
				<image class="panel-hybox-pic" src="/static/per/hy-bg.png" />
				<view class="panel-hybox-content">
					<text class="panel-hybox-content-t">会员中心</text>
					<text class="panel-hybox-content-t2">{{getUserInfo.isVip ? '尊敬的会员用户, 您好!' : '开通会员，享受更多特权'}}</text>
					<view class="panel-hybox-content-btn" @tap="onClickFnGrid({ title: '会员中心' })">
						{{getUserInfo.isVip ? '查看会员' : '立即开通'}}
					</view>
				</view>
			</view>

			<view class="panel-grid" v-if="false">
				<view class="panel-grid-title">
					<text class="panel-grid-title-t">我的订单</text>
					<view class="panel-grid-title-r">
						<text class="panel-grid-title-r-t">全部订单</text>
						<u-icon name="arrow-right" color="#666" size="12"></u-icon>
					</view>
				</view>
				<grid-box :list="glist" @event="onClickGrid" />
			</view>
		</view>

		<view class="panel">
			<view class="panel-grid">
				<view class="panel-grid-title">
					<text class="panel-grid-title-t">常用功能</text>
				</view>
				<grid-box width="25%" :list="grid1" @event="onClickFnGrid" />
			</view>
			<view class="panel-grid">
				<view class="panel-grid-title">
					<text class="panel-grid-title-t">更多功能</text>
				</view>
				<grid-box width="25%" :list="grid2" @event="onClickFnGrid" />
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';

export default {
	data: () => ({
		myStatus: 1, // 接单状态 1-接单 2-休息
		grid1: [
			{ icon: '/static/per/c-1.png', title: '我的钱包', value: 1 },
			{ icon: '/static/per/c-2.png', title: '我的发布', value: 2 },
			{ icon: '/static/per/c-3.png', title: '我的收藏', value: 3 },
			{ icon: '/static/per/c-4.png', title: '我的订单', value: 4 },
		],
		grid2: [
			{ icon: '/static/per/g-1.png', title: '个人认证', value: 1 },
			{ icon: '/static/per/g-2.png', title: '商户入驻', value: 2 },
			{ icon: '/static/per/g-3.png', title: '我的推广', value: 3 },
			{ icon: '/static/per/g-4.png', title: '我的联系方式', value: 4 },
		],
	}),
	computed: {
		...mapGetters(['getUserInfo']),
	},
	async onLoad () {
		try {
			const user = await userInfo();
			console.log('用户信息已更新：', user);
		} catch (e) {
			console.warn('使用缓存用户信息', e);
		}
		console.log('--', JSON.stringify(this.getUserInfo, null, 2))
	},
	methods: {

		navtap (type) {
			({
				kefu: () => {
					// 跳转到客服页面
					uni.navigateTo({
						url: '/pages/kefu/index'
					})
				},
				setting: () => {
					// 跳转到设置页面
					uni.navigateTo({
						url: '/pages/setting/index'
					})
				},
			}[type])?.()
		},

		onClickGrid ({ value }) {
			({
				1: () => uni.$toast('待付款'),
			}[value])?.()
		},

		onClickFnGrid ({ title }) {
			({
				'会员中心': () => {
					uni.navigateTo({
						url: '/pages/member/center'

					})
				},
				'我的钱包': () => {
					uni.navigateTo({
						url: '/pages/wallet/index'

					})
				},
				'个人认证': () => {
					uni.navigateTo({
						url: '/pages/certification/individual'

					})
				},
				'商户入驻': () => {
					uni.navigateTo({
						url: '/pages/certification/business'

					})
				},
				'我的推广': () => {
					uni.navigateTo({
						// url: '/reward/pages/invite/index'
						url: '/pages/personal/invite'

					})
				},
				// '会员中心': () => {
				// 	// 跳转到分包member
				// 	uni.navigateTo({
				// 		url: '/member/pages/center/index'
				// 	})
				// },
			}[title])?.()
		}
	}
}
</script>

<style lang="scss" scoped>
.navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 999;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 16px;
	height: 44px;
	color: #fff; // 设置文字颜色

	.navbar-left {
		height: 20px;
		line-height: 20px;
		display: flex;
		align-items: center;
		background-color: #CFD0D9;
		border-radius: 20px;
		overflow: hidden;

		&-t {
			width: 40px;
			text-align: center;
			font-size: 12px;
			color: #808080;
			transition: background-color 0.25s, color 0.25s;

			&-active {
				background-color: #60B95D;
				color: #fff;
			}
		}
	}

	.navbar-right {
		width: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}

.pinfo {
	position: relative;
	padding: 0 16px 24px;
	// background: linear-gradient(180deg, rgba(255, 156, 27, 0.3) 0%, rgba(255, 156, 27, 0.5) 100%);
	// background: linear-gradient(180deg, rgba(123, 161, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);


	.pageback-pic {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.1); // 添加一个半透明的白色遮罩
		}
	}

	&-top {
		position: relative;
		display: flex;
		z-index: 3;

		&-text {
			padding: 12px 0;
			font-size: 13px;
			color: #fff;
		}

		&-l {
			width: 64px;
			height: 64px;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 10px;
			border: 1px solid #fff;
			box-sizing: border-box;

			&-pic {
				width: 100%;
				height: 100%;
			}
		}

		&-r {
			display: flex;
			flex-direction: column;
			justify-content: center;

			&-t {
				font-size: 15px;
				color: #fff;
				font-weight: 500;
			}

			&-t2 {
				font-size: 12px;
				color: #fff;
				// opacity: 0.8;
			}
		}
	}

	&-center {
		display: flex;
		// justify-content: space-between;
		// margin-top: 16px;

		padding: 16px 0;

		&-item {
			flex-shrink: 0;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-t {
				font-size: 18px;
				color: #555;
				font-weight: 500;
				margin-bottom: 2px;
			}

			&-t2 {
				font-size: 12px;
				color: #555;
				opacity: 0.5;
			}
		}
	}
}

.panel {
	// margin: 0 16px 16px;
	transform: translateY(-10px);
	border-radius: 16px 16px 0 0;
	background-color: #fafbfe;

	&-hybox {
		height: 62px;
		margin: 0 16px;
		position: relative;

		&-pic {
			width: 100%;
			height: 100%;
		}

		&-content{
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 2;

			&-t {
				position: absolute;
				left: 12px;
				top: 8px;
				font-size: 16px;
				color: #7F5321;
				font-weight: 500;
			}

			&-t2 {
				position: absolute;
				left: 36px;
				bottom: 8px;
				font-size: 12px;
				color: #BB945F;
			}

			&-btn {
				position: absolute;
				top: 50%;
				right: 8px;
				transform: translateY(-50%);
				width: 82px;
				height: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #BB945F;
				border: 1px solid #BB945F;
				border-radius: 32px;
				font-size: 14px;
			}
		}
	}

	&-grid {
		padding: 16px 16px 0;
		// background-color: #fff;
		border-radius: 10px;

		::v-deep .grid-box-item-top {
			width: 48px;
			height: 48px;
		}

		::v-deep .grid-box-item-top-icon {
			width: 48px;
			height: 48px;
		}

		&-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24px;

			&-t {
				font-size: 14px;
				color: #333;
				opacity: 0.4;
				font-weight: 500;
			}

			&-r {
				display: flex;
				align-items: baseline;

				&-t {
					font-size: 12px;
					color: #666;
					margin-right: 4px;
				}
			}
		}
	}
}
</style>