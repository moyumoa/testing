<template>
  <view class="pagecontainer">

    <u-sticky v-if="options.source === 'self'">
      <u-tabs class="tabclass" :list="tabList" @click="changeTab" lineWidth="36" activeStyle="color: #3c9cff;" />
    </u-sticky>


    <template v-if="paginated">
      <template v-if="currentNav === 1">
        <post-temp v-for="item in paginated.data" :key="item.id" :item="item" />
      </template>
      <template v-if="currentNav === 3">
        <dynamic-temp v-for="item in paginated.data" :key="item.id" :item="item" />
      </template>
      <template v-if="currentNav === 2">
        <report-temp v-for="item in paginated.data" :key="item.id" :item="item" />
      </template>
    </template>

    <u-empty v-if="paginated && !paginated.data.length" mode="data" text="暂无数据" />
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { createPaginated } from '@mvmoo/optionsapi'
import { formatNum } from '@mvmoo/us'


export default {
  data: () => ({
    currentNav: -1, // 当前选中的导航
    finished: false, // 是否加载完毕
    options: {},
    mcInfo: {},
    tabList: [
      { name: '帖子', id: 1 },
      { name: '动态', id: 3 },
      { name: '报告', id: 2 },
    ],
    relation: {},
  }),
  computed: {
    ...mapGetters(['getUserInfo', 'paginated', 'paginatedFinished']),
  },
  watch: {
    async currentNav (val) {
      console.log('切换tab', val);
      const params = { userId: this.getUserInfo.id, }
      // checkStatus: 1
      await ({
        1: async () => {
          this.initPaginated(createPaginated(uni.$api.postList, params, {
            ...uni.$paging,
            transformData: (rows, res, query) => rows.map(item => ({
              ...item,
              id: item.id,
              images: item.images ? item?.images?.split(',') : [],
            }))
          }, 'concat'))
        },
        3: () => {
          this.initPaginated(createPaginated(uni.$api.dynamicList, params, {
            ...uni.$paging,
            transformData: (rows, res, query) => rows.map(item => ({
              ...item,
              id: item.appUserDynamic.id,
              images: item.appUserDynamic.images ? item?.appUserDynamic?.images?.split(',') : [],
            }))
          }, 'concat'))
        },
        2: async () => {
          this.initPaginated(createPaginated(uni.$api.reportList, params, {
            ...uni.$paging,
            defaultPagination: { page: 1, limit: 5 },
            transformData: (rows, res, query) => rows.map(item => ({
              ...item,
              id: item.appUserReport.id,
              images: item.images ? item?.images?.split(',') : [],
            }))
          }, 'concat'))
        },

      }[val]?.())
      this.paginated.reload({}, 1)
    }
  },
  async onLoad (options) {
    if (options.source === 'mc') {
      uni.setNavigationBarTitle({ title: options.tt || '' })
      this.currentNav = Number(options.n)
    } else {
      this.currentNav = 1
    }
    this.options = { ...options };

  },
  methods: {
    ...mapActions(['updateUserInfo', 'initPaginated']),
    formatNum (num) { return formatNum(num) },
    /* 根据传入的出生日计算年龄段 例如:85后 90后 00后 10后 */
    ageGroup (birthday) {
      const year = new Date(birthday).getFullYear();
      if (isNaN(year)) return '未知';
      const groupBase = Math.floor(year / 5) * 5; // 向下取整至5的倍数
      return `${String(groupBase).slice(-2)}后`; // 取后两位 + '后'
    },

    /* 根据秒数计算在线时间分钟/小时/天数 */
    onlineTime (Second) {
      if (Second < 60) return `${Second}秒`;
      if (Second < 3600) return `${Math.floor(Second / 60)}分钟`;
      if (Second < 86400) return `${Math.floor(Second / 3600)}小时`;
      return `${Math.floor(Second / 86400)}天`;
    },

    /* 切换tab */
    changeTab (tab) {
      this.currentNav = tab.id;
    },


  },
  async onReachBottom () {
    const { page, limit, total, count } = this.paginated.pagination
    if (count < limit) return
    this.paginated.onChangePage(page + 1, limit)
  },
}
</script>

<style>
page {
  background: #FAFCFE;
}
</style>

<style lang="scss" scoped>
.pagecontainer {
  padding-bottom: calc(44px + env(safe-area-inset-bottom));
}

.tabclass {
  position: sticky;
  top: 0;
  background-color: #FAFCFE;

  // 居中显示
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>