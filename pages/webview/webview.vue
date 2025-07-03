<template>
  <view>
    <web-view :src="params.urls" @message="handlePostMessage"></web-view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      urls: '',
      params: {}
    }
  },
  onLoad (options) {
    this.params = {
      ...options,
      urls: options.url
    }
  },
  onHide () {
  },
  methods: {
    handlePostMessage: (data)=> {
      const [datas] = data.detail.data
      if (datas.key === 'goback') {
        uni.navigateBack()
        return
      }
      console.log("接收到消息：" + JSON.stringify(data.detail));
    },
  }
}
</script>

<style>
	page{
		background-color: #f2f2f6;
	}
  uni-page-head[uni-page-head-type=default]~uni-page-wrapper{
    height: 100%;
  }
</style>