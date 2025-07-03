<template>
  <view>
    <!-- <tui-slide-view :showMask="true" :buttons="buttons" @click="handleClick($event, item)"
      v-for="(item, index) in imList" :key="item.channel.channelID"> -->
      <view class="list-cell"  v-for="(item, index) in imList" :key="item.channel.channelID" @tap="toChat(item.channel)">
        <view class="list-cell-avatar">
          <image class="avatar" :src="item.channel.avatar || '/static/logo.png'" mode="aspectFill"></image>
        </view>
        <view class="list-cell-content">
          <view class="list-cell-content-title">
            <text class="list-cell-content-title-name" v-if="getImUserInfo(item.channel)">
              {{ getImUserInfo(item.channel).name }}
            </text>
            <text class="list-cell-content-title-time">
              {{ formatTime(item.timestamp) }}
            </text>
          </view>
          <view class="list-cell-content-message">
            <text class="list-cell-content-message-info">
              {{ (item.lastMessage.content.text || '无消息').replace(/\n/g, ' ') }}
            </text>
            <text class="list-cell-content-message-badge" v-if="item.unread">{{ item.unread }}</text>
          </view>
        </view>
      </view>
    <!-- </tui-slide-view> -->

  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatSmartTime } from '@mvmoo/us'

export default {
  data: () => ({
    buttons: [
      {
        text: '删除',
        color: '#fff',
        background: '#FA5151'
      }
    ]
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
    imList () {
      return this.$im?.conversations || []
    }
  },
  onLoad () {
    // console.log('页面加载，获取用户信息', JSON.stringify(this.getUserInfo, null, 2))
    // 页面加载时可以获取用户信息
    if (this.$im.ready) {
      console.log('已连接，显示会话');
    } else {
      console.log('还未连接完毕')
    }
    console.log('im信息', this.$im?.conversations)
    console.log('im信息====', this.imList)
  },
  methods: {
    ...mapActions(['updateUserInfo']),  // 映射 action

    formatTime (time) {
      return formatSmartTime(time)
    },

    getImUserInfo (channel) {
      const info = this.$im.sdk.channelManager.getChannelInfo(channel)
      // const info = this.$im.sdk.channelManager.fetchChannelInfo(channel)
      return info ? { name: info.title, avatar: info.logo } : {}

      // if (info) {
      //   return { name: info.title, avatar: info.logo }
      // }
      // uni.$api.getImUser(channel.channelID).then(user => {
      //   console.log('获取用户信息成功', user)
      //   // 更新缓存
      //   this.$im.sdk.channelManager.setChannleInfoForCache(Convert.userToChannelInfo(user))
      // }).catch(err => {
      //   console.error('获取用户信息失败', err)
      // })

      // return { name: '', avatar: '' }
      // // 如果没有缓存信息，则尝试从服务器获取
      // const user = await uni.$api.getImUser(channel.channelID)
      // console.log('获取用户信息成功', user)
      // // 更新缓存
      // this.$im.sdk.channelManager.setChannleInfoForCache(Convert.userToChannelInfo(user))
      // return { name: user.name, avatar: user.avatar || '/static/logo.png' }
    },
    imUserInfo (channel) {
      const channelID = `${channel.channelID}-${channel.channelType}`
      // console.log(`获取用户信息：`, this.$im.sdk.channelManager.channelInfocacheMap[channelID])
      const info = this.$im.sdk.channelManager.channelInfocacheMap[channelID]
      return info ? { name: info.title, avatar: info.logo } : {}
    },
    handleClick (e, data) {
      console.log(e, data)
      let index = Number(e.index)
      console.log(`你点击了：${this.buttons[index].text}`)
    },
    toChat (channel) {
      console.log('跳转到聊天页面', channel)
      uni.navigateTo({
        url: `/pages/message/chat?channelID=${channel.channelID}&channelType=${channel.channelType}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-cell {
  display: flex;
  align-items: center;
  padding: 12px;
  height: 44px;
  border-bottom: 1px solid #eee;


  &-avatar {
    margin-right: 10px;
    width: 44px;
    height: 44px;

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  &-content {
    flex: 1;

    &-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      &-name {
        font-size: 16px;
        flex: 1;
        width: 0;
        margin-right: 8px;
      }

      &-time {
        flex-shrink: 0;
        color: #b5b5b5;
        font-size: 12px;
      }
    }

    &-message {
      display: flex;
      justify-content: space-between;

      &-info {
        flex: 1;
        width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
        font-size: 14px;
        margin-right: 8px;
      }

      &-badge {
        flex-shrink: 0;
        background-color: #ff0000;
        color: #fff;
        border-radius: 50%;
        font-size: 12px;
        min-width: 12px;
        height: 12px;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>