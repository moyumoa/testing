<template>
  <view class="pagecontainer">
    <post-temp v-for="item in paginated.data" :key="item.id" :item="item.appUserInvitationVo" @remove="removeItem" />

    <u-empty v-if="!paginated.data.length" mode="data" text="暂无数据" />
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/config/public';
import { createPaginated } from '@mvmoo/optionsapi'
import { formatNum } from '@mvmoo/us'


export default {
  data: () => ({
    paginated: null, // 分页数据
    finished: false, // 是否加载完毕
    options: {},
    relation: {},
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  async onLoad (options) {
    this.options = { ...options };
    this.paginated = createPaginated(uni.$api.favoriteList, {}, {
      ...uni.$paging,
      transformData: (rows, res, query) => {
        console.log('rows', rows)
        return rows.map(item => ({
          ...item,
          invitationId: item.coll.invitationId,
          reportId: item.coll.reportId,
          // ageGroup: this.ageGroup(item.birthday), // 年龄段
          // onlineTime: this.onlineTime(item.seconds), // 在线时间
          // authStatusTxt: { 0: '未认证', 1: '认证中', 2: '已认证', 3: '认证失败' }[item.authStatus] || '未知状态',
          // isShowbtn: item.authStatus === 3, // 是否显示修改按钮
        }))
      }
    }, 'concat')
    await this.paginated.reload({}, 1)
  },
  methods: {
    ...mapActions(['updateUserInfo']),
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


    async removeItem (item) {
      // 从列表中找到对应的项并移除
      const index = this.paginated.data.findIndex(i => i['reportId'] === item.id);
      if (index !== -1) {
        this.paginated.data.splice(index, 1);
      }
      // await uni.$api.favoriteRemove({ id: item.id })
      uni.$toast('已移除');
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
  background-color: #FAFCFE;
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