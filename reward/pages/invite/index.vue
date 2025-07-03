<template>
	<view class="container">
		<view class="nav" :style="{ 'padding-top': `${ptop}px` }">
			<view class="nav-l" :style="{ height: `${pheight}px`, width: `${pheight}px` }" @tap="onBack">
				<u-icon name="arrow-left" bold color="#fff" size="22"></u-icon>
			</view>
			<view class="nav-c">
				<text class="nav-c-t" style="color:#fff">邀请有礼</text>
			</view>
			<view class="nav-l" :style="{ height: `${width}px`, width: `${pheight}px` }"></view>
		</view>

		<view class="warp" :style="{ 'padding-top': `${ptop + pheight + 180}px` }">
			<image class="pageback-pic" src="/reward/static/bg.png" />

			<view class="warp-item">
				<view class="warp-item-l">
					<image class="warp-item-l-icon" src="/reward/static/i-1.png" />
				</view>
				<view class="warp-item-r">
					<text class="warp-item-r-t">一重礼:拍客奖励</text>
					<text class="warp-item-r-t2">好友开通拍客，最高可得40%奖励</text>
				</view>
			</view>
			<view class="warp-item">
				<view class="warp-item-l">
					<image class="warp-item-l-icon" src="/reward/static/i-2.png" />
				</view>
				<view class="warp-item-r">
					<text class="warp-item-r-t">二重礼:订单佣金</text>
					<text class="warp-item-r-t2">好友每完成一笔订单，最高可获佣金的10%</text>
				</view>
			</view>
		</view>

		<view class="panel">
			<view class="panel-grid">
				<view class="panel-grid-item">
					<view class="panel-grid-item-icon">
						<u-icon name="photo" color="#333" size="28" />
					</view>
					<text class="panel-grid-item-t">海报邀请</text>
				</view>
				<view class="panel-grid-item" @tap="shareWX">
					<view class="panel-grid-item-icon">
						<u-icon name="weixin-fill" color="#555" size="28" />
					</view>
					<text class="panel-grid-item-t">微信邀请</text>
					<button open-type="share" class="sharebtn" />
				</view>
			</view>
			<view class="panel-code">
				<text class="panel-code-t">邀请码: 123456</text>
				<text class="panel-code-t">复制</text>
			</view>
		</view>

		<view class="plist">
			<view class="plist-title">
				<text class="plist-title-t">我的邀请</text>
				<text class="plist-title-t">18</text>
			</view>

			<view class="plist-list">
				<view class="plist-list-item" v-for="(item, index) in 10" :key="index">
					<view class="plist-list-item-l">
						<image class="plist-list-item-l-icon" src="/reward/static/i-1.png" />
					</view>
					<view class="plist-list-item-r">
						<text class="plist-list-item-r-t">张三</text>
						<text class="plist-list-item-r-t2">2021-01-01 18:59:0{{ index }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="btn">
			<view class="btn-item" @tap="onInvite">
				<text class="btn-item-t">立即邀请</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data: () => ({
		ptop: 0,
		pheight: 0
	}),
	onLoad () {
		//获取胶囊位置
		const { top = 0, height = 0 } = uni.getMenuButtonBoundingClientRect()
		this.ptop = top
		this.pheight = height
	},
	methods: {
		onBack () {
			// uni.navigateBack({ delta: 1 })
			const pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},

		/* 分享到微信好友列表 */
		shareWX () { },

		/* 立即邀请 */
		onInvite () {
			// 确认框
			uni.showModal({
				title: '开通拍客',
				content: '开通拍客后，邀请才能获得奖励，否则将无法获得奖励',
				confirmText: '立即开通',
				// 确认按钮的文字颜色
				confirmColor: '#ff7300',
				cancelText: '直接邀请',
				// 取消按钮的文字颜色
				cancelColor: '#bbb',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/member/pages/center/index'
						})
						return
					}
					if (res.cancel) {
						uni.showToast({
							title: '邀请好友开通拍客，获得奖励',
							icon: 'none'
						})
					}
				}
			})
		}
	},

	onShareAppMessage () {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: '邀请有礼',	// 分享标题
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding-bottom: calc(44px + env(safe-area-inset-bottom) + 10px);
}

.nav {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 999;
	display: flex;
	justify-content: space-between;
	align-items: baseline;

	&-l {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	&-c {
		flex: 1;
		flex-shrink: 0;
		text-align: center;
	}
}

.warp {
	position: relative;
	padding: 0 16px 40px;

	.pageback-pic {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	&-item {
		display: flex;
		background-color: #fff;
		border-radius: 10px;
		margin-bottom: 16px;
		padding: 16px;

		&-l {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			margin-right: 10px;

			&-icon {
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
				font-weight: 500;
				color: #333;
				margin-bottom: 2px;
			}

			&-t2 {
				font-size: 12px;
				font-weight: 400;
				color: #999;
				opacity: 0.8;
			}
		}
	}
}

.panel {
	transform: translateY(-20px);
	background-color: #fff;
	margin: 0 16px;
	border-radius: 10px;
	padding: 16px;

	&-grid {
		display: flex;
		justify-content: space-around;

		&-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			position: relative;

			&-icon {
				width: 48px;
				height: 48px;
				background-color: #f8f7f7;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 4px;
			}

			&-t {
				font-size: 12px;
				color: #999;
				opacity: 0.8;
			}
		}
	}

	&-code {
		display: flex;
		justify-content: space-between;
		margin: 16px 16px 0;
		border-top: 1px solid #fafafa;
		padding-top: 16px;

		&-t {
			font-size: 13px;
			color: #999;
			opacity: 0.8;
		}
	}
}

.sharebtn {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	// background-color: rgba(0, 0, 0, 0);
	opacity: 0;
}

.plist {
	margin: 0 16px;

	&-title {
		display: flex;
		margin-bottom: 16px;

		&-t {
			font-size: 16px;
			font-weight: 500;
			color: #333;
		}
	}

	&-list {
		&-item {
			display: flex;
			margin-bottom: 10px;
			padding: 10px 0;

			&-l {
				flex-shrink: 0;
				width: 40px;
				height: 40px;
				margin-right: 10px;

				&-icon {
					width: 100%;
					height: 100%;
				}
			}

			&-r {
				display: flex;
				flex-direction: column;
				justify-content: center;

				&-t {
					font-size: 14px;
					font-weight: 500;
					color: #333;
					margin-bottom: 2px;
				}

				&-t2 {
					font-size: 12px;
					font-weight: 400;
					color: #999;
					opacity: 0.8;
				}
			}
		}
	}
}

.btn {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 99;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px 0 env(safe-area-inset-bottom);
	background-color: #fff;

	&-item {
		background-color: #333;
		border-radius: 5px;
		margin: 0 16px;
		width: calc(100% - 32px);
		height: 44px;
		display: flex;
		justify-content: center;
		align-items: center;

		&-t {
			font-size: 16px;
			font-weight: 500;
			color: #fff;
		}
	}
}
</style>