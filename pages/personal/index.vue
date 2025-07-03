<template>
	<view class="container">
		<view class="pinfo" :style="{ 'padding-top': `${ptop}px` }">
			<image class="pageback-pic" src="/static/per/bg.png" />
			<view class="pinfo-top">
				<view class="pinfo-top-l">
					<image class="pinfo-top-l-pic" src="https://via.placeholder.com/72x72" />
				</view>
				<view class="pinfo-top-r">
					<text class="pinfo-top-r-t">{{getUserInfo.name}}</text>
					<text class="pinfo-top-r-t2">{{getUserInfo.phone}}</text>
				</view>
			</view>
			<view class="pinfo-center">
				<view class="pinfo-center-item">
					<text class="pinfo-center-item-t">123</text>
					<text class="pinfo-center-item-t2">余额(元)</text>
				</view>
				<view class="pinfo-center-item">
					<text class="pinfo-center-item-t">0</text>
					<text class="pinfo-center-item-t2">积分</text>
				</view>
				<view class="pinfo-center-item">
					<text class="pinfo-center-item-t">1</text>
					<text class="pinfo-center-item-t2">想要</text>
				</view>
				<view class="pinfo-center-item">
					<text class="pinfo-center-item-t">0</text>
					<text class="pinfo-center-item-t2">参拍</text>
				</view>
			</view>
		</view>

		<view class="panel">
			<view class="panel-grid">
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
					<text class="panel-grid-title-t">我的服务</text>
				</view>
				<grid-box width="25%" :list="flist" @event="onClickFnGrid" />
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	data: () => ({
		ptop: 0,
		glist: [
			{ icon: '/static/per/g-1.png', title: '待付款', value: 1 },
			{ icon: '/static/per/g-2.png', title: '提货/转拍', value: 2 },
			{ icon: '/static/per/g-3.png', title: '转拍中', value: 3 },
			{ icon: '/static/per/g-4.png', title: '待发货', value: 4 },
			{ icon: '/static/per/g-5.png', title: '待收货', value: 5 },
		],
		flist: [
			{ icon: '/static/per/f-1.png', title: '寄卖订单', value: 1 },
			{ icon: '/static/per/f-2.png', title: '挂售订单', value: 2 },
			{ icon: '/static/per/f-3.png', title: '邀请有礼', value: 3 },
			{ icon: '/static/per/f-4.png', title: '入驻商家', value: 4 },
			{ icon: '/static/per/f-5.png', title: '会员中心', value: 5 },
			{ icon: '/static/per/f-6.png', title: '联系客服', value: 7 },
			{ icon: '/static/per/f-7.png', title: '设置', value: 7 },
		]
	}),
	computed: {
    ...mapGetters(['getUserInfo']),
  },
	onLoad () {
		console.log('--', JSON.stringify(this.getUserInfo, null, 2))
		//获取胶囊位置
		// const { top = 0, height = 0 } = uni.getMenuButtonBoundingClientRect()
		// this.ptop = top + height
		// console.log('状态栏高度', uni.getSystemInfoSync().statusBarHeight)

		// h5平台固定top为44px
		this.ptop = 44
	},
	methods: {
		onClickGrid ({ value }) {
			({
				1: () => uni.$toast('待付款'),
			}[value])?.()
		},

		onClickFnGrid ({ title }) {
			({
				'邀请有礼': () => {
					// 跳转到分包invite
					uni.navigateTo({
						url: '/reward/pages/invite/index'
					})
				},
				'会员中心': () => {
					// 跳转到分包member
					uni.navigateTo({
						url: '/member/pages/center/index'
					})
				},
			}[title])?.()
		}
	}
}
</script>

<style lang="scss" scoped>
.pinfo {
	position: relative;
	padding: 0 16px 80px;
	// 渐变背景
	background: linear-gradient(180deg, rgba(255, 156, 27, 0.3) 0%, rgba(255, 156, 27, 0.5) 100%);

	.pageback-pic {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	&-top {
		display: flex;

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
				font-size: 16px;
				color: #fff;
				font-weight: 500;
			}

			&-t2 {
				font-size: 12px;
				color: #fff;
				opacity: 0.8;
			}
		}
	}

	&-center {
		display: flex;
		// justify-content: space-between;
		margin-top: 16px;

		&-item {
			flex-shrink: 0;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-t {
				font-size: 18px;
				color: #fff;
				font-weight: 500;
				margin-bottom: 2px;
			}

			&-t2 {
				font-size: 12px;
				color: #fff;
				opacity: 0.8;
			}
		}
	}
}

.panel {
	margin: 0 16px 16px;
	transform: translateY(-60px);

	&-grid {
		padding: 16px 16px 0;
		background-color: #fff;
		border-radius: 10px;

		&-title {
			display: flex;
			justify-content: space-between;
			align-items: center;

			&-t {
				font-size: 15px;
				color: #333;
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