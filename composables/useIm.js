// composables/useIM.js
import { WKSDK, ConversationAction } from 'wukongimjssdk'
import { Convert } from '@/funcs/Convert.ts'

export default {
  data() {
    return {
      ready: false,
      conversations: []
    }
  },
  created() {
    this.initIM()
    this.initConversationListener()
  },
  methods: {
    async initIM() {
      const userInfo = uni.getStorageSync('APP_STORE')?.userInfo
      if (!userInfo?.uid || !userInfo?.token) return

      const sdk = WKSDK.shared()
      sdk.config.addr = 'ws://192.168.9.99:5200'
      sdk.config.uid = userInfo.uid
      sdk.config.token = userInfo.token

      const handleStatus = (status, reason) => {
        if (status === 1) {
          console.log('✅ 已连接')
          this.ready = true
          this.syncConversations()
        } else {
          console.error('⚠️ 连接失败', reason)
          this.ready = false
        }
      }

      sdk.connectManager.connect()
      sdk.connectManager.addConnectStatusListener(handleStatus)

      this.$once('hook:beforeDestroy', () => {
        sdk.connectManager.removeConnectStatusListener(handleStatus)
      })
    },

    async syncConversations() {
      const sdk = WKSDK.shared()
      const list = []

      const resp = await uni.$api.conversation({ msg_count: 1 })
      if (resp) {
        resp.conversations.forEach(conversationMap => {
          list.push(Convert.toConversation(conversationMap))
        })

        const users = resp.users || []
        users.forEach(user => {
          sdk.channelManager.setChannleInfoForCache(Convert.userToChannelInfo(user))
        })

        const groups = resp.groups || []
        groups.forEach(group => {
          sdk.channelManager.setChannleInfoForCache(Convert.groupToChannelInfo(group))
        })
      }

      this.conversations = list
    },

    initConversationListener() {
      const sdk = WKSDK.shared()
      const listen = (conversation, action) => {
        if (action === ConversationAction.add) {
          const exists = this.conversations.some(
            c => c.channel.channelID === conversation.channel.channelID &&
                 c.channel.channelType === conversation.channel.channelType
          )
          if (!exists) {
            this.conversations.unshift(conversation)
          }
        } else if (action === ConversationAction.update) {
          this.conversations = this.conversations.map(c =>
            c.channel.channelID === conversation.channel.channelID &&
            c.channel.channelType === conversation.channel.channelType
              ? conversation : c
          )
        } else if (action === ConversationAction.remove) {
          this.conversations = this.conversations.filter(c =>
            !(c.channel.channelID === conversation.channel.channelID &&
              c.channel.channelType === conversation.channel.channelType)
          )
        }
      }

      sdk.conversationManager.addConversationListener(listen)
      this.$once('hook:beforeDestroy', () => {
        sdk.conversationManager.removeConversationListener(listen)
      })
    },

    async fetchMessages(channelID, channelType, count = 20) {
      const sdk = WKSDK.shared()
      const channel = { channelID, channelType }
      const messages = await sdk.messageManager.getWithLimit(channel, count)
      console.log(`📩 获取消息 [${channelID}]`, messages)
      return messages
    }
  }
}