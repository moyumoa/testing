<template>
  <view class="container">
    <view class="nav" :style="{ 'padding-top': `${ptop}px` }">
      <view class="nav-l" :style="{ height: `${pheight}px`, width: `${pheight}px` }" @tap="onBack">
        <u-icon name="arrow-left" bold color="#222" size="22"></u-icon>
      </view>
      <view class="nav-c">
      </view>
      <view class="nav-l" :style="{ height: `${width}px`, width: `${pheight}px` }"></view>
    </view>

    <view class="warp"
      :style="{ background: `linear-gradient(90deg, ${hlist[hcurrent].bg[0]}, ${hlist[hcurrent].bg[1]})` }">
      <view class="pinfo" :style="{ 'padding-top': `${ptop + pheight}px` }">
        <view class="pinfo-top">
          <view class="pinfo-top-l">
            <image class="pinfo-top-l-pic" src="https://via.placeholder.com/72x72" />
          </view>
          <view class="pinfo-top-r">
            <text class="pinfo-top-r-t">这是一个昵称</text>
            <text class="pinfo-top-r-t2">Lv.1</text>
          </view>
        </view>
        <view class="pinfo-center">
          <view class="pinfo-center-item">
            <text class="pinfo-center-item-t">123</text>
            <text class="pinfo-center-item-t2">直邀拍客</text>
          </view>
          <view class="pinfo-center-item">
            <text class="pinfo-center-item-t">0</text>
            <text class="pinfo-center-item-t2">直邀总数</text>
          </view>
          <view class="pinfo-center-item">
            <text class="pinfo-center-item-t">1</text>
            <text class="pinfo-center-item-t2">团队成员</text>
          </view>
          <view class="pinfo-center-item">
            <text class="pinfo-center-item-t">0</text>
            <text class="pinfo-center-item-t2">剩余名额</text>
          </view>
        </view>
      </view>

      <view class="hswiper">
        <u-swiper :list="hlist" previousMargin="30" nextMargin="30" :circular="false" :autoplay="false" height="162px"
          imgMode="scaleToFill" bgColor="transparent" :current="hcurrent" @change="changeSwiper">
          <template v-slot:row="{ row }">
            <view class="hswiper-item">
              <view class="hswiper-item-icon">
                <image style="width: 100%;height: 100%;" src="/member/static/m-0.png" />
              </view>

              <view class="hswiper-item-dj" v-if="row.id === 2">
                <text class="hswiper-item-dj-t">当前等级</text>
              </view>

              <view class="hswiper-item-name">
                <text class="hswiper-item-name-t" :style="{ 'color': `${row.bg[2]}` }">
                  {{ row.title }}
                </text>
              </view>

              <view class="hswiper-item-btm">
                <view class="hswiper-item-btm-l">
                  <template v-if="row.id === 2">
                    <view class="hswiper-item-btm-l-top">
                      <text class="hswiper-item-btm-l-top-t">还需要直邀3个拍客</text>
                    </view>
                    <view class="hswiper-item-btm-l-center">
                      <u-line-progress :height="8" :percentage="30" :showText="false" inactiveColor="rgba(0,0,0,0.1)"
                        activeColor="#E2CCA6" />
                    </view>
                    <view class="hswiper-item-btm-l-bottom">
                      <text class="hswiper-item-btm-l-bottom-t">{{ row.title }}</text>
                      <text class="hswiper-item-btm-l-bottom-t">{{ row.title }}1</text>
                    </view>
                  </template>
                  <template v-if="row.id < 2">
                    <view class="hswiper-item-btm-l-top">
                      <text class="hswiper-item-btm-l-top-t">当前已高于该等级</text>
                    </view>
                  </template>
                </view>
                <view class="hswiper-item-btm-r" v-if="row.id >= 2">
                  <text class="hswiper-item-btm-r-t">
                    {{ row.id > 2 ? '加速升级' : '立即升级' }}
                  </text>
                </view>
              </view>
            </view>
          </template>
        </u-swiper>
      </view>

      <view class="hbox">
        <grid-qy :list="qlist" width="25%" />
      </view>
    </view>


    <view class="header">
      <view class="header-l">
        <text class="header-l-t" :class="{ 'header-l-t-active': item.index === currentPage }"
          @tap.stop="change_page(item)" v-for="item in pageTab" :key="item.index">{{ item.name }}</text>
      </view>
    </view>

    <view v-show="currentPage === 1">
      <view class="switching">
        <view class="switching-item" :class="{ 'switching-item-active': currentTab1 === item.index }"
          v-for="item in tempTab1" :key="item.index" @tap.stop="change_currentTab1(item)">
          <text class="switching-item-t">{{ item.name }}</text>
        </view>
      </view>

      <hy-cy ref="list1" :currentTab="currentTab1" />
    </view>

    <view v-show="currentPage === 2">
      <view class="pinfo-center box-bg">
        <view class="pinfo-center-item">
          <text class="pinfo-center-item-t">13</text>
          <text class="pinfo-center-item-t2">剩余拍客</text>
        </view>
        <view class="pinfo-center-item">
          <text class="pinfo-center-item-t">0</text>
          <text class="pinfo-center-item-t2">剩余拍商</text>
        </view>
        <view class="pinfo-center-item">
          <text class="pinfo-center-item-t">1</text>
          <text class="pinfo-center-item-t2">剩余运营商</text>
        </view>
      </view>

      <view class="switching">
        <view class="switching-item" :class="{ 'switching-item-active': currentTab2 === item.index }"
          v-for="item in tempTab2" :key="item.index" @tap.stop="change_currentTab2(item)">
          <text class="switching-item-t">{{ item.name }}</text>
        </view>

        <view class="switching-add" @tap.stop="buyMore">
          <text class="switching-add-t">增购</text>
          <u-icon name="plus" color="#333" size="12" />
        </view>
      </view>

      <hy-minge ref="list2" :currentTab="currentTab2" />
    </view>

  </view>
</template>

<script>
export default {
  data: () => ({
    ptop: 0,
    pheight: 0,
    hlist: [
      {
        id: 1,
        title: '普通用户',
        url: '/member/static/m-1.png',
        bg: ['#c6ccd2', '#aeb4be', '#9caabf']
      },
      {
        id: 2,
        title: '拍客',
        url: '/member/static/m-2.png',
        bg: ['#dcd7e1', '#cfc9d6', '#aba9b9']

      },
      {
        id: 3,
        title: '拍商',
        url: '/member/static/m-3.png',
        bg: ['#e5fcf2', '#dcfcee', '#9bd1c9']

      },
      {
        id: 4,
        title: '运营商',
        url: '/member/static/m-4.png',
        bg: ['#f3d6d4', '#e9b4b2', '#e3a9a7']

      },
      {
        id: 5,
        title: '服务商',
        url: '/member/static/m-5.png',
        bg: ['#f9e9c4', '#f2d49b', '#f2d59c']
      }
    ],
    hcurrent: 0,
    qlist: [
      { title: '直推奖10%', value: 1, is: true },
      { title: '直推奖10%', value: 2, is: true },
      { title: '直推奖10%', value: 3, is: true },
      { title: '直推奖10%', value: 4, is: false },
      { title: '直推奖10%', value: 5, is: false },
      { title: '直推奖10%', value: 6, is: false },
    ],

    pageTab: [{ index: 1, name: '成员' }, { index: 2, name: '名额' }],
    currentPage: 1,

    tempTab1: [{ index: 1, name: '直邀' }, { index: 2, name: '团队' }, { index: 3, name: '小部门' }],
    currentTab1: 1,

    tempTab2: [{ index: 1, name: '拍客' }, { index: 2, name: '拍商' }, { index: 3, name: '运营商' }],
    currentTab2: 1,
  }),
  onLoad () {
    //获取胶囊位置
    const { top = 0, height = 0 } = uni.getMenuButtonBoundingClientRect()
    this.ptop = top
    this.pheight = height

    this.hcurrent = 1
  },
  methods: {
    onBack () {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        });
      }
    },

    /* 切换会员 */
    changeSwiper (e) {
      this.hcurrent = e.current
    },

    /* 切换页面 */
    change_page (row) {
      // this.currentPage = this.currentPage === 1 ? 2 : 1;
      if (this.currentPage === row.index) return
      this.currentPage = row.index
      this.$refs[`list${this.currentPage}`].scrollTo()
    },

    /* 切换tab1 */
    change_currentTab1 (row) {
      this.currentTab1 = row.index
      this.$refs[`list${this.currentPage}`].scrollTo()
    },

    /* 切换tab2 */
    change_currentTab2 (row) {
      this.currentTab2 = row.index
      this.$refs[`list${this.currentPage}`].scrollTo()
    },

    /* 增购 */
    buyMore () {
      // 带输入框的弹窗
      uni.showModal({
        title: `增购${this.tempTab2[this.currentTab2 - 1].name}`,
        placeholderText: `请输入要增购${this.tempTab2[this.currentTab2 - 1].name}的数量`,
        content: '',
        confirmText: '确认增购',
        cancelText: '取消',
        editable: true,
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }
  },

  async onReachBottom () {
    this.$refs[`list${this.currentPage}`].reachBottom()
  },

  onShareAppMessage () {
    if (res.from === 'button') {// 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: '邀请有礼',	// 分享标题
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: calc(44px + env(safe-area-inset-bottom) + 10px);
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  &-l {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-c {
    flex: 1;
    flex-shrink: 0;
    text-align: center;
  }
}

.warp {
  // 渐变背景
  // background: linear-gradient(90deg, #c6ccd2, #aeb4be);
}

.pinfo {
  position: relative;
  padding: 0 16px 16px;

  &-top {
    display: flex;
    // 把内部顺序反过来
    flex-direction: row-reverse;
    padding-top: 16px;

    &-l {
      flex-shrink: 0;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #F4F4F4;

      &-pic {
        width: 100%;
        height: 100%;
      }
    }

    &-r {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      &-t {
        font-size: 20px;
        color: #333;
        font-weight: 500;
        margin-bottom: 10px;
      }

      &-t2 {
        font-size: 12px;
        color: #333;
        font-weight: 500;
        background-color: #ACB4BF;
        border-radius: 4px;
        padding: 2px 8px;
        opacity: 0.8;
      }
    }
  }

  &-center {
    display: flex;
    // justify-content: space-between;
    margin-top: 16px;

    &-item {
      flex-shrink: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      &-t {
        font-size: 18px;
        color: #333;
        font-weight: 500;
        margin-bottom: 2px;
      }

      &-t2 {
        font-size: 12px;
        color: #333;
        opacity: 0.8;
      }
    }
  }
}

.hswiper {
  height: 162px;
  // padding: 16px 0;

  &-item {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;

    &-icon {
      position: absolute;
      top: 0px;
      right: 14px;
      z-index: 9;
      width: 84px;
      height: 78px;
      animation: identifier 3s linear infinite;
    }

    @keyframes identifier {
      0% {
        transform: rotateY(0deg);
      }

      50% {
        transform: rotateY(-25deg);
      }

      100% {
        transform: rotateY(0deg);
      }
    }

    &-dj {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      width: 72px;
      height: 22px;
      border-radius: 32rpx 2px 5px;
      background: linear-gradient(90deg, #85868E, #BFC2C9);
      display: flex;
      justify-content: center;
      align-items: center;


      &-t {
        font-size: 10px;
        color: #fff;
        opacity: 0.8;
      }
    }

    &-name {
      position: absolute;
      top: 32px;
      left: 20px;
      z-index: 9;
      display: flex;

      &-t {
        font-size: 24px;
        color: #fff;
        font-weight: 500;
      }
    }

    &-btm {
      position: absolute;
      bottom: 16px;
      left: 0;
      right: 0;
      z-index: 9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;

      &-l {
        flex: 1;
        margin-right: 16px;

        &-top {
          font-size: 10px;
          color: #947641;
        }

        &-center {
          margin: 6px 0;
          border-radius: 2px;
        }

        &-bottom {
          display: flex;
          justify-content: space-between;

          &-t {
            font-size: 10px;
            color: #947641;
          }
        }

      }

      &-r {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #3A3842;
        width: 100px;
        height: 38px;
        border-radius: 20px;

        &-t {
          font-size: 13px;
          color: #FCFAE0;
          font-weight: 500;
        }
      }
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 0;

  &-l {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    width: 88px;

    &-t {
      font-size: 16px;
      color: $tc;
      opacity: 0.5;
      transition: all 0.3s;

      &-active {
        color: $tc;
        font-weight: bold;
        opacity: 1;
      }
    }
  }
}

.switching {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  margin: 12px;

  &-item {
    margin-right: 12px;
    position: relative;
    background-color: #F4F4F4;
    border-radius: 40px;
    padding: 5px 12px;
    display: flex;
    justify-content: center;
    align-items: center;

    &-icon {
      display: none;
    }

    &-t {
      font-size: 10px;
      color: #5f5f5f;
      transition: color 0.3s ease-in-out;
      transform: translate3d(0, 0, 0);
      will-change: transform;
      backface-visibility: hidden;
    }

    &-active {
      border: 0.6px solid #111;

      .switching-item-t {
        color: #161616;
        font-weight: bold;
      }
    }
  }

  &-add {
    display: flex;
    align-items: baseline;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    animation: shanshuo 1s linear infinite;
    padding: 2px 6px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;

    &-t {
      font-size: 12px;
      color: #1a1a1a;
      margin-right: 4px;
    }
  }

  @keyframes shanshuo {
    0% {
      opacity: 0.5;
    }

    50% {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.05);
    }

    100% {
      opacity: 0.5;
    }
  }

}

.box-bg {
  background-color: #ebedee;
  margin: 16px 16px 0;
  padding: 14px 0;
  border-radius: 12px;
}
</style>