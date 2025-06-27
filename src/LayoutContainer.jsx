import styles from "./LayoutContainer.module.scss"
import React, { useEffect } from "react"
import { NavBar, TabBar } from "antd-mobile"
import { useLocation, useNavigate, useMatches } from "react-router-dom"
import { KeepAliveOutlet } from "@/router/KeepAliveOutlet"

import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons"

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

const tabs = [
  { key: "/home", title: "首页", icon: <AppOutline /> },
  { key: "/todo", title: "待办", icon: <UnorderedListOutline /> },
  { key: "/message", title: "消息", icon: <MessageOutline /> },
  { key: "/me", title: "我的", icon: <UserOutline /> },
]

const LayoutContainer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const matches = useMatches()
  const pathname = location.pathname

  const isTabPage = matches.some((match) => match.handle?.isTab)

  const currentTitle =
    matches.find((m) => m.handle?.title)?.handle?.title || "默认标题"

  const { userInfo } = useSelector((state) => state.user)

  function initIM() {
    // 1. 初始化 SDK（已登录用户的 token 和 uid）
    const sdk = WKSDK.shared()
    sdk.config.addr = "ws://192.168.9.99:5200"
    WKSDK.shared().config.uid = userInfo.uid
    WKSDK.shared().config.token = userInfo.token

    // 3. 连接服务
    sdk.connectManager.connect()
    sdk.connectManager.addConnectStatusListener((status, reason) => {
      if (status === 1) {
        console.log("✅ 已连接")
      } else {
        console.error("⚠️ 连接失败", reason)
      }
    })
  }

  useEffect(() => {
    initIM()
  }, [userInfo])

  return (
    <div className={styles.app}>
      <div className={styles.top}>
        <NavBar
          backIcon={isTabPage ? null : undefined}
          onBack={() => {
            if (!isTabPage) navigate(-1)
          }}
        >
          {currentTitle}
        </NavBar>
      </div>

      <div className={styles.body}>
        <KeepAliveOutlet />
      </div>

      {isTabPage && (
        <div className={styles.bottom}>
          <TabBar activeKey={pathname} onChange={navigate}>
            {tabs.map((item) => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
          </TabBar>
        </div>
      )}
    </div>
  )
}

export default LayoutContainer
