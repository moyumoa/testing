import { useEffect, useState, useRef } from 'react'
import { WKSDK, ConversationAction } from 'wukongimjssdk'
import { useSelector } from 'react-redux'
import { Convert } from '@/funcs/Convert.ts'
import { chat } from '@/api'

export const useIM = () => {
  const { userInfo } = useSelector((state) => state.user)
  const [ready, setReady] = useState(false)
  const [conversations, setConversations] = useState([])

  const hasCalledRef = useRef(false)
  // 初始化并连接 SDK
  useEffect(() => {
    if (hasCalledRef.current) return
    hasCalledRef.current = true
    
    if (!userInfo?.uid || !userInfo?.token) return

    const sdk = WKSDK.shared()
    sdk.config.addr = 'ws://192.168.9.99:5200'
    sdk.config.uid = userInfo.uid
    sdk.config.token = userInfo.token

    const handleStatus = (status, reason) => {
      if (status === 1) {
        console.log('✅ 已连接')
        setReady(true)
        syncConversations()
      } else {
        console.error('⚠️ 连接失败', reason)
        setReady(false)
      }
    }

    sdk.connectManager.connect()
    sdk.connectManager.addConnectStatusListener(handleStatus)
    return () => sdk.connectManager.removeConnectStatusListener(handleStatus)
  }, [userInfo])

  // 同步会话列表
  const syncConversations = async () => {
    const sdk = WKSDK.shared()
    let resp
    const list = []

    resp = await chat.conversation({ msg_count: 1 })
    if (resp) {
      resp.conversations.forEach((conversationMap) => {
        list.push(Convert.toConversation(conversationMap))
      })
      const users = resp.users
      if (users && users.length > 0) {
        for (const user of users) {
          sdk.channelManager.setChannleInfoForCache(
            Convert.userToChannelInfo(user)
          )
        }
      }
      const groups = resp.groups
      if (groups && groups.length > 0) {
        for (const group of groups) {
          sdk.channelManager.setChannleInfoForCache(
            Convert.groupToChannelInfo(group)
          )
        }
      }
    }
    setConversations(list)
    return list
  }

  // 监听会话变更
  useEffect(() => {
    const sdk = WKSDK.shared()
    const listen = (conversation, action) => {
      if (action === ConversationAction.add) {
        setConversations((prev) => [conversation, ...prev])
      } else if (action === ConversationAction.update) {
        setConversations((prev) =>
          prev.map((c) =>
            c.channel.channelID === conversation.channel.channelID &&
              c.channel.channelType === conversation.channel.channelType
              ? conversation
              : c
          )
        )
      } else if (action === ConversationAction.remove) {
        setConversations((prev) =>
          prev.filter(
            (c) =>
              !(
                c.channel.channelID === conversation.channel.channelID &&
                c.channel.channelType === conversation.channel.channelType
              )
          )
        )
      }
    }
    sdk.conversationManager.addConversationListener(listen)
    return () => sdk.conversationManager.removeConversationListener(listen)
  }, [])

  return { sdk: WKSDK.shared(), ready, conversations, syncConversations }
}