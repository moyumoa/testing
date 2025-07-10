// plugins/im.js
import Vue from 'vue'
import { WKSDK, ConversationAction } from 'wukongimjssdk'
import { Convert } from './funcs/Convert.ts'
import pushmp from './audio/pushmp.mp3'

const im = Vue.observable({
  sdk: WKSDK.shared(),
  ready: false,
  conversations: []
})

const imPlugin = {
  install (Vue) {
    const sdk = im.sdk

    const inner = uni.createInnerAudioContext()
    inner.src = pushmp
    inner.onError((res) => {
      console.error('🔊 播放失败：', res)
    })

    let audioUnlocked = false
    const unlockAudio = () => {
      if (audioUnlocked) return
      try {
        inner.play()
        inner.pause()
        inner.seek(0)
        audioUnlocked = true
        console.log('🔓 已解锁音频播放权限')
      } catch (err) {
        console.warn('🔓 解锁失败：', err)
      }
    }
    document.addEventListener('touchend', unlockAudio, { once: true, passive: true })

    im.init = async (userInfo) => {
      if (!userInfo?.imUid || !userInfo?.imToken) return
      console.log('🔗 初始化IM SDK', userInfo)
      sdk.config.addr = 'ws://192.168.9.99:5200'
      sdk.config.uid = userInfo.imUid
      sdk.config.token = userInfo.imToken

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

    sdk.conversationManager.addConversationListener((conv, action) => {
      console.log(`📬 会话变更: ${action}`, conv)
      const { channelID, channelType } = conv.channel
      const myUID = sdk.config.uid

      if (conv.lastMessage.fromUID !== myUID && audioUnlocked) {
        try {
          inner.stop()
          inner.seek(0)
          inner.play()
        } catch (err) {
          console.warn('🔊 播放失败:', err)
        }
      }

      const index = im.conversations.findIndex(c =>
        c.channel.channelID === channelID &&
        c.channel.channelType === channelType
      )

      if (action === ConversationAction.remove) {
        if (index > -1) {
          im.conversations.splice(index, 1)
        }
      } else {
        if (index > -1) {
          Vue.set(im.conversations, index, conv)
          const updatedConv = im.conversations.splice(index, 1)[0]
          im.conversations.unshift(updatedConv)
        } else {
          uni.$api.getImUser(channelID).then(user => {
            sdk.channelManager.setChannleInfoForCache(Convert.userToChannelInfo(user))
            im.conversations.unshift(conv)
          })
        }
      }
    })

    Vue.prototype.$im = im
  }
}

export default imPlugin