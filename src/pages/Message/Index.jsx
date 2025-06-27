import React, { useEffect, useState } from "react"
import { List, Image } from "antd-mobile"
import { List as VirtualizedList, AutoSizer } from "react-virtualized"

import {
  Channel,
  ChannelTypeGroup,
  ChannelTypePerson,
  WKSDK,
  Message,
  MessageContentType,
  MessageText,
  ConversationAction,
} from "wukongimjssdk"
import { Convert } from "@/funcs/Convert.ts"
import { chat } from "@/api"
import { useNavigate } from "react-router-dom"

export default function LongList() {
  const navigate = useNavigate()

  const [dataSource, setDataSource] = useState([])

  const inIt = () => {
    const sdk = WKSDK.shared()
    sdk.connectManager.addConnectStatusListener((status) => {
      if (status === 1) {
        console.log(
          "WKSDK.shared().config",
          JSON.stringify(sdk.config, null, 2)
        )
        sdk.config.provider.syncConversationsCallback = async () => {
          let resp
          let conversations = new Array()
          console.log("开始同步会话数据", conversations)

          resp = await chat.conversation({ msg_count: 1 })
          console.log("resp:", resp)

          if (resp) {
            resp.conversations.forEach((conversationMap) => {
              let model = Convert.toConversation(conversationMap)
              conversations.push(model)
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

          setDataSource(conversations)
          return conversations
        }

        const listen = (conversation, action) => {
          if (action === ConversationAction.add) {
            console.log("新增会话:", conversation)
          } else if (action === ConversationAction.update) {
            console.log("更新会话:", conversation)
          } else if (action === ConversationAction.remove) {
            console.log("删除会话:", conversation)
          }
        }
        sdk.conversationManager.addConversationListener(listen)
      }
    })
  }

  useEffect(() => {
    inIt()
  }, [])

  function rowRenderer({ index, key, style }) {
    const sdk = WKSDK.shared()
    const item = dataSource[index]
    const channelID = `${item.channel.channelID}-${item.channel.channelType}`
    item.user = sdk.channelManager.channelInfocacheMap[channelID]

    console.log("🚀 item:", item)

    if (!item) return null
    return (
      <List.Item
        key={key}
        style={style}
        prefix={
          <Image
            src="https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
            style={{ borderRadius: 20 }}
            fit="cover"
            width={40}
            height={40}
          />
        }
        description={item.lastMessage?.content?.text || "暂无消息"}
        onClick={() => toSession(item)}
      >
        {item?.user?.title}
      </List.Item>
    )
  }

  const toSession = (item) => {
    console.log("🚀 item:", item)
    navigate(`/chat/session/${item.channel.channelID}`)
  }

  return (
    <>
      <List header="会话列表">
        <AutoSizer disableHeight>
          {({ width }) => (
            <VirtualizedList
              rowCount={dataSource.length}
              rowRenderer={rowRenderer}
              width={width}
              height={480}
              rowHeight={60}
              overscanRowCount={10}
            />
          )}
        </AutoSizer>
      </List>
    </>
  )
}
