<template>
  <view class="preview-container">
    <video
      :src="videoUrl"
      controls
      autoplay
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoUrl: ''
    };
  },
  onLoad(options) {
    this.videoUrl = decodeURIComponent(options.url || '');
  }
};
</script>
<style>
.preview-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000;
}

video{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持视频比例填充容器 */
}
</style>