import React, { useEffect, useRef } from "react"
import { List, Image } from "antd-mobile"
import { List as VirtualizedList, AutoSizer } from "react-virtualized"
import { WKSDK } from "wukongimjssdk"
import { useIM } from "@/hooks"
import { Convert } from "@/funcs/Convert.ts"
import { useNavigate } from "react-router-dom"

export default function LongList() {
  const navigate = useNavigate()

  const { conversations, syncConversations } = useIM()
  const hasCalledRef = useRef(false)
  useEffect(() => {
    if (hasCalledRef.current) return
    hasCalledRef.current = true
    syncConversations()
  }, [])

  function rowRenderer({ index, key, style }) {
    const sdk = WKSDK.shared()
    const item = conversations[index]
    const channelID = `${item.channel.channelID}-${item.channel.channelType}`
    item.user = sdk.channelManager.channelInfocacheMap[channelID]

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
    navigate(`/chat/${item.channel.channelID}`)
  }

  return (
    <>
      <List header="会话列表">
        <AutoSizer disableHeight>
          {({ width }) => (
            <VirtualizedList
              rowCount={conversations.length}
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
