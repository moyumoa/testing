<template>
  <view class="pagecontainer">
    <view class="post-title">
      <text class="post-title-t">{{ detailInfo.title }}</text>
      <text class="post-title-desc"> {{ detailInfo.viewCount }}浏览 · {{ detailInfo.reviewCount }}评论</text>
    </view>

    <post-temp-another :item="detailInfo" />

    <view class="contact">
      <view class="contact-item" @tap.stop="oper('unlock')">解锁联系方式</view>
      <view class="contact-item" @tap.stop="oper('fabu')">发布信息</view>
    </view>

    <inline-comments :articleId="currentId" title="评论区" :pageSize="10" :autoLoad="true"
      @change-count="count => commentCount += count" />

    <t-pay-way :neededs="neededs" :payTxt="payTxt" :payPrice="price" :show="showPay" @close="showPay = false"
      @pay="submitPay" />

    <u-popup :show="showUnlock" :round="10" mode="bottom" @close="closeUnlock" @open="openUnlock" closeable>
      <view class="unlock">
        <view class="unlock-header">
          <text class="unlock-header-t">联系方式已解锁</text>
        </view>

        <view class="unlock-body">
          <view class="unlock-list">
            <view class="unlock-list-item" v-for="(item, index) in ContactInformation" :key="index">
              <view class="unlock-list-item-l">
                <text class="unlock-list-item-l-t">{{ item.type }}: {{ item.value }}</text>
              </view>
              <view class="unlock-list-item-r">
                <text class="unlock-list-item-r-t" @tap.stop="copy(item)">复制</text>
              </view>
            </view>
          </view>
        </view>

        <view class="unlock-btns">
          <!-- <view class="unlock-btns-item" @tap="oper('chat')">
            <text class="unlock-btns-item-t">去聊天</text>
          </view> -->
          <view class="unlock-btns-item unlock-btns-item-active" @tap="closeUnlock">
            <text class="unlock-btns-item-t">查看订单</text>
          </view>
        </view>
      </view>
    </u-popup>

  </view>
</template>
<script>
export default {
  data: () => ({
    detailInfo: {
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
        "phone": 18812345678,
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
      "appUserPost": {
        "createBy": null,
        "createTime": "2025-07-30 15:45:22",
        "updateBy": "",
        "updateTime": null,
        "remark": null,
        "id": 9,
        "userId": 56,
        "description": "十公里啊地方加;阿斯泼妇排位 ",
        "images": "",
        // "videoUrl": "http://192.168.9.99:9000/images/2025/07/30/IMG_7132_20250715142312A001_20250728155735A005_20250730154254A001.mov",
        "praiseCount": 0,
        "authStatus": 1,
        "checkRemark": null,
        "commentNumber": 0,
        "likeNumber": 0,
        "avatar": null,
        "delFlag": null,
        "checkTime": null,
        "addHidden": null,
        "userHidden": null,
        "seeStatus": 0,
        "lng": "120.160804",
        "lat": "30.185718",
        "cityAddress": "南都江滨花园信雅达科技大厦"
      },
      "createBy": "活泼彩虹590",
      "createTime": "2025-07-30 14:30:16",
      "updateBy": "",
      "updateTime": null,
      "remark": null,
      "id": 6,
      "userId": 56,
      "description": null,
      "title": "sdahflasjl",
      "images": ["http://192.168.9.99:9000/images/2025/07/30/c-1_20250730143008A001.png", "http://192.168.9.99:9000/images/2025/07/30/c-1_20250730143008A001.png", "http://192.168.9.99:9000/images/2025/07/30/c-1_20250730143008A001.png", "http://192.168.9.99:9000/images/2025/07/30/c-1_20250730143008A001.png"],
      "viewCount": 0,
      "praiseCount": 0,
      "reviewCount": 0,
      "authStatus": 1,
      "checkRemark": null,
      "delFlag": 0,
      "addHidden": 0,
      "userHidden": 0,
      "payType": 0,
      "payAmount": 0,
      "lat": "30.185718",
      "lng": "120.160804",
      "cityAddress": "南都江滨花园信雅达科技大厦",
      "avatar": null,
      "videoUrl": "",
      "checkTime": null,
      "checkImages": null,
      phone: "18812345678",
      wechat: "wx123456",
      qq: "123456",
      yuni: "yuni123",
      telegeam: "telegeam123"
    },
    paysource: '', // 支付来源
    payTxt: '',
    neededs: '', // 需要的支付方式
    showPay: false, // 是否显示支付弹窗
    showUnlock: false, // 是否显示解锁联系方式弹窗
    price: 0,
    unlockPrice: 10, // 解锁价格
    currentId: 123,
    commentCount: 0
  }),
  computed: {
    ContactInformation () {
      return [
        { type: '手机号', value: this.detailInfo.phone },
        { type: '微信', value: this.detailInfo.wechat },
        { type: 'QQ', value: this.detailInfo.qq },
        { type: '与你', value: this.detailInfo.yuni },
        { type: 'Telegeam', value: this.detailInfo.telegeam },
      ].filter(item => item.value) // 过滤掉没有值的联系方式
    },
  },
  methods: {
    onAddCount (delta) { this.commentCount += delta },
    copy (item) {
      uni.setClipboardData({
        data: item.value,
        success: () => {
          uni.$toast('已复制到剪切板')
        },
        fail: () => {
          uni.$toast('复制失败，请手动复制')
        }
      })
    },
    openUnlock () {
      this.showUnlock = true
    },
    closeUnlock () {
      this.showUnlock = false
    },
    async submitPay ({ amount, payType }) {
      await ({
        'unlock': async () => {
          const unlockType = () => {
            if (payType === 'huiyuan') return 1; // 会员免费解锁
            if (payType === 'balance' && this.getUserInfo.isVip) return 2; // 会员付费解锁
            return 0; // 非会员解锁
          }
          // 提交支付
          await uni.$api.unlockUser({
            unlockType: unlockType(), // 解锁类型  0-非会员解锁  1-会员免费解锁 2-会员付费解锁
            userId: this.getUserInfo.id,
            customerId: this.options.userId,
            amount,
            payType
          }).then(async res => {
            uni.$toast('支付成功')
            this.showPay = false;
            this.openUnlock()
          }).catch(err => {
            console.error('支付失败', err)
            this.showPay = false;
            uni.$toast('支付失败，请稍后再试')
          })
        },
      }[this.paysource] || (() => {
        console.warn(`未定义的支付来源: ${this.paysource}`);
      }))?.();

      this.paysource = ''; // 重置支付来源
      this.price = 0; // 重置价格
      this.neededs = ''; // 重置需要的支付方式
      this.payTxt = ''; // 重置支付文本
      await new Promise(resolve => setTimeout(resolve, 500));
    },

    oper (val) {
      ({
        'unlock': async () => {
          // 查看联系方式
          if (this.relation?.chat) {
            // uni.navigateTo({ url: `/pages/personal/chat?userId=${this.options.userId}` })
            this.openUnlock()
          } else {
            this.paysource = 'unlock' // 设置支付来源
            this.price = this.unlockPrice // 解锁费用
            this.neededs = '3,4' // 需要的支付方式
            this.payTxt = '立即解锁'
            this.showPay = true
            // this.showUnlock = true
          }
        },
        'chat': () => {
          this.naviChat(this.detail)
          this.closeUnlock()
        },
        'fabu': async () => {
          uni.navigateTo({ url: `/pages/release/post` })
        }
      }[val] || (() => {
        console.warn(`未定义的操作: ${val}`);
      }))?.();
    },
  },
};
</script>
<style lang="scss" scoped>
.pagecontainer {}

.post-title {
  padding: 16px 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;

  &-t {
    font-size: 18px;
    font-weight: bold;
  }

  &-desc {
    font-size: 14px;
    color: #666;
  }
}

.contact {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  &-item {
    padding: 8px 16px;
    font-size: 15px;
    background-color: #eee;
    border-radius: 32px;

    &:last-child {
      background-color: #72A5FD;
      color: #fff;
      margin-left: 24px;
    }
  }
}

.unlock {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;

  &-header {
    padding: 16px;
    border-bottom: 1px solid #eee;

    &-t {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
  }

  &-body {
    padding: 16px;
    overflow-y: auto;
    height: calc(100% - 80px); // 减去头部和底部按钮的高度

    &::-webkit-scrollbar {
      display: none; // 隐藏滚动条
    }
  }

  &-list {
    margin: 0;
    padding: 0;
    list-style: none;

    &-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #eee;

      &-l {
        flex: 1;
        font-size: 14px;
        color: #333;
      }

      &-r {
        flex-shrink: 0;
        color: #739af7;
        cursor: pointer;

        &-t {
          font-size: 13px;
        }
      }
    }
  }

  &-btns {
    display: flex;
    justify-content: space-between;
    padding: 16px;

    &-item {
      flex: 1;
      text-align: center;
      padding: 8px 12px;
      border-radius: 32px;
      background-color: #efefef;
      color: #223;
      font-size: 15px;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }

      &-active {
        background-color: #e79959; // 深绿色
        color: #fff;
      }

      &-t {
        // font-weight: bold;
      }
    }
  }

}
</style>