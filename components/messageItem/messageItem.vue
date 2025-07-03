<template>
	<view :class="['message-item', detail.opposite ? '' : 'message-item-my']">
		<view class="message-robot-wrap" v-if="detail.opposite">
			<!-- <view class="robot-icon">
        <image src="@/static/bot2.png" mode=""></image>
      </view> -->
			<view class="text-message-wrap">
				{{ detail.content }}
			</view>
		</view>
		<view class="message-wrap" v-else>
			{{ detail.content }}
		</view>
	</view>
</template>

<script>
export default {
	props: {
		detail: {
			type: Object,
			default: () => ({})
		}
	}
}
</script>

<style lang="scss" scoped>
$--redius: 8px;

.message-item {
	display: flex;
	padding: 0 16px 16px 16px;

	.message-robot-wrap {
		display: flex;

		.robot-icon {
			height: 20px;
			width: 20px;
			border-radius: 50%;
			background-color: #ff7b7b;
			padding: 8px;
			margin-right: 8px;

			image {
				height: 100%;
				width: 100%;
			}
		}

		.text-message-wrap {
			flex: 1;
			// background-color: #fff;
			// background: linear-gradient(90deg, rgb(213, 194, 255, 0.64) 0%, rgb(247, 155, 216, 0.35) 100%);
			background: linear-gradient(75deg, #ffd6fd 0%, #ffe2d6 100%);
			color: #2f2f2f;
			font-size: 15px;
			padding: 8px 12px;
			word-break: break-all;
			text-align: justify;
			border-radius: 0 $--redius $--redius $--redius;
		}
	}
}

.message-item-my {
	justify-content: flex-end;
	padding-left: 16px;

	.message-wrap {
		// background-color: #87e039;
		// 渐变背景
		// background: linear-gradient(90deg, rgba(17, 238, 244, 0.35) 0%, rgba(130, 247, 149, 0.53) 100%);
		background: linear-gradient(45deg, #8aecdd 0%, #afdd80 100%);
		font-size: 15px;
		color: #2f2f2f;
		padding: 8px 12px;
		border-radius: $--redius $--redius 0 $--redius;
		word-break: break-all;
		text-align: justify;
	}
}
</style>