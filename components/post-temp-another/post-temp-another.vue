<template>
  <view class="blocktgrid-items">
    <u-icon size="16" name="close" class="blocktgrid-items-close" @tap="remove(item, item.id)"
      v-if="item.appUser.id === getUserInfo.id" />

    <view class="uoverview">
      <view class="uoverview-l">
        <image class="uoverview-l-avatar" :src="item.appUser.avatar" />
      </view>
      <view class="uoverview-c">
        <view class="uoverview-c-top">
          <text class="uoverview-c-top-t">{{ item.appUser.nickName }}</text>
          <u-icon label="黄金会员" size="16" labelColor="#9C7E58" labelSize="12" name="/static/per/hy-icon.png"
            v-if="item.appUser.isVip" />
        </view>
        <view class="uoverview-c-bottom">
          <view style="display: flex; align-items: center;">
            <template v-if="item.appUserPost.addHidden">
              <u-icon name="map" color="#333" size="12" style="margin-right: 2px;" />
              <text class="uoverview-c-bottom-t">{{ item.appUserPost.cityAddress }}</text>
            </template>
            <text class="uoverview-c-bottom-t">{{ formatSmartTime(item.appUserPost.createTime) }} 发布</text>
          </view>
        </view>
      </view>
      <follow-btn :customerId="item.appUser.id" v-if="item.appUser.id !== getUserInfo.id" />
    </view>

    <view class="description">
      <text>{{ item.appUserPost.description }}</text>
    </view>

    <view class="cell-item-several">
      <view class="cell-item-pic" v-if="item.appUserPost.videoUrl" @tap="previewVideo(item.appUserPost.videoUrl)">
        <video :src="item.appUserPost.videoUrl" />
      </view>
      <template v-else>
        <view class="cell-item-pic" v-for="(pic, _index) in item.images" :key="_index">
          <image :src="pic" />
        </view>
      </template>
    </view>

    <view class="blocktgrid-bottom">
      <view class="blocktgrid-bottom-l"></view>
      <view class="blocktgrid-bottom-r">
        <u-icon class="blocktgrid-bottom-r-icon" name="eye" :label="formatNum(item.appUserPost.viewCount) || 0"
          size="15" labelColor="#222" labelSize="12" v-if="false" />
        <u-icon class="blocktgrid-bottom-r-icon" name="heart" :label="formatNum(item.appUserPost.praiseCount) || 0"
          size="15" labelColor="#222" labelSize="12" />
        <u-icon class="blocktgrid-bottom-r-icon" name="chat" :label="formatNum(item.appUserPost.reviewCount) || 0"
          size="15" labelColor="#222" labelSize="12" v-if="false" />
      </view>
    </view>

  </view>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatSmartTime, formatNum } from '@mvmoo/us'

export default {
  name: 'PostTemp',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    formatSmartTime: formatSmartTime,
    relation: {},
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

      // this.$emit('remove', item, id)
    },
    previewVideo (url) {
      uni.$previewVideo(url)
    },
  }
}
</script>


<style lang="scss" scoped>
.blocktgrid {
  // padding-bottom: 20px;
  // background-color: #fff;
  // border-bottom: 1px solid #eee;

  &-items {
    padding: 24px 16px 16px;
    // margin-bottom: 16px;
    // border-bottom: 1px dashed #eee;
    border-bottom: 1px solid #f8f8f8;
    position: relative;
    background-color: #fff;


    &:last-child {
      border-bottom: none;
    }

    &-close {
      position: absolute;
      top: 8;
      right: 16px;
      z-index: 1;
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

.description {
  margin: 16px 8px;
  font-size: 14px;
  color: #333;
}

.cell-item {
  &-several {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  &-pic {
    width: calc((85dvw - 48px) / 3);
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    // background-color: rgba(0, 0, 0, 0.025);
    position: relative;

    &:nth-child(3n) {
      margin-right: 15dvw;
    }

    image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    video {
      // 禁止点击
      pointer-events: none;
    }
  }
}
</style>