<template>
	<view class="container">

		<view class="warps">
			<view class="header"
				:style="{ 'padding-top': `${statusBar + 8}px`, 'background-color': `rgba(246, 236, 236, ${opacity})` }">
				<view class="header-l">
					<text class="header-l-t" :class="{ 'header-l-t-active': item.index === currentPage }"
						@tap.stop="change_page(item)" v-for="item in pageTab" :key="item.index">{{ item.name }}</text>
				</view>
				<view class="header-r" @tap.stop="search">
					<tui-icon name="category" :size="24" color="#72A5FD" unit="px"></tui-icon>

				</view>
			</view>

			<view class="warps-place" :style="{ 'padding-top': `${statusBar + 60}px` }"></view>
		</view>

		<ipage-one v-if="paginated && !paginated.loading && currentPage === 1" :location="location"
			:rows="paginated.data" />

		<ipage-two v-if="paginated && !paginated.loading && currentPage === 2" :location="location"
			:rows="paginated.data" />

		<!-- <ipage-three ref="list3" /> -->

		<tui-loadmore v-if="paginated && paginated.loading" :index="3" type="red"></tui-loadmore>
		<tui-nomore v-if="paginated && !paginated.loading && finished" backgroundColor="#f8f8f8"></tui-nomore>

	</view>
</template>
<script>
import { getLocationAndAddress } from '@/utils/getLocation';
import { formatNum } from '@mvmoo/us'
import { createPaginated } from '@mvmoo/optionsapi'

export default {
	data () {
		return {
			statusBar: uni.getSystemInfoSync().statusBarHeight,
			opacity: 0,

			pageTab: [{ index: 1, name: '认证专区' }, { index: 2, name: '赔付专区' }, { index: 3, name: '瓢虫贴' }],
			currentPage: 0, // 当前页面

			location: {},
			paginated: null, // 分页数据
			finished: false, // 是否加载完毕

			condition: {
				keyword: '',
				cid: '',
				page: 1,
				limit: 10,
			},
			hotSearch: [],
			banner: [],
			category: [],
			couponList: [],
			newProduct: [],
			productList: [],
			loadding: false,
		};
	},

	watch: {
		async currentPage (newVal) {
			const { lng, lat } = this.location
			await ({
				1: () => this.paginated = createPaginated(uni.$api.authList, { certificationType: 1, lng: lng || 0, lat: lat || 0, }, {
					...uni.$paging,
					extraList: res => res.data,
					transformData: (rows, res, query) => rows?.map(item => ({
						...item,
						bg: item.images.split(',')[0] || item.images || '', // 背景图
						ageGroup: this.ageGroup(item.birthday), // 年龄段
						onlineTime: this.onlineTime(item.seconds), // 在线时间
						distance: item.distance ? formatNum(item.distance) : '未知', // 距离
						authStatusTxt: { 0: '未认证', 1: '认证中', 2: '已认证', 3: '认证失败' }[item.authStatus] || '未知状态',
						isShowbtn: item.authStatus === 3, // 是否显示修改按钮
					})) || []
				}, 'concat'),
				2: () => this.paginated = createPaginated(uni.$api.compensationList, { certificationType: 2, lng: lng || 0, lat: lat || 0, }, {
					...uni.$paging,
					extraList: res => res.data,
					transformData: (rows, res, query) => rows?.map(item => ({
						...item,
						bg: item.images.split(',')[0] || item.images || '', // 背景图
						ageGroup: this.ageGroup(item.birthday), // 年龄段
						onlineTime: this.onlineTime(item.seconds), // 在线时间
						distance: item.distance ? formatNum(item.distance) : '未知', // 距离
						authStatusTxt: { 0: '未认证', 1: '认证中', 2: '已认证', 3: '认证失败' }[item.authStatus] || '未知状态',
						isShowbtn: item.authStatus === 3, // 是否显示修改按钮
					})) || []
				}, 'concat'),
			}[newVal]?.())
			await this.paginated.reload({}, 1)
		}
	},
	methods: {
		/* 切换页面 */
		async change_page (row) {
			// this.currentPage = this.currentPage === 1 ? 2 : 1;
			if (this.currentPage === row.index) return
			this.currentPage = row.index
			// await this.getCategory()
			// this.$refs[`list${this.currentPage}`].scrollTo()
		},

		/* 根据传入的出生日计算年龄段 例如:85后 90后 00后 10后 */
		ageGroup (birthday) {
			const year = new Date(birthday).getFullYear();
			if (isNaN(year)) return '未知';
			const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
			return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
		},

		/* 根据秒数计算在线时间分钟/小时/天数 */
		onlineTime (Second) {
			if (Second < 60) return `${Second}秒`;
			if (Second < 3600) return `${Math.floor(Second / 60)}分钟`;
			if (Second < 86400) return `${Math.floor(Second / 3600)}小时`;
			return `${Math.floor(Second / 86400)}天`;
		},
	},
	async onLoad () {
		// this.getBanner()
		// this.getCategory()
		// this.getExchangeList()
		// uni.navigateTo({ url: `/pages/index/startPage` })
		// this.change_page({ index: 1, name: '认证专区' })
		const { lng, lat } = await getLocationAndAddress()
		console.log('lng lat', lng, lat)
		this.location = { lng, lat }
		this.currentPage = 1
		// this.$nextTick(async () => {
		// 	console.log('refs after mount:', this.$refs)
		// 	await this.$refs['list1']?.init()
		// 	// await this.$refs['list2']?.init()
		// })

	},
	onShow () {
		// #ifdef APP-PLUS
		//  plus.navigator.setFullscreen(true);//隐藏手机顶部状态栏
		// #endif
	},
	// 滚动时改变导航栏透明度
	onPageScroll (e) {
		const { scrollTop } = e
		const opacity = scrollTop / 100
		this.opacity = opacity >= 1 ? 1 : opacity
		this.$refs[`list${this.currentPage}`].scrollBarPosition = e.scrollTop
	},
	async onPullDownRefresh () {
		// this.finished = false
		// this.condition.page = 1
		// await this.getProductList(list => this.productList = list)
		// this.loadding = false
		await this.$refs[`list${this.currentPage}`].init()
		uni.stopPullDownRefresh()
	},
	async onReachBottom () {
		// if (this.finished) return
		// this.condition.page++
		// await this.getProductList()

		// console.log(this.$refs[`list${this.currentPage}`].reachBottom())
		// this.$refs[`list${this.currentPage}`].reachBottom()

		const { page, limit, total, count } = this.paginated.pagination
		if (count < limit) return
		this.paginated.onChangePage(page + 1, limit)
	},

};
</script>

<style lang="scss" scoped>
page {
	background-color: #f9f9f9;
}

$ec: #72A5FD;

.container {
	// padding-bottom: calc(50px + env(safe-area-inset-bottom));
	color: #333;
}

.warps {
	background: linear-gradient(180deg, rgba(116, 154, 248, 0.15) 0%, rgba(255, 255, 255, 0.16) 100%);
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 12px 8px;
	position: fixed;
	top: 0;
	left: var(--window-left);
	right: var(--window-right);
	z-index: 66;

	&-l {
		flex: 1;
		width: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 40px;
		background-color: #e1ecff;
		overflow: hidden;
		padding: 0 4px;
		height: 40px;

		&-t {
			font-size: 16px;
			color: $tc;
			opacity: 0.7;
			border-radius: 40px;
			padding: 4px 12px;
			transition: all 0.3s;

			&-active {
				color: $ec;
				font-weight: bold;
				background-color: #fff;
				opacity: 1;
			}
		}
	}

	&-r {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 12px;
		box-sizing: border-box;

		&-t {
			flex: 1;
			font-size: 14px;
			color: #999;
		}
	}
}

.pageBody {
	position: relative;
	transform-style: preserve-3d;

	.cover,
	.back {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		backface-visibility: hidden;
		transition: transform .5s ease-in-out;
	}

	.cover {
		// display: flex;
		// flex-direction: column;
		// justify-content: center;
		transform: rotateY(0deg);

		&-active {
			transform: rotateY(180deg);
		}
	}

	.back {
		transform: rotateY(-180deg);

		&-active {
			transform: rotateY(0deg);
		}
	}
}

.grids {
	margin: 12px;
	padding: 0 12px 15px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	font-size: 12px;
	color: #555;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 8px;
	// box-shadow: 0 0 4px rgba(0, 0, 0, 0.01);

	&-item {
		width: 20%;
		height: 118rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		padding-top: 30rpx;

		&-img {
			height: 40px;
			width: 40px;
			display: block;
			border-radius: 40px;
		}
	}

	&-name {
		line-height: 24rpx;
	}
}

.information {
	margin: 10px 10px 10px;
	background: #fdf0e6;
	display: flex;
	flex-direction: row;
	align-items: center;
	border-radius: 8px;

	&-icon {
		width: 33px;
		height: 28px;
		margin: 8px;
	}
}

.switching {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	height: 40px;
	margin: 12px;

	&-item {
		margin-right: 12px;
		position: relative;

		&-icon {
			display: none;
		}

		&-t {
			font-size: 15px;
			color: #777;
			transition: color 0.3s ease-in-out;
			transform: translate3d(0, 0, 0);
			will-change: transform;
			backface-visibility: hidden;
		}

		&-active {
			.switching-item-t {
				font-size: 17px;
				color: #161616;
				font-weight: bold;
			}

			&-icon {
				position: absolute;
				left: 50%;
				bottom: -4px;
				transform: translateX(-50%);
				width: 14px;
				height: 5px;
			}
		}
	}
}



.place {
	background-color: #333;
	height: 44px;
	padding-left: $mg;
	padding-right: $mg;
	display: flex;
	justify-content: space-between;
	align-items: center;

	position: sticky;
	left: 0;
	right: 0;
	top: 0;
	z-index: 99999;
	box-shadow: 0 -1px $ec;
	background-color: $ec;

	&-icon {
		// width: 80px;
		flex-shrink: 0;
		margin-right: 10px;
		display: flex;
		align-items: center;
		justify-content: center;

		&-img {
			width: 68px;
			height: 28px;
			// border-radius: 8px;
		}

		&-t {
			font-size: 16px;
			color: #fff;
			margin-left: 10px;
		}

	}

	&-search {
		// position: absolute;
		width: 100%;
		height: 32px;
		border-radius: 34px;
		padding: 0 20px 0 15px;
		box-sizing: border-box;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: nowrap;
		color: #999;
		// display: inline-block;

		.tui-swiper {
			font-size: 13px;
			height: 30px;
			flex: 1;
			padding-left: 12rpx;

			.tui-swiper-item {
				display: flex;
				align-items: center;
			}
		}
	}

}



.tui-hot-item {
	line-height: 26rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tui-header-banner {
	// padding-top: 100rpx;
	box-sizing: border-box;
	background: $ec;
}

.tui-hot-search {
	color: #fff;
	font-size: 12px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 20rpx;
	box-sizing: border-box;
	position: relative;
	z-index: 2;
}

.tui-hot-tag {
	background-color: rgba(255, 255, 255, 0.15);
	padding: 10rpx 24rpx;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 24rpx;
	margin-left: 5px;
}

.tui-banner-bg {
	display: flex;
	height: 180rpx;
	background-color: $ec;
	position: relative;
}

.tui-primary-bg {
	width: 50%;
	display: inline-block;
	height: 224rpx;
	border: 1px solid transparent;
	position: relative;
	z-index: 1;
	background-color: $ec;
}

.tui-route-left {
	transform: skewY(8deg);
}

.tui-route-right {
	transform: skewY(-8deg);
}

.tui-banner-box {
	width: 100%;
	padding: 0 $mg;
	box-sizing: border-box;
	position: absolute;
	/* overflow: hidden; */
	z-index: 99;
	bottom: -80rpx;
	left: 0;
}

.tui-banner-swiper {
	width: 100%;
	height: 240rpx;
	border-radius: 24rpx;
	overflow: hidden;
	transform: translateY(0);
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
	// background-color: #f8f8f8;
}

.tui-slide-image {
	width: 100%;
	height: 240rpx;
	display: block;
}

/* #ifdef MP-WEIXIN */
.tui-banner-swiper .wx-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background: none;
	justify-content: space-between;
}

.tui-banner-swiper .wx-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

.tui-banner-swiper .wx-swiper-dot-active::before {
	background-color: #fff;
}

.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

/* #ifndef MP-WEIXIN */
::v-deep .tui-banner-swiper .uni-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background-color: none;
	justify-content: space-between;
}

::v-deep .tui-banner-swiper .uni-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

::v-deep .tui-banner-swiper .uni-swiper-dot-active::before {
	background-color: #fff;
}

::v-deep .tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

.tui-product-category {
	padding: 80rpx $mg 30rpx $mg;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	font-size: 24rpx;
	color: #555;
	/* margin-bottom: 20rpx; */
}

.tui-category-item {
	width: 20%;
	height: 118rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	padding-top: 30rpx;
}

.tui-category-img {
	height: 80rpx;
	width: 80rpx;
	display: block;
	border-radius: 80rpx;
}

.tui-category-name {
	line-height: 24rpx;
}

.tui-block__box {
	width: 100%;
	padding: 0 $mg $mg;
	box-sizing: border-box;
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
}


.tui-img__coupon {
	width: 100%;
	height: 184rpx;
	display: block;
}

.tui-mtop__20 {
	margin-top: 20rpx;
}

.tui-bg-white {
	background-color: #fff;
}

.tui-group-name {
	width: 100%;
	font-size: 34rpx;
	line-height: 34rpx;
	font-weight: bold;
	text-align: center;
	padding: 30rpx 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #333;

	&-t {
		display: flex;
		align-items: center;
	}
}

.tui-sub__desc {
	color: #34c7a9;
	font-size: 28rpx;
	font-weight: 400;
	padding-left: 25rpx;
}

.tui-color__pink {
	color: #ff5f84;
}

.tui-seckill__box {
	display: flex;
	align-items: center;
}

.tui-seckill__img {
	width: 160rpx;
	height: 34rpx;
}

.tui-countdown__box {
	width: 228rpx;
	display: flex;
	align-items: center;

	color: #fff;
	background-color: #fff;
	font-weight: 400;
	border: 1px solid #eb0909;
	height: 40rpx;
	border-radius: 30px;
	overflow: hidden;
	margin-left: 25rpx;
}

.tui-countdown__title {
	width: 100rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #eb0909;
	flex-shrink: 0;
	font-size: 24rpx;
	line-height: 24rpx;
}

.tui-flex__center {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

/*秒杀商品*/
.tui-goods__list {
	display: flex;
	align-items: center;
}

.tui-goods__item {
	background-color: #fff;
	width: 150rpx;
	height: 230rpx;
	border-radius: 6rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	flex-shrink: 0;
	margin-right: 18rpx;
}

.tui-goods__imgbox {
	width: 150rpx;
	height: 150rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	border-radius: 5px;
	overflow: hidden;
}

.tui-goods__img {
	max-width: 150rpx;
	max-height: 150rpx;
	display: block;
}

.tui-pri__box {
	max-width: 150rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.tui-sale-pri {
	display: flex;
	align-items: flex-end;
	padding: 10rpx 0 8rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	line-height: 28rpx;
	color: #eb0909;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.tui-size-sm {
	font-size: 24rpx;
	line-height: 24rpx;
	transform: scale(0.8);
	transform-origin: 0 50%;
}

.tui-original__pri {
	font-size: 24rpx;
	line-height: 24rpx;
	color: #999999;
	transform-origin: center 10%;
	transform: scale(0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	// text-decoration: line-through;
}

/*秒杀商品*/

.tui-more__box {
	display: flex;
	align-items: center;
	font-weight: 400;
	color: #999;
}

.tui-more__box text {
	font-size: 24rpx;
	line-height: 24rpx;
}

.tui-new-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
}

.tui-new-item {
	width: 49%;
	height: 180rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	background: #f5f2f9;
	position: relative;
	border-radius: 12rpx;
}

.tui-new-mtop {
	margin-top: 2%;
}

.tui-title-box {
	font-size: 24rpx;
}

.tui-new-title {
	font-size: 26rpx;
	line-height: 32rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-new-price {
	padding-top: 18rpx;
}

.tui-new-present {
	color: #ff201f;
	font-weight: bold;
}

.tui-new-original {
	display: inline-block;
	color: #a0a0a0;
	text-decoration: line-through;
	padding-left: 12rpx;
	transform: scale(0.8);
	transform-origin: center center;
}

.tui-new-img {
	width: 148rpx;
	height: 148rpx;
	display: block;
	flex-shrink: 0;
}

.tui-new-label {
	width: 56rpx;
	height: 56rpx;
	border-top-left-radius: 12rpx;
	position: absolute;
	left: 0;
	top: 0;
}
</style>
