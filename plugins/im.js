// plugins/im.js
import Vue from 'vue'
import { WKSDK, ConversationAction } from 'wukongimjssdk'
import { Convert } from './funcs/Convert.ts'

const im = Vue.observable({
  sdk: WKSDK.shared(),
  ready: false,
  conversations: []
})

const imPlugin = {
  install (Vue) {
    const sdk = im.sdk

    im.init = async (userInfo) => {
      if (!userInfo?.uid || !userInfo?.token) return

      sdk.config.addr = 'ws://192.168.9.99:5200'
      sdk.config.uid = userInfo.uid
      sdk.config.token = userInfo.token

      const handleStatus = (status, reason) => {
        if (status === 1) {
          console.log('✅ 已连接')
          im.ready = true
          im.syncConversations()
        } else {
          console.error('⚠️ 连接失败', reason)
          im.ready = false
        }
      }

      sdk.connectManager.connect()
      sdk.connectManager.addConnectStatusListener(handleStatus)
    }

    im.syncConversations = async () => {
      const resp = await uni.$api.conversation({ msg_count: 1 })
      if (resp) {
        const list = resp.conversations.map(Convert.toConversation)

        im.conversations.splice(0, im.conversations.length, ...list)

        const users = resp.users || []
        users.forEach(user =>
          sdk.channelManager.setChannleInfoForCache(Convert.userToChannelInfo(user))
        )

        const groups = resp.groups || []
        groups.forEach(group =>
          sdk.channelManager.setChannleInfoForCache(Convert.groupToChannelInfo(group))
        )
      }
    }

    im.fetchMessages = async (channelID, channelType, count = 20) => {
      const channel = { channelID, channelType }
      const messages = await sdk.messageManager.getWithLimit(channel, count)
      console.log(`📩 获取消息 [${channelID}]`, messages)
      return messages
    }

    // sdk.chatManager.addMessageListener((message) => {
    //   const myUID = sdk.config.uid

    //   // 查找现有会话
    //   const conv = im.conversations.find(c =>
    //     c.channel.channelID === message.channel.channelID &&
    //     c.channel.channelType === message.channel.channelType
    //   )
    //   if (conv) {
    //     conv.lastMessage = message
    //     conv.timestamp = message.timestamp
    //   } else {
    //     // 创建新的会话
    //     const newConv = Convert.toConversation({
    //       channel_id: message.channel.channelID,
    //       channel_type: message.channel.channelType,
    //       timestamp: message.timestamp,
    //       recents: [message],
    //       unread: 1
    //     })
    //     im.conversations.unshift(newConv)
    //   }

    //   if (message.fromUID === myUID) {
    //     console.log('✅ 我发出的消息：', message)
    //   } else {
    //     console.log('📥 收到别人的消息：', message)
    //   }
    // })
    sdk.conversationManager.addConversationListener((conv, action) => {
      console.log(`📬 会话变更: ${action}`, conv)
      const { channelID, channelType } = conv.channel
      // const channelInfo = sdk.channelManager.getChannelInfo(conv.channel)
      // sdk.channelManager.fetchChannelInfo(conv.channel)

      // console.log('====查询频道信息====', channelInfo)

      const index = im.conversations.findIndex(c =>
        c.channel.channelID === channelID &&
        c.channel.channelType === channelType
      )

      if (action === ConversationAction.remove) {
        if (index > -1) {
          im.conversations.splice(index, 1)
        }
      } else {
        // 添加或更新：如果存在，更新内容并移到最前；如果不存在，插入到最前
        if (index > -1) {
          Vue.set(im.conversations, index, conv)
          const updatedConv = im.conversations.splice(index, 1)[0]
          console.log('updatedConv', updatedConv)
          im.conversations.unshift(updatedConv)
        } else {
          // im.conversations.unshift(conv)
          uni.$api.getImUser(channelID).then(user => {
            console.log(`获取用户信息 [${channelID}]`, user)
            sdk.channelManager.setChannleInfoForCache(Convert.userToChannelInfo(user))
            im.conversations.unshift(conv)
          })
        }
      }
    })


    // if (action === ConversationAction.remove) {
    //   const index = im.conversations.findIndex(c =>
    //     c.channel.channelID === conv.channel.channelID &&
    //     c.channel.channelType === conv.channel.channelType
    //   )
    //   if (index > -1) {
    //     im.conversations.splice(index, 1)
    //   }
    // }

    Vue.prototype.$im = im
  }
}

export default imPlugin