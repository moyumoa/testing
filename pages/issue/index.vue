<template>
	<view class="content">
		<view class="pageback">
			<image class="pageback-pic" src="/static/public/maixianzhi.png" />
		</view>

		<view class="btns">
			<view class="btns-item" @tap="onClick">
				<view class="btns-item-left">
					<image class="btns-item-left-icon" src="/static/public/paitushoumai.png" />
				</view>
				<view class="btns-item-center">
					<text class="btns-item-center-t">自由发布 随时上架</text>
					<text class="btns-item-center-t2">拍图售卖</text>
				</view>
				<view class="btns-item-right">
					<u-icon name="arrow-rightward" color="#999" size="16"></u-icon>
				</view>
			</view>
			<view class="btns-item">
				<view class="btns-item-left">
					<image class="btns-item-left-icon" src="/static/public/pingtaijimai.png" />
				</view>
				<view class="btns-item-center">
					<text class="btns-item-center-t">专业仓储 省心便捷</text>
					<text class="btns-item-center-t2">平台寄卖</text>
				</view>
				<view class="btns-item-right">
					<u-icon name="arrow-rightward" color="#999" size="16"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data: () => ({

	}),
	onLoad () {

	},
	methods: {
		onClick: () => uni.$toast('点击了12312')
	}
}
</script>

<style lang="scss" scoped>
.content {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f5f6fa;
}

.pageback {
	width: 100%;
	height: 60vh;

	&-pic {
		width: 100%;
		height: 100%;
	}
}

.btns {
	display: flex;
	flex-direction: column;
	margin-top: 16px;

	&-item {
		margin: 16px;
		height: 80px;
		display: flex;
		background-color: #fff;
		border-radius: 10px;
		align-items: center;

		&:last-child {
			margin-top: 0;
		}

		&-left {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 40px;
			height: 40px;
			margin: 0 16px;

			&-icon {
				width: 100%;
				height: 100%;
			}
		}

		&-center {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;

			&-t {
				font-size: 12px;
				color: #999;
				margin-bottom: 2px;
			}

			&-t2 {
				font-size: 16px;
				color: #333;
				font-weight: bold;
			}
		}

		&-right {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 16px;
		}
	}
}
</style>