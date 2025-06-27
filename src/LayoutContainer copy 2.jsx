import { useEffect } from "react"
import { NavBar, TabBar } from "antd-mobile"
import { Outlet, useMatches, useNavigate, useLocation } from "react-router-dom"
import { AppOutline, UserOutline } from "antd-mobile-icons"

import { useSelector } from "react-redux"

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

const tabRoutes = [
  { key: "/chat", title: "聊天", icon: <AppOutline /> },
  { key: "/user", title: "我的", icon: <UserOutline /> },
]

export default function PageLayout() {
  // 获取登录信息
  const { userInfo } = useSelector((state) => state.user)

  function initIM() {
    // 1. 初始化 SDK（已登录用户的 token 和 uid）
    const sdk = WKSDK.shared()
    sdk.config.addr = "ws://192.168.9.99:5200"
    WKSDK.shared().config.uid = userInfo.uid
    WKSDK.shared().config.token = userInfo.token

    console.log("WKSDK.shared().config", JSON.stringify(sdk.config, null, 2))

    // 3. 连接服务
    sdk.connectManager.connect()
    sdk.connectManager.addConnectStatusListener((status, reason) => {
      if (status === 1) {
        console.log("✅ 已连接")
        fetchConversations()
      } else {
        console.error("⚠️ 连接失败", reason)
      }
    })

    const listen = (conversation, action) => {
      if (action === ConversationAction.add) {
        // 新增最近会话
        console.log("新增会话:", conversation)
      } else if (action === ConversationAction.update) {
        console.log("更新会话:", conversation)
        // 更新最近会话
      } else if (action === ConversationAction.remove) {
        // 删除最近会话
      }
    }

    sdk.conversationManager.addConversationListener(listen)

    // 提供最近会话同步的数据源
    sdk.config.provider.syncConversationsCallback = async () => {
      let resp
      let conversations = new Array()
      resp = await chat.conversation({ msg_count: 1 })
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

      console.log("✅ 同步会话列表:", conversations)

      return conversations
    }

    // 4. 拉取会话列表（一般在连接成功之后）
    async function fetchConversations() {
      const convs = await sdk.conversationManager.sync()
      console.log("✅ 当前会话列表:", convs)
      return convs
    }
  }
  useEffect(() => {
    initIM()
  }, [userInfo])

  const matches = useMatches()
  const navigate = useNavigate()
  const location = useLocation()

  const current = matches[matches.length - 1]
  const isSubPage = matches.length > 2
  const isTabPage = current?.handle?.isTab

  const currentTitle = current?.handle?.title || "页面"

  return (
    <div
      style={{
        maxWidth: "540px",
        minWidth: "375px",
        width: "100%",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* 顶部导航栏 */}
      <NavBar back={isSubPage ? "返回" : null} onBack={() => navigate(-1)}>
        {currentTitle}
      </NavBar>

      {/* 页面内容 */}
      <div style={{ flex: 1, position: "relative" }}>
        <Outlet />
      </div>

      {/* 底部 TabBar（只在一级页面显示） */}
      {isTabPage && (
        <TabBar activeKey={location.pathname} onChange={(key) => navigate(key)}>
          {tabRoutes.map((item) => (
            <TabBar.Item key={item.key} title={item.title} icon={item.icon} />
          ))}
        </TabBar>
      )}
    </div>
  )
}
