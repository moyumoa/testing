import React, { useEffect } from "react"
import Chat, { Bubble, useMessages } from "@chatui/core"
import { WKSDK, MessageText, Channel, ChannelTypePerson } from "wukongimjssdk"
import { logout } from "@/utils"
import { Outlet } from "react-router-dom"
const initialMessages = [
  {
    type: "system",
    content: { text: "88VIP专属智能客服小蜜 为您服务" },
  },
  {
    type: "text",
    content: { text: "Hi，我是你的专属智能助理小蜜，有问题请随时找我哦~" },
    user: {
      avatar:
        "https://gw.alicdn.com/imgextra/i2/O1CN01fPEB9P1ylYWgaDuVR_!!6000000006619-0-tps-132-132.jpg",
    },
  },
]

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: "message",
    name: "联系人工服务",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "短语1",
    isNew: true,
  },
  {
    name: "短语2",
    isHighlight: true,
  },
  {
    name: "短语3",
  },
]

const ChatPage = () => {
  // 消息列表
  const { messages, appendMsg } = useMessages(initialMessages)

  // 发送回调
  function handleSend(type, val) {
    const channel = new Channel(
      "1e096e569e934710b5d3bea0ef32c788",
      ChannelTypePerson
    )
    const content = new MessageText(val.trim())
    WKSDK.shared().chatManager.send(content, channel)

    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      })

      // TODO: 发送请求
      // 模拟回复消息
      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: "亲，您遇到什么问题啦？请简要描述您的问题~" },
        })
      }, 1000)
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item) {
    console.log("快捷短语点击:", item)
    logout()

    // handleSend("text", item.name)
  }

  function renderMessageContent(msg) {
    const { type, content } = msg

    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return <Bubble content={content.text} />
      case "image":
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        )
      default:
        return null
    }
  }

  // 同步会话
  // const syncSession = async () => {
  //   setTimeout(async () => {
  //     const convs = await WKSDK.shared().conversationManager.sync()
  //     console.log("同步会话:", convs)
  //   }, 1000)
  // }

  useEffect(() => {
    // syncSession()
  }, [])

  return (
    <div style={{ position: "relative", height: "100%", width: "100%"  }}>
       <Outlet />
    </div>
  )
}

export default ChatPage
