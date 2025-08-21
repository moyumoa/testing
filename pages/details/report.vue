<template>
  <view class="blocktgrid-items">
    <!-- <u-icon size="16" name="close" class="blocktgrid-items-close" @tap="remove(item, item.appUserReport.id)" v-if="item.appUserReport.userId === getUserInfo.id" /> -->
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
          <text class="uoverview-c-bottom-t">{{ item.appUserReport.createTime }} 发布</text>
        </view>
      </view>
    </view>

    <text class="blocktgrid-items-positiont" v-if="item.appUserReport.reportLevel === 1">精品</text>
    <image class="blocktgrid-items-positionicon" src="/static/per/p-3.png" v-if="item.appUserReport.isVideo" />

    <view class="ctext">
      <text class="ctext-t">妹子花名：</text>
      <text class="ctext-t2">{{ item.appUserReport.stageName }}</text>
    </view>
    <view class="ctext">
      <text class="ctext-t">体验项目：</text>
      <text class="ctext-t2">{{ item.appUserReport.items }}</text>
    </view>
    <view class="ctext">
      <text class="ctext-t">胸器罩杯：</text>
      <text class="ctext-t2">{{ item.appUserReport.cup }}</text>
    </view>
    <view class="ctext">
      <text class="ctext-t">交易时间：</text>
      <text class="ctext-t2">{{ item.appUserReport.tasteTime }}</text>
    </view>
    <view class="ctext">
      <text class="ctext-t">所在位置：</text>
      <text class="ctext-t2">{{ item.appUserReport.address }}</text>
    </view>
    <view class="ctext" style="justify-content: space-between;">
      <view class="ctext-inner">
        <text class="ctext-t">消费金额：¥{{ item.appUserReport.amount }}</text>
      </view>
      <view class="ctext-inner">
        <text class="ctext-t">服务时长：¥{{ item.appUserReport.duration }}</text>
      </view>
    </view>
    <view class="ctext" style="justify-content: space-between;">
      <view class="ctext-inner">
        <text class="ctext-t">颜值评分：</text>
        <u-rate :value="Number(item.appUserReport.faceLevel)" readonly></u-rate>
      </view>
    </view>
    <view class="ctext" style="justify-content: space-between;">
      <view class="ctext-inner">
        <text class="ctext-t">服务质量：</text>
        <u-rate :value="Number(item.appUserReport.serviceQuality)" readonly></u-rate>
      </view>
    </view>
    <view class="ctext" style="justify-content: space-between;">
      <view class="ctext-inner">
        <text class="ctext-t">环境质量：</text>
        <u-rate :value="Number(item.appUserReport.envLevel)" readonly></u-rate>
      </view>
    </view>
    <view class="ctext-t3">
      <text>{{ item.appUserReport.desription }}</text>
    </view>

    <view class="multimedia-list">
      <view class="multimedia-list-item" v-if="videoUrl" @tap="previewVideo(videoUrl)">
        <video class="multimedia-list-item-video" :src="videoUrl" />
      </view>
      <view class="multimedia-list-item" v-for="(item, index) in images" :key="index" @tap="perview(item, index)">
        <image class="multimedia-list-item-img" :src="item" mode="aspectFill" />
      </view>
    </view>

    <view class="pib" v-if="showCrad">
      <u-icon size="16" name="close" class="pib-close" @tap="showCrad = false" />
      <view class="pib-item">
        <image class="pib-item-limg" :src="item.appUser.avatar" />
        <view class="pib-item-content">
          <view class="pib-item-content-title">
            <text class="pib-item-content-title-t">{{ item.appUser.nickName }}</text>
            <text class="pib-item-content-title-tag">{{ ageGroup(item.appUser.birthday) }}</text>

          </view>
          <view class="pib-item-content-item">
            <text class="pib-item-content-item-primary">三围：</text>
            <text class="pib-item-content-item-sub">{{ item.appUser.size }}</text>
          </view>
          <view class="pib-item-content-item">
            <text class="pib-item-content-item-primary">消费情况：</text>
            <text class="pib-item-content-item-sub">{{ item.appUser.minCharge }}/p</text>
          </view>
          <view class="pib-item-content-item">
            <text class="pib-item-content-item-primary">Ta的项目：</text>
            <text class="pib-item-content-item-sub">{{ item.appUser.description }}</text>
          </view>
        </view>
      </view>
      <view class="pib-btn" @tap.stop="navito">Ta主页</view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    showCrad: true,
    item: {
      "appUser": {
        "createBy": "",
        "createTime": "2025-07-22 15:14:08",
        "updateBy": "admin",
        "updateTime": "2025-08-12 17:05:58",
        "remark": "哈看",
        "id": 56,
        "loginName": "1007",
        "password": "c4ca4238a0b923820dcc509a6f75849b",
        "nickName": "活泼彩虹590",
        "sex": null,
        "avatar": "http://192.168.9.99:9000/images/2025/07/16/image_20250716192519A012.jpg",
        "city": "杭州市",
        "isVip": 1,
        "vipLevel": 0,
        "userLevel": 1,
        "fansCount": 1,
        "attentionCount": 2,
        "phone": null,
        "email": null,
        "isCertification": 1,
        "certificationType": 2,
        "delFlag": 0,
        "disableStatus": 0,
        "loginTime": "2025-08-12 17:05:58",
        "logoutTime": null,
        "expireTime": "2026-07-16 19:43:51",
        "vipExpireTime": "2025-07-26 23:59:59",
        "balance": 808877,
        "deposit": 0,
        "lat": "30.185481",
        "lng": "120.160912",
        "cityAddress": null,
        "activeCity": "重庆",
        "dealCount": 0,
        "faceScore": null,
        "onlineStatus": 1,
        "height": null,
        "weight": null,
        "size": null,
        "project": null,
        "birthday": null,
        "isUpdateCount": 0,
        "images": null,
        "createCount": 100,
        "offlineTime": 1754989241000,
        "description": null,
        "qq": "272891",
        "wechat": null,
        "yuni": null,
        "telegeam": null,
        "minCharge": null,
        "isOrder": 1,
        "imUserName": "008679447827947",
        "imPassword": "1",
        "imUid": "36f67e2d01834b52ba376fb79bc4e567",
        "imToken": "3bafa2a88f0442feabc60b0b65744549",
        "checkChatNum": 10,
        "putAwayCount": 0,
        "videoUrl": null,
        "intentionNum": 10,
        "invitationNum": 10
      },
      "appUserReport": {
        "createBy": null,
        "createTime": "2025-07-30 09:39:47",
        "updateBy": "",
        "updateTime": "2025-07-30 09:44:28",
        "remark": null,
        "id": 12,
        "stageName": "都发顺丰到付",
        "faceScore": null,
        "tasteTime": "2023-03-03",
        "address": "电风扇犯得上发",
        "height": null,
        "faceLevel": 4,
        "cup": "c",
        "desription": "对手犯规得分",
        "serviceQuality": 5,
        "envLevel": 5,
        "surroundImg": "http://192.168.9.99:9000/images/2025/07/30/951009bce7f9c207519fd6bef44a6b7f_20250730093945A024.mp4",
        "indoorImg": "http://192.168.9.99:9000/images/2025/07/30/20230827193115hq8J3RBxiao_20250730093939A023.jpg",
        "customerImg": "http://192.168.9.99:9000/images/2025/07/30/20230827193115hq8J3RBxiao_20250730093934A022.jpg",
        "payImg": "http://192.168.9.99:9000/images/2025/07/30/20230827193115hq8J3RBxiao_20250730093930A021.jpg",
        "checkStatus": null,
        "checkRemark": "1",
        "orderNo": "PCSQYYcV63vS_56_20250728143119",
        "userId": 56,
        "customerId": 37,
        "delFlag": null,
        "reportLevel": null,
        "reportType": 0,
        "productId": null,
        "orderId": 117,
        "isVideo": 1,
        "duration": 90,
        "items": "单数风速达到",
        "amount": 15000,
        "checkTime": null
      }
    },
    images: ["http://192.168.9.99:9000/images/2025/07/30/20230827193115hq8J3RBxiao_20250730093939A023.jpg", "http://192.168.9.99:9000/images/2025/07/30/20230827193115hq8J3RBxiao_20250730093934A022.jpg", "http://192.168.9.99:9000/images/2025/07/30/20230827193115hq8J3RBxiao_20250730093930A021.jpg"],
    videoUrl: "http://192.168.9.99:9000/images/2025/07/30/951009bce7f9c207519fd6bef44a6b7f_20250730093945A024.mp4"
  }),
  computed: {
    ...mapGetters(['getUserInfo', 'removePaginItem']),
  },
  methods: {
    formatNum (val) { return formatNum(val) },

    previewVideo (url) {
      uni.$previewVideo(url)
    },

    ageGroup (birthday) {
      const year = new Date(birthday).getFullYear();
      if (isNaN(year)) return '未知';
      const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
      return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
    },

    perview (item, index) {
      uni.previewImage({
        current: index,
        urls: this.images
      })
    },

    navito () {
      uni.navigateTo({ url: `/pages/personal/detail?userId=${this.item.appUserReport.userId}` })

    },

  }
}
</script>

<style lang="scss" scoped>
.blocktgrid {
  padding-bottom: 128px;
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
}

.multimedia-list {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;

  &-item {
    aspect-ratio: 1 / 1;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      background-color: rgba(0, 0, 0, 0.025);
    }

    &-video {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      background-color: rgba(0, 0, 0, 0.025);
      pointer-events: none;
    }

    video {
      pointer-events: none;
    }
  }
}

.pib {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #D9EAFE 0%, #F4EDFD 100%);
  border-radius: 20px;
  margin: 16px;

  &-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
  }

  &-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #FF6090;
    color: #fff;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
  }

  &-item {
    flex: 1;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;


    &-limg {
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.025);
    }

    &-content {
      flex: 1;
      margin-left: 16px;

      &-title {
        display: flex;
        align-items: center;

        &-t {
          font-size: 16px;
          color: #333;
          font-weight: bold;
        }

        &-tag {
          margin-left: 8px;
          font-size: 10px;
          color: #fff;
          background-color: #17d329; // 蓝色
          padding: 2px 6px;
          border-radius: 12px;
          margin-right: 4px;
        }
      }

      &-item {
        // margin-top: 8px;
        line-height: 1;

        &-primary {
          font-size: 12px;
          color: #5F6572;
        }

        &-sub {
          font-size: 12px;
          color: #1a1a1a;
        }
      }
    }
  }
}
</style>