<template>
  <view style="background: #fdfdfd; padding-bottom: 88px;">
    <template v-if="!loading">
      <view class="warp">
        <image :src="(detail.album && detail.album[0]) || detail.avatar" class="warp-img" mode="aspectFill" />
        <view class="warp-position">
          <view class="maintitle">
            <text class="maintitle-t">{{ detail.nickName }}</text>
            <view class="maintitle-icon" v-if="!detail.isVip">
              <image src="/static/per/hy-icon.png" />
            </view>
            <view class="maintitle-icon2" v-if="detail.isCertification">
              <image src="/static/per/p-5.png" />
              <text>已认证</text>
            </view>
          </view>
          <!-- v-if="detail.certificationType === 2" -->
          <view class="subtitle">
            <text class="subtitle-item">IP {{ detail.activeCity || '未知' }}</text>
            <text class="subtitle-item">{{ detail.ageGroup }}</text>
            <text class="subtitle-item">颜值分 {{ detail.faceScore }}</text>
            <text class="subtitle-item" :class="{ 'subtitle-item-active': detail.onlineStatus === 1 }"
              v-if="options.source === 'rz'">
              {{ detail.onlineStatus === 1 ? '当前在线' : detail.logoutTime }}
            </text>
          </view>
          <!-- v-if="detail.certificationType === 2" -->
          <view class="subtitle subtitle-row" v-if="isStore">
            <view class="subtitle-row-inner">
              <view class="subtitle-row-inner-icon">
                <image src="/static/per/p-2.png" />
              </view>
              <text class="subtitle-row-inner-t">平台认证</text>
            </view>
          </view>
        </view>
      </view>

      <view class="main">
        <view class="numerical">
          <view class="numerical-item">
            <text class="numerical-item-boldt">{{ formatNum(detail.attentionCount) }}</text>
            <text class="numerical-item-t">关注</text>
          </view>
          <view class="numerical-item">
            <text class="numerical-item-boldt">{{ formatNum(detail.fansCount) }}</text>
            <text class="numerical-item-t">粉丝</text>
          </view>
          <view class="numerical-item">
            <text class="numerical-item-boldt">{{ formatNum(detail.dealCount) }}</text>
            <text class="numerical-item-t">成交单数</text>
          </view>
        </view>

        <view class="blocktitle blocktitle-green" v-if="detail.album && detail.album.length">
          <text class="blocktitle-t">{{ whose }}相册</text>
        </view>

        <view class="album">
          <view class="album-item" v-for="(item, index) in detail.album" :key="index">
            <!-- 最多显示8张 第8张显示为查看更多 -->
            <image :src="item" class="album-item-img" mode="aspectFill" @tap="perview(item, index)" />
            <!-- <view class="album-item-mask" v-if="index === 7">
            <text class="album-item-mask-t">查看更多</text>
          </view> -->
          </view>
        </view>

        <view class="blocktitle blocktitle-yellow">
          <text class="blocktitle-t">基本信息</text>
        </view>

        <view class="blocktext">
          <text class="blocktext-t">{{ detail.remark }}</text>
        </view>

        <view class="blocktags">
          <text class="blocktags-item">身高：{{ detail.height }}cm</text>
          <text class="blocktags-item">体重：{{ detail.weight }}kg</text>
          <text class="blocktags-item">三围：{{ detail.size }}</text>
        </view>

        <view class="blocktitle blocktitle-cyan">
          <text class="blocktitle-t">服务内容</text>
        </view>

        <view class="blocktext">
          <text class="blocktext-t">{{ detail.description }}</text>
        </view>
        <view class="blocktags">
          <text class="blocktags-item blocktags-item-bg">最低消费：{{ detail.minCharge }}</text>
        </view>

        <!-- <view class="blocktlist">
        <view class="blocktlist-item">
          <text class="blocktlist-item-t1">最低消费：</text>
          <text class="blocktlist-item-t2">{{ detail.minCharge }}</text>
        </view>
        <view class="blocktlist-item">
          <text class="blocktlist-item-t1">服务内容：</text>
          <text class="blocktlist-item-t2">{{ detail.description }}</text>
        </view>
      </view> -->
        <view class="blocktgrid-infoboard blocktgrid-infoboard-bg" @tap="oper('商户详情')" v-if="options.source === 'pf'">
          <view class="blocktgrid-infoboard-box">
            <image class="blocktgrid-infoboard-box-icon" src="/static/per/p-4.png" />
            <view class="blocktgrid-infoboard-box-txts">
              <text class="blocktgrid-infoboard-box-txts-t1">{{ mcInfo.nickName }}</text>
              <text class="blocktgrid-infoboard-box-txts-t2">进入查看更多女郎</text>
            </view>
          </view>
          <u-icon name="arrow-right" color="#555" size="16" />
        </view>



        <template v-if="!['mc', 'pf'].includes(options.source)">
          <view class="blocktitle">
            <text class="blocktitle-t blocktitle-yellow">{{ whose }}动态</text>
            <u-icon name="arrow-right" color="#555" size="16" />
          </view>
          <view class="blocktgrid">
            <view class="blocktgrid-list">
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
            </view>
          </view>

          <view class="blocktitle" @tap="oper('postList')">
            <text class="blocktitle-t blocktitle-blue">{{ whose }}帖子</text>
            <u-icon name="arrow-right" color="#555" size="16" />
          </view>

          <view class="blocktgrid">
            <view class="blocktgrid-list">
              <view class="blocktgrid-list-item">
                <video class="blocktgrid-list-item-video" src=""></video>
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
              <view class="blocktgrid-list-item">
                <image class="blocktgrid-list-item-pic" src="/static/bgs/bg_chat.jpeg" />
              </view>
            </view>
          </view>
        </template>

        <view class="blocktitle">
          <text class="blocktitle-t blocktitle-yellow">{{ whose }}报告</text>
          <!-- <u-icon name="arrow-right" color="#555" size="16" /> -->
        </view>

        <view class="blocktgrid">
          <report-temp v-for="(item, index) in paginated.data" :key="item.id || index" :item="item" @remove="removeItem" />
        </view>
      </view>

      <view class="subbtns" v-if="oneself && detail.isCertification === 1 && showbtns">
        <view class="subbtns-item" @tap="oper('修改资料')">
          <text class="subbtns-item-t">修改资料</text>
        </view>
      </view>
      <view class="subbtns" v-if="!oneself && showbtns">
        <view class="subbtns-item subbtns-nobg" @tap="oper('follow')">
          <text class="subbtns-item-t">{{ relation.attion ? '已关注' : '关注' }}</text>
        </view>
        <view class="subbtns-item subbtns-nobg" @tap="oper('unlock')">
          <text class="subbtns-item-t">{{ relation.chat ? '查看联系方式' : '解锁联系方式' }}</text>
        </view>
        <view class="subbtns-item" @tap="oper('yuyue')">
          <text class="subbtns-item-t">{{ relation.order ? '查看订单' : '去预约' }}</text>
        </view>
      </view>
    </template>


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
          <view class="unlock-btns-item" @tap="oper('chat')">
            <text class="unlock-btns-item-t">去聊天</text>
          </view>
          <view class="unlock-btns-item unlock-btns-item-active" @tap="closeUnlock">
            <text class="unlock-btns-item-t">查看订单</text>
          </view>
        </view>
      </view>
    </u-popup>
    <u-loading-page :loading="loading" loading-text="loading..." font-size="14" iconSize="20"></u-loading-page>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatNum } from '@mvmoo/us'
import { createPaginated } from '@mvmoo/optionsapi'
import { userInfo } from '@/config/public';

export default {
  data: () => ({
    oneself: false, // 是否是自己
    currentNav: 1, // 当前导航
    showbtns: false, // 是否显示按钮
    isStore: false, // 是否是商户内人员
    value: 1, // 评分
    loading: true,
    statusBar: uni.getSystemInfoSync().statusBarHeight,
    paysource: '', // 支付来源
    payTxt: '',
    neededs: '', // 需要的支付方式
    showPay: false, // 是否显示支付弹窗
    showUnlock: false, // 是否显示解锁联系方式弹窗

    detail: {},
    mcInfo: {}, // 商户信息
    price: 0,

    isReservation: false, // 是否有预约订单
    reservationDeposit: 0, // 预约金
    unlockPrice: 0, // 解锁费用

    options: {},
    // 关系
    relation: {},
    paginated: null, // 分页数据
    finished: false, // 是否加载完毕
  }),

  onShow () {
    // this.getUserRelation()
  },

  async onLoad (options) {
    this.loading = true
    this.options = options;
    await ({
      'mc': () => {
        this.getDetail('mc')
        this.showbtns = false
        this.isStore = true
      },
      'pf': () => {
        this.getDetail('pf')
        this.showbtns = true
        this.isStore = true
      },
      'compensation': () => {
        this.showbtns = true
        this.isStore = true
      },
    }[options?.source] || (() => {
      this.oneself = String(this.options.userId) === String(this.getUserInfo.id)
      this.getDetail('AuthDetail')
      this.showbtns = true
      this.isStore = false
    }))?.();

    this.getUnlockPrice()
    this.getUserRelation()
    this.getReservationDeposit()

    this.paginated = createPaginated(uni.$api.reportList, { customerId: this.options.userId }, {
      ...uni.$paging,
      transformData: (rows, res, query) => {
        return rows.map(item => ({
          ...item,
          invitationId: item?.coll?.invitationId,
          reportId: item?.coll?.reportId,
        }))
      }
    }, 'concat')
    await this.paginated.reload({ }, 1)
    this.$nextTick(() => {
      this.loading = false
    })
  },

  computed: {
    ...mapGetters(['getUserInfo']),
    whose () {
      return this.oneself ? '我的' : 'Ta的'
    },
    ContactInformation () {
      return [
        { type: '手机号', value: this.detail.phone },
        { type: '微信', value: this.detail.wechat },
        { type: 'QQ', value: this.detail.qq },
        { type: '与你', value: this.detail.yuni },
        { type: 'Telegeam', value: this.detail.telegeam },
      ].filter(item => item.value) // 过滤掉没有值的联系方式
    },
  },

  methods: {
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

    formatNum (val) { return formatNum(val) },
    /* 根据传入的出生日计算年龄段 例如:85后 90后 00后 10后 */
    ageGroup (birthday) {
      const year = new Date(birthday).getFullYear();
      if (isNaN(year)) return '未知';
      const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
      return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
    },
    // 获取自己与他人的关系
    async getUserRelation () {
      const params = {
        userId: this.getUserInfo.id,
        customerId: this.options.userId,
        ...(this.options.source === 'pf' && { productId: this.options.productId })
      }
      const res = await uni.$api.userRelation(params)
      // console.log('获取自己与他人的关系', res)
      this.relation = res.data || {}
    },

    // 获取预约金
    async getReservationDeposit () {
      const res = await uni.$api.getUnlockPrice();
      this.reservationDeposit = Number(res.msg);
    },

    /* 预览图片 */
    perview (item, index) { uni.previewImage({ current: index, urls: this.detail.album }) },

    getDetail (type) {
      ({
        AuthDetail: () => {
          this.getAuthDetail()
        },
        mc: async () => {
          const res = await uni.$api.authDetailById({ id: this.options.id })
          this.detail = {
            ...res.data,
            album: res.data.images?.split(',') || [],
            dealCount: formatNum(res.data.dealCount) || 0,
            fansCount: formatNum(res.data.fansCount) || 0,
            attentionCount: formatNum(res.data.attentionCount) || 0,
            ageGroup: this.ageGroup(res.data.birthday)
          }
        },
        pf: async () => {
          const res = await uni.$api.authDetailById({ id: this.options.id })
          this.detail = {
            ...res.data,
            album: res.data.images?.split(',') || [],
            dealCount: formatNum(res.data.dealCount) || 0,
            fansCount: formatNum(res.data.fansCount) || 0,
            attentionCount: formatNum(res.data.attentionCount) || 0,
            ageGroup: this.ageGroup(res.data.birthday)
          }
          this.getMcInfo()
        }
      }[type] || (() => {
        console.warn(`未定义的详情类型: ${type}`);
      }))?.();
    },
    // 获取认证详情
    async getAuthDetail () {
      const res = await uni.$api.authDetail({ userId: this.options.userId })
      this.detail = {
        ...res.data,
        // album最多显示8张图片
        album: res.data.images?.split(',') || [],
        // album: res.data.images?.split(',') || [],
        dealCount: formatNum(res.data.dealCount),
        fansCount: formatNum(res.data.fansCount),
        attentionCount: formatNum(res.data.attentionCount),
        ageGroup: this.ageGroup(res.data.birthday),
        userId: res.data.id
      }
    },

    /* 获取商户信息 */
    async getMcInfo () {
      const res = await uni.$api.userInfo({ userId: this.options.userId });
      this.mcInfo = res.data || {};
    },

    /* 获取解锁费用 */
    async getUnlockPrice () {
      const res = await uni.$api.unlockPrice();
      console.log('解锁费用', res);
      this.unlockPrice = Number(res.msg);
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
        'reservation': async () => {
          await uni.$api.reservationOrder({
            userId: this.getUserInfo.id,
            customerId: this.detail.userId,
            amount,
            payType,
            ...(this.options.source === 'pf' && { productId: this.detail.id })
          }).then(async res => {
            console.log('预约成功', res)
            uni.$toast('预约成功')
            this.showPay = false;
          }).catch(err => {
            console.error('预约失败', err)
            this.showPay = false;
            uni.$toast('预约失败，请稍后再试')
          })
        }
      }[this.paysource] || (() => {
        console.warn(`未定义的支付来源: ${this.paysource}`);
      }))?.();

      this.paysource = ''; // 重置支付来源
      this.price = 0; // 重置价格
      this.neededs = ''; // 重置需要的支付方式
      this.payTxt = ''; // 重置支付文本
      await new Promise(resolve => setTimeout(resolve, 500));
      await this.getUserRelation()
      await this.getAuthDetail() // 刷新认证详情

    },

    // 去聊天
    naviChat (item) {
      uni.navigateTo({
        url: `/pages/message/chat?channelID=${item.imUid}&channelType=1`
      })
    },

    // oper操作
    oper (val) {
      ({
        '修改资料': () => {
          // 跳转到修改资料页面
          uni.navigateTo({ url: `/pages/certification/individual` })
        },
        '商户详情': () => {
          // 跳转到商户详情
          uni.navigateTo({ url: `/pages/merchant/detail?userId=${this.options.mcId}` })
        },
        'postList': () => {
          // 跳转到帖子列表
          uni.navigateTo({ url: `/pages/others/post?userId=${this.options.userId}` })
        },
        'follow': async () => {
          // 已关注就取消关注 未关注就关注
          if (this.relation?.attion) {
            await uni.$api.unfollowUser({ userId: this.getUserInfo.id, attentionId: this.options.userId })
          } else {
            await uni.$api.followUser({ userId: this.getUserInfo.id, attentionId: this.options.userId })
          }

          this.$set(this.relation, 'attion', !this.relation.attion)
          uni.$toast(this.relation.attion ? '已关注' : '已取消关注')
          this.getAuthDetail()
        },
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
        'yuyue': async () => {
          if (this.relation.order) {
            // 查看预约订单
            uni.navigateTo({ url: `/pages/order/reservation?userId=${this.options.userId}` })
            return
          }
          this.paysource = 'reservation' // 设置支付来源
          this.price = this.reservationDeposit // 预约金
          this.neededs = '4'
          this.payTxt = '立即预约'
          this.showPay = true
        },
        'chat': () => {
          // 去聊天
          this.naviChat(this.detail)
          this.closeUnlock()
        },
      }[val] || (() => {
        console.warn(`未定义的操作: ${val}`);
      }))?.();
    },

  },

  // 下拉刷新
  onPullDownRefresh () {
  },

  // 上拉加载
  onReachBottom () {
    console.log('上拉加载')
  }

}
</script>
<style lang="scss" scoped>
.warp {
  position: relative;
  aspect-ratio: 1 / 1;

  &-img {
    width: 100%;
    height: 100%;
  }

  &-position {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    padding: 16px 16px calc(16px + 3px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    // 从上往下渐变
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.15) 100%);
  }

  .maintitle {
    display: flex;
    align-items: center;

    &-t {
      font-size: 16px;
      color: #fff;
      font-weight: bold;
    }

    &-icon {
      width: 16px;
      height: 18px;
      margin-left: 8px;

      image {
        width: 100%;
        height: 100%;
      }
    }

    &-icon2 {
      background-color: rgba(255, 255, 255, 0.82);
      border-radius: 20px;
      font-size: 10px;
      color: #7495e7;
      padding: 1px 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      margin-left: 8px;
      transform: translateY(-1px);

      image {
        width: 10px;
        height: 11px;
        margin-right: 4px;
      }
    }
  }

  .subtitle {
    margin: 8px 0 8px;
    display: flex;
    align-items: center;

    &-item {
      margin-right: 8px;
      color: #fff;
      font-size: 12px;
      display: flex;
      align-items: center;


      &:nth-child(2) {
        padding: 1px 6px;
        border-radius: 16px;
        font-size: 10px;
        background: linear-gradient(135deg, #83e0ff, #4bbaff);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      }

      &:nth-child(3) {
        padding: 1px 6px;
        border-radius: 16px;
        font-size: 10px;
        background: linear-gradient(135deg, #ffbec8, #FF69B4);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      }

      &:nth-child(4) {
        padding: 1px 6px;
        border-radius: 16px;
        font-size: 10px;
        background-color: rgba(0, 0, 0, 0.72);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      }

      &-active {

        // 用伪类在前面加一个绿色原点
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #39f133;
          border-radius: 50%;
          margin-right: 4px;
        }
      }
    }

    &-row {
      margin-top: 0;

      &-inner {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.35);
        border-radius: 24px;
        padding: 1px 6px;
        position: relative;

        &-t {
          font-size: 11px;
          color: #fff;
          margin-left: 12px;
        }

        &-icon {
          position: absolute;
          top: 50%;
          left: -7px;
          transform: translateY(-50%);
          z-index: 2;
          width: 22px;
          height: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 4px;
          background-color: rgba(255, 255, 255, 1);
          border-radius: 50%;

          image {
            width: 12px;
            height: 14px;
          }
        }
      }


    }

  }
}

.main {
  padding: 0 16px;
  background-color: #fff;
  position: relative;
  z-index: 3;
  border-radius: 16px 16px 0 0;
  transform: translateY(-18px);
}

.numerical {
  display: flex;
  padding: 8px 0 0;

  &-item {
    // text-align: center;
    margin-right: 16px;
    display: flex;
    align-items: baseline;

    &-boldt {
      font-size: 20px;
      color: #333;
      font-weight: bold;
      margin-right: 6px;
    }

    &-t {
      font-size: 11px;
      color: #818181;
    }
  }
}

.blocktitle {
  position: relative;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-green {
    text-shadow: 2px 2px 6px rgba(115, 255, 117, 0.8);
  }

  &-yellow {
    text-shadow: 2px 2px 6px rgba(255, 238, 52, 0.8);
  }

  &-blue {
    text-shadow: 2px 2px 6px rgba(52, 204, 255, 0.8);
  }

  &-purple {
    text-shadow: 2px 2px 6px rgba(157, 52, 255, 0.8);
  }

  &-cyan {
    text-shadow: 2px 2px 6px rgba(52, 255, 255, 0.8);
  }

  &-t {
    font-size: 16px;
    color: #1a1a1a;
  }
}

.blocktext {
  font-size: 14px;
  color: #666;
  line-height: 1.5;

  &-t {
    margin-bottom: 8px;
    color: #7d7d7d;
  }

  &-t2 {
    color: #999;
    font-size: 12px;
  }
}

.blocktlist {
  display: flex;
  flex-wrap: wrap;

  &-item {
    margin-bottom: 4px;

    &-t1 {
      font-size: 14px;
      color: #666;
    }

    &-t2 {
      font-size: 14px;
      color: #232323;
    }
  }
}

.blocktags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;

  &-item {
    padding: 4px 8px;
    border: 1px solid #efefef;
    border-radius: 16px;
    font-size: 12px;
    color: #666;

    &-bg {
      color: #d88fdc;
      background-color: #f7f7f2;
      border: none;
    }
  }
}



.album {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &-item {
    width: calc(25% - 6px);
    aspect-ratio: 1 / 1;
    position: relative;
    overflow: hidden;
    border-radius: 5px;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.1);
    }

    &-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 12px;
    }
  }
}

.blocktgrid {
  margin: 0 0 16px;
  // padding-bottom: 20px;
  background-color: #fff;
  // border-bottom: 1px solid #eee;

  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    &-item {
      width: calc(25% - 6px);
      aspect-ratio: 1 / 1;
      position: relative;
      overflow: hidden;
      border-radius: 5px;

      &-pic {
        width: 100%;
        height: 100%;
      }
    }
  }

  &-items {
    padding: 16px 0;
    border-bottom: 1px dashed #eee;
    position: relative;

    &-positiont {
      position: absolute;
      top: 32px;
      right: 16px;
      font-size: 16px;
      color: rgba(255, 96, 101, 1);
      transform: rotate(45deg);
    }

    &-positionicon {
      position: absolute;
      top: 82px;
      right: 16px;
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
