<template>
	<view class="container">
		<view class="navbar">
			<view class="navbar-left" @tap="checkOrder"
				v-if="getUserInfo.isCertification && getUserInfo.isCertification === 1 && getUserInfo.certificationType !== 2">
				<text class="navbar-left-t" :class="{ 'navbar-left-t-active': getUserInfo.isOrder === 1 }">接单</text>
				<text class="navbar-left-t" :class="{ 'navbar-left-t-active': getUserInfo.isOrder === 2 }">休息</text>
			</view>
			<view class="navbar-left" v-else />

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
			<image class="pageback-pic" :src="getFirstImages(getUserInfo.images) || getUserInfo.avatar" mode="aspectFill" />
			<view class="pinfo-top" @tap="onClickFnGrid({ title: '个人资料' })">
				<view class="pinfo-top-l">
					<image class="pinfo-top-l-pic" :src="getUserInfo.avatar" />
				</view>
				<view class="pinfo-top-r">
					<text class="pinfo-top-r-t">{{ getUserInfo.nickName }}</text>
					<view class="pinfo-top-r-t2">
						<u-icon :label="getUserInfo.isVip ? '高级会员' : '普通用户'" size="16" labelColor="#eee" labelSize="12"
							name="/static/per/hy-icon.png" />
					</view>
				</view>
				<view class="pinfo-top-positionrt" @tap="onClickFnGrid({ title: '店铺主页' })"
					v-if="getUserInfo.certificationType === 2">
					店铺主页
				</view>
			</view>
			<view class="pinfo-top" @tap="onClickFnGrid({ title: '个人资料' })">
				<text class="pinfo-top-text">个人介绍: {{ getUserInfo.remark || '无' }}</text>
			</view>
		</view>

		<view class="panel">

			<view class="pinfo-center">
				<view class="pinfo-center-item" @tap="onClickFnGrid({ title: '关注' })">
					<text class="pinfo-center-item-t">
						{{ formatNum(getUserInfo.attentionCount) }}
					</text>
					<text class="pinfo-center-item-t2">关注</text>
				</view>
				<view class="pinfo-center-item" @tap="onClickFnGrid({ title: '粉丝' })">
					<text class="pinfo-center-item-t">
						{{ formatNum(getUserInfo.fansCount) }}
					</text>
					<text class="pinfo-center-item-t2">粉丝</text>
				</view>
				<view class="pinfo-center-item" v-if="this.getUserInfo.certificationType === 2">
					<text class="pinfo-center-item-t pinfo-center-item-little">{{ certificationExpiration }}</text>
					<text class="pinfo-center-item-t2">认证到期</text>
				</view>
			</view>

			<view class="panel-hybox" :class="{ 'panel-hybox-active': getUserInfo.isVip }">
				<image class="panel-hybox-pic" src="/static/per/hy-bg.png" />
				<view class="panel-hybox-content">
					<text class="panel-hybox-content-t">会员中心</text>
					<view class="panel-hybox-content-row" v-if="getUserInfo.isVip">
						<text class="panel-hybox-content-row-t">
							今日剩余免费解锁: {{ getUserInfo.checkChatNum }} 次
						</text>
						<text class="panel-hybox-content-row-t">
							剩余意向单发布: 0 次
						</text>
					</view>
					<text class="panel-hybox-content-t2" v-else>开通会员，享受更多特权</text>
					<view class="panel-hybox-content-btn" v-if="!getUserInfo.isVip" @tap="onClickFnGrid({ title: '会员中心' })">
						立即开通
					</view>
					<view class="panel-hybox-content-btn2" v-if="getUserInfo.isVip" @tap="onClickFnGrid({ title: '会员中心' })">
						查看会员
					</view>
				</view>
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
import { formatNum } from '@mvmoo/us'

export default {
	data: () => ({
		myStatus: 1, // 接单状态 1-接单 2-休息
		grid1: [
			{ icon: '/static/per/c-1.png', title: '我的钱包', value: 1 },
			{ icon: '/static/per/c-2.png', title: '我的发布', value: 2 },
			{ icon: '/static/per/c-3.png', title: '我的收藏', value: 3 },
			{ icon: '/static/per/c-4.png', title: '我的订单', value: 4 },
		],
		// grid2: [
		// 	{ icon: '/static/per/g-1.png', title: '个人认证', value: 1 },
		// 	{ icon: '/static/per/g-2.png', title: '商户入驻', value: 2 },
		// 	{ icon: '/static/per/g-3.png', title: '我的推广', value: 3 },
		// 	{ icon: '/static/per/g-4.png', title: '我的联系方式', value: 4 }
		// ],
	}),
	computed: {
		...mapGetters(['getUserInfo']),
		grid2 () {
			const type = this.getUserInfo?.certificationType;
			const all = [
				{ icon: '/static/per/g-1.png', title: '个人认证', value: 1 },
				{ icon: '/static/per/g-2.png', title: '商户入驻', value: 2 },
				{ icon: '/static/per/g-3.png', title: '我的推广', value: 3 },
				{ icon: '/static/per/g-4.png', title: '我的联系方式', value: 4 }
			];
			if (type === 1) return [{ ...all[0], title: '我的认证' }, all[2], all[3]];
			if (type === 2) return [{ ...all[1], title: '我的入驻' }, all[2], all[3]];
			// 没有认证信息时，显示全部
			return all;
		},
		certificationExpiration () {
			// this.getUserInfo.expireTime大于10天显示直接显示年月日 小于十天则显示天数
			const expireTime = this.getUserInfo?.expireTime;
			if (!expireTime) return '未认证';
			const expirationDate = new Date(expireTime);
			const now = new Date();
			const diffTime = expirationDate - now;
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			if (diffDays > 10) {
				return `${expirationDate.getFullYear()}/${expirationDate.getMonth() + 1}/${expirationDate.getDate()}`;
			} else {
				return `${diffDays}天后到期`;
			}
		}

	},
	async onShow () {
		await userInfo();
	},
	async onLoad () {
		console.log('--', JSON.stringify(this.getUserInfo, null, 2))
	},
	methods: {
		formatNum (val) { return formatNum(val) }, // 格式化数字
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
		async checkOrder () {
			// 切换接单状态
			const status = this.getUserInfo.isOrder === 1 ? 2 : 1;
			await uni.$api.updateOrderStatus({ isOrder: status });
			// 更新用户信息
			await userInfo();
			// 显示提示
			uni.showToast({
				title: status === 1 ? '已开启接单' : '已切换为休息状态',
				icon: 'none'
			});
		},

		getFirstImages (images) {
			// 把images转换为数组
			if (!images || typeof images !== 'string') return '';
			const imageArray = images.split(',');
			// 返回第一个图片地址
			return imageArray.length > 0 ? imageArray[0] : '';
		},


		onClickFnGrid ({ title }) {
			const type = this.getUserInfo?.certificationType;

			// 做动态映射：将“我的认证” → “个人认证”，“我的入驻” → “商户入驻”
			if (type === 1 && title === '我的认证') {
				title = '个人认证';
			} else if (type === 2 && title === '我的入驻') {
				title = '商户入驻';
			}

			const actions = {
				'个人资料': () => {
					// 可加埋点或权限判断
					// uni.navigateTo({ url: '/pages/personal/detail' });
					if (!this.getUserInfo?.certificationType || this.getUserInfo?.certificationType === 2) return false
					uni.navigateTo({ url: `/pages/personal/detail?userId=${this.getUserInfo.id}` })
				},
				'关注': () => {
					uni.navigateTo({ url: '/pages/personal/follow?type=1' });
				},
				'粉丝': () => {
					uni.navigateTo({ url: '/pages/personal/follow?type=2' });
				},
				'会员中心': () => {
					uni.navigateTo({ url: '/pages/member/center' });
				},
				'我的钱包': () => {
					uni.navigateTo({ url: '/pages/wallet/index' });
				},
				'我的发布': () => {
					uni.navigateTo({ url: '/pages/personal/release/list?source=self' });
				},
				'我的收藏': () => {
					uni.navigateTo({ url: '/pages/personal/collect' });
				},
				'我的订单': () => {
					uni.navigateTo({ url: '/pages/order/list' });
				},
				'个人认证': () => {
					uni.navigateTo({ url: '/pages/certification/individual' });
				},
				'商户入驻': () => {
					uni.navigateTo({ url: '/pages/certification/business' });
				},
				'店铺主页': () => {
					uni.navigateTo({ url: '/pages/merchant/index' });
				},
				'我的推广': () => {
					uni.navigateTo({ url: '/pages/personal/invite' });
				},
				'我的联系方式': () => {
					uni.navigateTo({ url: '/pages/personal/contactInformation' });
				}
			};

			actions[title]?.(); // 执行相应函数
		}

	}
}
</script>

<style lang="scss" scoped>
.navbar {
	position: fixed;
	top: 0;
	left: var(--window-left);
	right: var(--window-right);
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
				margin-top: 8px;
			}
		}

		&-positionrt {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 0;
			background-color: #efeeee;
			padding: 5px 12px;
			border-radius: 16px;
			color: #0991da;
			font-size: 12px;
			display: flex;
			justify-content: center;
			align-items: center;

			&-t {
				font-size: 12px;
				color: #ececec;
			}
		}
	}

	&-center {
		display: flex;
		height: 76px;
		align-items: center;
		// justify-content: space-between;
		// margin-top: 16px;


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

			&-little {
				font-size: 15px;
				color: #555;
				font-weight: 500;
				margin: 3.3px 0;
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

		&-content {
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

			&-row {
				position: absolute;
				left: 12px;
				right: 12px;
				top: 36px;
				display: flex;
				justify-content: space-between;
				// flex-direction: column;
				opacity: 0.8;

				&-t {
					font-size: 12px;
					color: #7F5321;
					margin-bottom: 4px;
				}
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

			&-btn2 {
				position: absolute;
				top: 2px;
				right: 0px;
				width: 76px;
				height: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #BB945F;
				font-size: 13px;
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