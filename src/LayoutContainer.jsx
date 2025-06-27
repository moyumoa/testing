import styles from "./LayoutContainer.module.scss"
import React from "react"
import { NavBar, TabBar } from "antd-mobile"
import { useLocation, useNavigate, useMatches } from "react-router-dom"
import { KeepAliveOutlet } from "@/router/KeepAliveOutlet"

import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons"

import { useIM } from "@/hooks"

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

   const { ready } = useIM()
   console.log("IM SDK is ready:", ready);

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
