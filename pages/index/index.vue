<template>
	<view class="content">
		<view class="nav">
			<view class="nav-left">
				<u-search shape="square" :showAction="false" bgColor="#f4f4f9" placeholder="搜索商品" height="40" v-model="keyword"
					@search="onSearch"></u-search>
			</view>

			<view class="nav-right">
				<image class="nav-right-icon" src="/static/public/gift.png" />
				<text class="nav-right-t">抽奖</text>
			</view>
		</view>
		<u-tabs :list="tabs" @click="onTab"></u-tabs>
		<image class="banner" src="/static/public/banner.png" />

		<view class="dlist">
			<view class="dlist-item" v-for="(item, index) in 10" :key="index">
				<auction-time />
				<view class="dlist-item-pic">
					<image src="https://via.placeholder.com/64x64" style="width: 100%; height: 100%;" />
				</view>
				<view class="dlist-item-title">
					<view class="dlist-item-title-icon">
						<image :src="tags(index)" class="dlist-item-title-icon-pic" />
					</view>
					<text class="dlist-item-title-t">关于uView的取名来由，首字母u来自于uni-app首字母，un</text>
					<!-- <u--text class="dlist-item-title-t" :lines="2"
						:text="`关于uView的取名来由，首字母u来自于uni-app首字母，uni-app是基Vuejs，Vue和View(延伸为UI、视图之意)同音`" /> -->
				</view>
				<view class="dlist-item-bottom">
					<view class="dlist-item-price">
						<text class="dlist-item-price-t1">￥</text>
						<text class="dlist-item-price-t2">100</text>
						<text class="dlist-item-price-t3">当前价</text>
					</view>
					<view class="dlist-item-desc">
						<text class="dlist-item-desc-t">123人参与</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data: () => ({
		title: '标题',
		keyword: '',
		tabs: [{ name: '推荐', id: 0 }, { name: '鞋服', }, { name: '奢品' }, { name: '字画' }, { name: '数码' }, { name: '签名' }, { name: '其它' }]
	}),
	onLoad () {
	},
	methods: {
		/* 点击搜索 */
		onSearch () {
			uni.$toast('搜索内容:' + this.keyword)
		},

		/* 切换tab */
		onTab (item) {
			console.log(item)
		},

		/* 标签 */
		tags (val) {
			return {
				1: require('static/public/mingxingzhimai.png'),
				2: require('static/public/darenzhimai.png'),
				3: require('static/public/mingxingzhuanmai.png'),
				4: require('static/public/darenzhuanmai.png')
			}[val && val <= 4 ? val : 4]
		}
	}
}
</script>

<style lang="scss" scoped>
.content {}

.nav {
	display: flex;
	justify-content: space-between;
	padding: 10px;

	&-left {
		flex: 1;
		margin-right: 12px;
	}

	&-right {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&-icon {
			width: 24px;
			height: 22px;
		}

		&-t {
			margin-top: 2px;
			font-size: 12px;
			color: #777;
		}
	}
}



.banner {
	width: calc(100% - 20px);
	height: 100px;
	margin: 12px 10px 2px;
}

.dlist {
	display: flex;
	flex-wrap: wrap;

	&-item {
		position: relative;
		width: 50%;
		padding: 10px;
		box-sizing: border-box;
		border-bottom: 1px solid #f4f4f9;
		border-right: 1px solid #f4f4f9;

		:nth-child(odd) {
			border-right: none;
		}

		&-pic {
			width: 100%;
			height: calc(100vw / 2 - 20px);
		}

		&-title {
			margin-top: 10px;
			height: 48px;
			overflow: hidden;
			// display: flex;
			// align-items: flex-start;
			display: inline-block;
			word-break: break-all;

			&-icon {
				width: 46px;
				height: 24px;
				margin-right: 5px;
				// flex-shrink: 0;
				display: inline-block;
				vertical-align: top;

				&-pic {
					width: 100%;
					height: 18px;
					vertical-align: sub;
				}
			}

			&-t {
				font-size: 14px;
				color: #333;
				word-break: break-all;
			}
		}

		&-bottom {
			display: flex;
			justify-content: space-between;
		}

		&-price {
			display: flex;
			align-items: center;

			&-t1 {
				font-size: 12px;
				color: #333;
			}

			&-t2 {
				font-size: 16px;
				color: #333;
				font-weight: bold;
			}

			&-t3 {
				font-size: 10px;
				color: #777;
				margin-left: 2px;
			}
		}

		&-desc {
			display: flex;
			align-items: center;

			&-t {
				font-size: 12px;
				color: #777;
			}
		}
	}

}
</style>