<template>
  <view class="containerwarp">

    <view class="panel">

      <view class="pbox">
        <view class="pbox-head" @tap="navito('post')">
          <text class="pbox-head-t">帖子</text>
          <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
        </view>
        <scroll-view scroll-x class="scroll-view">
          <view class="pbox-limgrtxt">
            <template v-if="list1.length">
              <view class="pbox-limgrtxt-item" v-for="(item, index) in list1" :key="index">
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

            <view v-else class="pbox-body-empty">暂无内容</view>

          </view>
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
            <view v-else class="pbox-body-empty">暂无内容</view>
          </view>
        </scroll-view>
      </view>

      <view class="pbox">
        <view class="pbox-head" @tap="navito('report')">
          <text class="pbox-head-t">报告</text>
          <u-icon name="arrow-right" size="16" color="#bbb" class="tpers-panel-uinfo-icon-r" />
        </view>
        <scroll-view scroll-x class="scroll-view">
          <view class="pbox-body">
            <template v-if="list3.length">
              <view class="pbox-body-content" v-for="(item, index) in list3" :key="index">
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
            <view v-else class="pbox-body-empty">暂无内容</view>
          </view>
        </scroll-view>
      </view>

    </view>

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
    this.getDynamicList()
    this.getPostList()
    this.getReportList()
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    formatNum (num) { return formatNum(num) },

    // 获取帖子列表
    async getPostList () {
      const res = await uni.$api.postList({ pageNum: 1, pageSize: 10 })
      const repdata = res.rows.map(item => ({
        ...item,
        firstImage: item.images ? item?.images?.split(',')?.[0] : '',
      }));
      console.log('帖子列表', res);
      this.list1 = repdata || [];
    },

    // 获取动态列表
    async getDynamicList () {
      const res = await uni.$api.dynamicList({ pageNum: 1, pageSize: 10 });
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

    // 获取报告列表
    async getReportList () {
      const res = await uni.$api.reportList({ pageNum: 1, pageSize: 10 });
      const repdata = res.rows.map(item => ({
        ...item,
        avatar: item.appUser.avatar,
        createTime: item.appUserReport.createTime,
        firstImage: item.images ? item?.images?.split(',')?.[0] : item.appUserReport.customerImg || item.appUser.avatar || '',
        description: item.appUserReport.desription,
        id: item.appUserReport.id,
      }));
      console.log('报告列表', res);
      this.list3 = repdata || [];
    },

    navito (type) {
      ({
        dynamic: () => {
          uni.navigateTo({ url: '/pages/personal/release/list?source=sq&n=3&tt=动态' });
        },
        post: () => {
          uni.navigateTo({ url: '/pages/personal/release/list?source=sq&n=1&tt=帖子' });
        },
        report: () => {
          uni.navigateTo({ url: '/pages/personal/release/list?source=sq&n=2&tt=报告' });
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