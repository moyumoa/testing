<template>
  <view class="follow-btn" :class="{ 'follow-btn-active': isFollowed }" @tap.stop="toggleFollow">
    <u-icon v-if="!isFollowed" name="plus" :color="'#eee'" size="14" />
    <text class="follow-t">{{ isFollowed ? followedText : followText }}</text>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FollowBtn',
  props: {
    customerId: {
      type: [Number, String],
      default: ''
    },
    followText: {
      type: String,
      default: '关注'
    },
    followedText: {
      type: String,
      default: '已关注'
    }
  },
  data: () => ({
    relation: {}
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
    // 是否已关注
    isFollowed () {
      return !!this.relation?.attion
    },
    userId () {
      return this.getUserInfo?.id
    }
  },
  methods: {
    async getUserRelation () {
      const res = await uni.$api.userRelation({
        userId: this.userId,
        customerId: this.customerId
      })
      this.relation = res.data || {}
    },

    async toggleFollow () {
      if (this.isFollowed) {
        await uni.$api.unfollowUser({ userId: this.userId, attentionId: this.customerId })
        uni.$toast('已取消关注')
      } else {
        await uni.$api.followUser({ userId: this.userId, attentionId: this.customerId })
        uni.$toast('已关注')
      }
      this.getUserRelation()
    }
  },
  mounted () {
    this.getUserRelation()
  }
}
</script>

<style lang="scss" scoped>
.follow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #72A5FD;
  padding: 4px 12px;
  border-radius: 12px;

  .follow-t {
    font-size: 14px;
    color: #eee;
    margin-left: 4px;
  }

  &-active {
    background-color: #f0f0f0;

    .follow-t {
      color: #aaaaaa;
    }
  }
}
</style>