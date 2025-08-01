<template>
  <view class="pbox">
    <u-icon size="16" name="close" class="pbox-close"
      v-if="getFirstAvailable(item, ['appUserInvitation.userId', 'userId']) === getUserInfo.id"
      @tap="remove(item, item.id)" />
    <view class="pbox-item">
      <view class="videobox" v-if="item.videoUrl"
        @tap.stop="previewVideo(getFirstAvailable(item, ['appUserInvitation.videoUrl', 'videoUrl']))">
        <video :src="getFirstAvailable(item, ['appUserInvitation.videoUrl', 'videoUrl'])" />
      </view>
      <image class="pbox-item-limg" :src="imagesfirst(getFirstAvailable(item, ['appUserInvitation.images', 'images']))"
        v-else />
      <view class="pbox-item-content">
        <!-- <text class="pbox-item-content-t">{{ item.userHidden ? '隐藏用户' : item.title }}</text> -->
        <text class="pbox-item-content-t">{{ getFirstAvailable(item, ['appUserInvitation.userHidden', 'userHidden']) ?
          '匿名用户' : getFirstAvailable(item, ['appUserInvitation.title', 'title']) }}</text>
        <view class="pbox-item-content-center">
          {{ getFirstAvailable(item, ['appUserInvitation.description', 'description']) }}
        </view>
        <text class="pbox-item-content-bottom">
          发布时间: {{ getFirstAvailable(item, ['appUserInvitation.createTime', 'createTime']) }}
        </text>
      </view>
    </view>
    <view class="pbox-bottom">
      <view class="pbox-bottom-l">
        <u-icon name="map"
          :label="getFirstAvailable(item, ['appUserInvitation.addHidden', 'addHidden']) ? '地址不可见' : getFirstAvailable(item, ['appUserInvitation.cityAddress', 'cityAddress'])"
          size="15" labelColor="#222" labelSize="12" />
      </view>
      <view class="pbox-bottom-r">
        <u-icon class="pbox-bottom-r-icon" name="eye"
          :label="formatNum(getFirstAvailable(item, ['appUserInvitation.viewCount', 'viewCount'])) || 0" size="15"
          labelColor="#222" labelSize="12" />
        <u-icon class="pbox-bottom-r-icon" name="heart"
          :label="formatNum(getFirstAvailable(item, ['appUserInvitation.praiseCount', 'praiseCount'])) || 0" size="15"
          labelColor="#222" labelSize="12" />
        <u-icon class="pbox-bottom-r-icon" name="chat"
          :label="formatNum(getFirstAvailable(item, ['appUserInvitation.reviewCount', 'reviewCount'])) || 0" size="15"
          labelColor="#222" labelSize="12" />
      </view>
    </view>

  </view>

</template>

<script>
import { formatNum } from '@mvmoo/us'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PostTemp',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },
  data: () => ({

  }),
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    ...mapActions(['removePaginItem']),
    
    formatNum (val) { return formatNum(val) },
    imagesfirst (images) {
      // 先把字符串转成数组
      if (typeof images === 'string') {
        images = images.split(',')
      } else if (!Array.isArray(images)) {
        return ''
      }
      // 返回第一个图片地址
      return images.length > 0 ? images[0] : ''
    },
    remove (item, id) {
      uni.showModal({
        title: '提示',
        content: '确认删除吗？',
        success: (res) => {
          if (res.confirm) {
            // this.$emit('remove', item, id)
            this.removePaginItem(id)
          }
        }
      })
    },
    previewVideo (url) {
      uni.$previewVideo(url)
    },
    getFirstAvailable (obj, paths, defaultValue = '') {
      for (const path of paths) {
        const value = path.split('.').reduce((acc, key) => acc && acc[key], obj);
        if (value !== undefined && value !== null && value !== '') {
          return value;
        }
      }
      return defaultValue;
    }
  }
}
</script>

<style lang="scss" scoped>
.pbox {
  background-color: #fff;
  margin-bottom: 12px;
  position: relative;

  &-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
  }

  &-item {
    flex-shrink: 0;
    display: flex;
    overflow: hidden;
    position: relative;
    padding: 16px 12px 12px;

    &-limg {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 12px;
      background-color: rgba(0, 0, 0, 0.025);
    }

    .videobox {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.025);

      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
      }
    }

    &-content {
      width: 0;
      flex: 1;
      padding: 0 12px;
      box-sizing: border-box;
      color: #333;

      display: flex;
      flex-direction: column;

      &-t {
        font-size: 13px;
        font-weight: bold;
        margin-bottom: 4px;
        margin-right: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-center {
        flex: 1;
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
        // 最多显示两行
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /* 显示两行 */
        -webkit-box-orient: vertical;
        /* 必须设置 */
        margin-top: 4px;
      }

      &-bottom {
        font-size: 12px;
        color: #999;
      }
    }
  }

  &-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin: 8px 12px;
    padding: 8px 12px;


    &-l {
      display: flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-r {
      display: flex;
      align-items: center;

      &-icon {
        margin-left: 8px;
      }
    }
  }
}
</style>