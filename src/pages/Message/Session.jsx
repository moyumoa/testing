import React, { useEffect } from "react"
import Chat, { Bubble, useMessages } from "@chatui/core"
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
import { useParams } from "react-router-dom"

export default function App() {
  // 获取路由参数
  const params = useParams()
  console.log("🚀 channelID:", params)

  const { messages, appendMsg } = useMessages([])
  const sendBefore = (context) => {
    const channel = new Channel(params.id, ChannelTypePerson)
    const content = new MessageText(context)
    WKSDK.shared().chatManager.send(content, channel)
  }
  function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      sendBefore(val)
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      })

      // 模拟收到消息
      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: "Bala bala" },
        })
      }, 1000)
    }
  }

  function renderMessageContent(msg) {
    const { type, content } = msg

    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return <Bubble content={content.text} />
      default:
        return null
    }
  }

  return (
    <Chat
      navbar={{ title: "智能助理" }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  )
}
