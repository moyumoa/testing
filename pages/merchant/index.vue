<template>
  <view class="containerwarp">
    <view class="pinfo">
      <view class="pinfo-top">
        <view class="pinfo-top-l">
          <image class="pinfo-top-l-pic" :src="getUserInfo.avatar" />
        </view>
        <view class="pinfo-top-r">
          <text class="pinfo-top-r-t">{{ getUserInfo.nickName }}</text>
          <view class="pinfo-top-r-t2">粉丝: {{ formatNum(getUserInfo.fansCount) }}</view>
          <view class="pinfo-top-r-t2">店铺简介: {{ getUserInfo.remark || '无' }}</view>
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="pbox">
        <view class="pbox-head" @tap="oper('ulist')">
          <text class="pbox-head-t">店铺橱窗</text>
          <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
        </view>
        <scroll-view scroll-x class="scroll-view">
          <view class="pbox-body" v-if="list1.length > 0">
            <view class="pbox-body-item" v-for="(item, index) in list1" :key="index">
              <image class="pbox-body-item-avatar" :src="item.avatar" />
            </view>
          </view>
          <view v-else class="pbox-body-empty">暂无妹子</view>
        </scroll-view>
      </view>

      <view class="pbox">
        <view class="pbox-head" @tap="navito('dynamic')">
          <text class="pbox-head-t">动态</text>
          <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
        </view>
        <scroll-view scroll-x class="scroll-view">
          <view class="pbox-body">
            <template v-if="list2.length">
              <view class="pbox-body-content" v-for="(item, index) in list2" :key="index">
                <image class="pbox-body-content-bg" :src="item.firstImage" />
                <view class="pbox-body-content-position">
                  <view class="pbox-body-content-position-top">
                    <image class="pbox-body-content-position-top-avatar" :src="item.avatar" />
                    <view class="pbox-body-content-position-top-info">
                      <text class="pbox-body-content-position-top-info-t">昵称</text>
                      <text class="pbox-body-content-position-top-info-t2">{{ item.createTime }}</text>
                    </view>
                  </view>
                  <view class="pbox-body-content-position-bottom">
                    <text class="pbox-body-content-position-bottom-t">{{ item.description }}</text>
                  </view>
                </view>
              </view>
            </template>

            <view v-else class="pbox-body-empty">暂无妹子</view>

          </view>
        </scroll-view>
      </view>

      <view class="pbox">
        <view class="pbox-head" @tap="navito('post')">
          <text class="pbox-head-t">帖子</text>
          <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
        </view>
        <scroll-view scroll-x class="scroll-view">
          <view class="pbox-limgrtxt">
            <template v-if="list3.length">
              <view class="pbox-limgrtxt-item" v-for="(item, index) in list3" :key="index">
                <image class="pbox-limgrtxt-item-limg" :src="item.firstImage" v-if="item.firstImage" />
                <view class="pbox-limgrtxt-item-content">
                  <text class="pbox-limgrtxt-item-content-t">{{ item.title }}</text>
                  <view class="pbox-limgrtxt-item-content-center">
                    {{ item.description }}
                  </view>
                  <text class="pbox-limgrtxt-item-content-bottom">
                    发布时间: {{ item.createTime }}
                  </text>
                </view>
              </view>
            </template>

            <view v-else class="pbox-body-empty">暂无妹子</view>

          </view>
        </scroll-view>
      </view>

      <view class="pbox">
        <view class="pbox-head" @tap="navito('nvl')">
          <text class="pbox-head-t">女郎认证列表</text>
          <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
        </view>
        <scroll-view scroll-x class="scroll-view">
          <view class="pbox-body" v-if="list4.length > 0">
            <view class="pbox-body-item" v-for="(item, index) in list4" :key="index">
              <image class="pbox-body-item-avatar" :src="item.avatar" />
            </view>
          </view>
          <view v-else class="pbox-body-empty">暂无妹子</view>
        </scroll-view>
      </view>
    </view>

    <view class="subbtns">
      <view class="subbtns-item" :class="{ 'subbtns-item-disabled': getUserInfo.createCount < 1 }"
        @tap="oper('record')">
        <text class="subbtns-item-t">
          去发布(剩余{{ getUserInfo.createCount || 0 }}次)
          <!-- getUserInfo.putAwayCount上架次数 -->
        </text>
      </view>
    </view>

    <t-pay-way :payPrice="current.payAccount" :show="showPay" @close="showPay = false" @pay="submitPay" />

  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { createPaginated } from '@mvmoo/optionsapi'
import { formatNum } from '@mvmoo/us'

export default {
  data: () => ({
    showPay: false,
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    current: {},
    finished: false,
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onShow () {
    await userInfo()
  },
  async onLoad () {
    console.log('--', JSON.stringify(this.getUserInfo, null, 2))
    this.getAuthListByShop()
    this.getDynamicList()
    this.getPostList()
    this.getAuthList()
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    formatNum (num) { return formatNum(num) },

    // 获取女郎列表
    async getAuthListByShop () {
      const res = await uni.$api.authListByShop({ pageNum: 1, pageSize: 10, userId: this.getUserInfo.id });
      console.log('店铺橱窗', res);
      this.list1 = res.rows || [];
      // this.selectType(this.rowData[0], 0);
    },

    // 获取动态列表
    async getDynamicList () {
      const res = await uni.$api.dynamicList({ pageNum: 1, pageSize: 10, userId: this.getUserInfo.id });
      const repdata = res.rows.map(item => ({
        ...item,
        avatar: item.appUser.avatar,
        createTime: item.appUserDynamic.createTime,
        firstImage: item?.appUserDynamic?.images ? item?.appUserDynamic?.images?.split(',')?.[0] : item.appUser.avatar || '',
        description: item.appUserDynamic.description,
        id: item.appUserDynamic.id,
      }));
      console.log('动态列表', res);
      this.list2 = repdata || [];
    },

    // 获取帖子列表
    async getPostList () {
      const res = await uni.$api.postList({ pageNum: 1, pageSize: 10, userId: this.getUserInfo.id })
      const repdata = res.rows.map(item => ({
        ...item,
        firstImage: item.images ? item?.images?.split(',')?.[0] : '',
      }));
      console.log('帖子列表', res);
      this.list3 = repdata || [];
    },

    // 获取女郎认证列表
    async getAuthList () {
      const res = await uni.$api.authListShop({ pageNum: 1, pageSize: 10, userId: this.getUserInfo.id });
      console.log('女郎认证列表', res);
      this.list4 = res.rows || [];
    },

    navito (type) {
      ({
        dynamic: () => {
          uni.navigateTo({ url: '/pages/personal/release/list?source=mc&n=3&tt=动态列表' });
        },
        post: () => {
         uni.navigateTo({ url: '/pages/personal/release/list?source=mc&n=1&tt=帖子列表' });
        },
        nvl: () => {
          uni.navigateTo({ url: '/pages/merchant/nvl' });
        }
      })[type]?.();
    },

    oper (type, value) {
      ({
        ulist: () => {
          uni.navigateTo({ url: '/pages/merchant/shopUserList' });
        },
        pay: () => {
          this.showPay = true;
        },
        record: () => {
          if (this.getUserInfo.createCount < 1) {
            uni.$toast('没有剩余发布次数');
            return;
          }
          uni.navigateTo({ url: '/pages/personal/info?source=2&title=发布女郎' });
        }
      })[type]?.(value);
    }

  }
}
</script>

<style lang="scss" scoped>
.containerwarp {
  background-color: $bgc;
  padding-bottom: calc(32px + env(safe-area-inset-bottom));
}

.pinfo {
  position: relative;
  padding: 32px 14px 16px;

  &-top {
    position: relative;
    display: flex;
    z-index: 3;

    &-l {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      border: 1px solid #fff;
      box-sizing: border-box;
      box-shadow: 0 2px 8px 12px rgba(0, 0, 0, 0.05);

      &-pic {
        width: 100%;
        height: 100%;
      }
    }

    &-r {
      display: flex;
      flex-direction: column;
      justify-content: center;

      &-t {
        font-size: 14px;
        color: #1a1a1a;
      }

      &-t2 {
        font-size: 12px;
        color: #333;
        margin-top: 5px;
        opacity: 0.8;
      }
    }

    &-position {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #efeeee;
      padding: 4px 12px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-t {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
  }

  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding: 0 4px;

    &-text {
      font-size: 13px;
      color: #333;
      opacity: 0.8;
    }
  }

  &-center {
    display: flex;
    // justify-content: space-between;
    // margin-top: 16px;

    padding: 16px 0;

    &-item {
      flex-shrink: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      &-t {
        font-size: 18px;
        color: #555;
        font-weight: 500;
        margin-bottom: 2px;
      }

      &-t2 {
        font-size: 12px;
        color: #555;
        opacity: 0.5;
      }
    }
  }
}

.panel {
  margin: 0 0 16px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background-color: #fff;
}

.pbox {
  background-color: #fff;
  margin-bottom: 16px;

  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    // border-bottom: 1px solid #f5f5f5;

    &-t {
      font-size: 15px;
      color: #333;
      font-weight: bold;
    }
  }

  &-body {
    padding: 16px;
    font-size: 14px;
    color: #666;
    display: flex;

    &-empty {
      flex: 1;
      text-align: center;
      color: #999;
      font-size: 14px;
      margin: 32px 16px 16px;
    }


    &-item {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      margin-right: 10px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      background-color: #f5f5f5;

      &-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-content {
      position: relative;
      flex-shrink: 0;
      width: 168px;
      height: auto;
      // 自动3:4
      aspect-ratio: 3 / 4;
      border-radius: 12px;
      margin-right: 12px;
      overflow: hidden;

      &-bg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &-position {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        // 上中下渐变 顶部和底部0.3透明度 中间完全透明
        background: linear-gradient(to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0) 35%,
            rgba(0, 0, 0, 0) 65%,
            rgba(0, 0, 0, 0.3) 100%);
        padding: 12px;
        box-sizing: border-box;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &-top {
          display: flex;
          align-items: center;

          &-avatar {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            border: 1px solid #fff;
            box-sizing: border-box;
            border-radius: 50%;
            margin-right: 8px;
            object-fit: cover;
          }

          &-info {
            width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;

            &-t {
              font-size: 12px;
              color: #fff;
              opacity: 0.9;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            &-t2 {
              font-size: 10px;
              color: #fff;
              opacity: 0.8;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        &-bottom {

          &-t {
            font-size: 12px;
            color: #fff;
            opacity: 0.82;
            // 最多显示两行
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            /* 显示两行 */
            -webkit-box-orient: vertical;
            /* 必须设置 */
          }
        }
      }

    }
  }

  &-limgrtxt {
    padding: 16px;
    display: flex;
    flex-wrap: nowrap;

    &-item {
      flex-shrink: 0;
      display: flex;
      width: 80dvw;

      margin-right: 12px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;

      background-color: #f5f5f5;
      padding: 12px;

      &-limg {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 12px;
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
  }
}
</style>