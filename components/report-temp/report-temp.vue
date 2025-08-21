<template>
  <view class="blocktgrid-items" @tap="todetail" v-if="item">
    <u-icon size="16" name="close" class="blocktgrid-items-close" @tap="remove(item, item.appUserReport.id)" v-if="item.appUserReport.userId === getUserInfo.id" />
    <view class="uoverview">
      <view class="uoverview-l">
        <image class="uoverview-l-avatar" :src="item.appUser.avatar" />
      </view>
      <view class="uoverview-c">
        <view class="uoverview-c-top">
          <text class="uoverview-c-top-t">{{item.appUser.nickName}}</text>
          <u-icon label="黄金会员" size="16" labelColor="#9C7E58" labelSize="12" name="/static/per/hy-icon.png" v-if="item.appUser.isVip" />
        </view>
        <view class="uoverview-c-bottom">
          <text class="uoverview-c-bottom-t">{{item.appUserReport.createTime}} 发布</text>
        </view>
      </view>
    </view>

    <text class="blocktgrid-items-positiont" v-if="item.appUserReport.reportLevel === 1">精品</text>
    <image class="blocktgrid-items-positionicon" src="/static/per/p-3.png" v-if="item.appUserReport.isVideo" />

    <view class="ctext">
      <text class="ctext-t">妹子花名：</text>
      <text class="ctext-t2">{{item.appUserReport.stageName}}</text>
    </view>
    <view class="ctext">
      <text class="ctext-t">交易时间：</text>
      <text class="ctext-t2">{{item.appUserReport.tasteTime}}</text>
    </view>
    <view class="ctext">
      <text class="ctext-t">所在位置：</text>
      <text class="ctext-t2">{{item.appUserReport.address}}</text>
    </view>
    <view class="ctext" style="justify-content: space-between;" v-if="false">
      <view class="ctext-inner">
        <text class="ctext-t">消费评价：</text>
        <u-rate :value="Number(item.appUserReport.faceLevel)" readonly></u-rate>
      </view>
      <view class="ctext-inner">
        <text class="ctext-t">消费金额：¥{{item.appUserReport.amount}}</text>
      </view>
    </view>
    <view class="ctext-t3">
      <text>{{item.appUserReport.desription}}</text>
    </view>
  </view>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ReportTemp',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters(['getUserInfo', 'removePaginItem'])
  },
  methods: {
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
        content: '确认删除该报告吗？',
        success: (res) => {
          if (res.confirm) {
            // this.$emit('remove', item, id)
            this.removePaginItem(id)
          }
        }
      })

      // this.$emit('remove', item, id)
    },

    todetail () {
      uni.navigateTo({
        url: `/pages/details/report?id=${this.item.id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.blocktgrid {
  // padding-bottom: 20px;
  // background-color: #fff;
  // border-bottom: 1px solid #eee;

  &-items {
    padding: 16px;
    border-bottom: 1px dashed #eee;
    position: relative;

    &:last-child {
      border-bottom: none;
    }

    &-close {
      position: absolute;
      top: 8;
      right: 16px;
      z-index: 1;
    }

    &-positiont {
      position: absolute;
      top: 48px;
      right: 16px;
      font-size: 16px;
      color: rgba(255, 96, 101, 1);
      transform: rotate(45deg);
    }

    &-positionicon {
      position: absolute;
      top: 96px;
      right: 32px;
      width: 32px;
      height: 26px;
    }
  }

  &-infoboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0 6px;

    &-bg {
      background-color: #f8f8fe;
      padding: 6px;
      border-radius: 8px;
    }

    &-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px;

      &-icon {
        width: 28px;
        height: 28px;
        margin-right: 8px;
      }

      &-txts {
        display: flex;
        flex-direction: column;

        &-t1 {
          font-size: 14px;
          color: #333;
        }

        &-t2 {
          font-size: 11px;
          color: #adadad;
        }
      }
    }
  }

}
</style>