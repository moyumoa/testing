import React, { useState, useMemo, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { logout } from "@/utils"
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

import { SideTopContent } from "@/components"

import { generateNavbarItems, generateSidebarItems } from "@/router/menu"
import {
  buildBreadcrumbMap,
  generateBreadcrumbItemsFromMap,
  getOpenKeysFromPath,
} from "@/utils"
import { chat } from "@/api"

import styles from "@/assets/scss/index.module.scss"

const LayoutContainer = ({ routes }) => {
  // logout()
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ 当前路径所属主模块（最长路径匹配）
  const currentTopRoute = useMemo(() => {
    return (
      routes
        .filter((r) => location.pathname.startsWith(r.path))
        .sort((a, b) => b.path.length - a.path.length)[0] || routes[0]
    )
  }, [routes, location.pathname])

  const currentTopKey = currentTopRoute?.path || "/"

  // ✅ 顶部导航菜单
  const navbarItems = useMemo(() => generateNavbarItems(routes), [routes])

  // ✅ 左侧菜单
  const sidebarItems = useMemo(() => {
    return generateSidebarItems(currentTopRoute?.children || [], currentTopKey)
  }, [currentTopRoute, currentTopKey])

  // ✅ 面包屑
  const breadcrumbMap = useMemo(() => buildBreadcrumbMap(routes), [routes])
  const breadcrumbItems = useMemo(
    () => generateBreadcrumbItemsFromMap(breadcrumbMap, location.pathname),
    [breadcrumbMap, location.pathname]
  )

  // ✅ 菜单展开项
  // const [openKeys, setOpenKeys] = useState(
  //   getOpenKeysFromPath(location.pathname)
  // )
  const [openKeys, setOpenKeys] = useState(() =>
    getOpenKeysFromPath(location.pathname)
  )

  // useEffect(() => {
  //   setOpenKeys(getOpenKeysFromPath(location.pathname))
  // }, [location.pathname])

  // 获取登录信息
  const { exitPending, userInfo } = useSelector((state) => state.user)

  function initIM() {
    // 1. 初始化 SDK（已登录用户的 token 和 uid）
    const sdk = WKSDK.shared()

    // sdk.config.addr = "wss://wss.botgate.cn"
    sdk.config.addr = "ws://192.168.9.99:5200"
    // sdk.config.uid = "ba4ee31dd3e442d18aec344ad8746993"
    // sdk.config.token = "506ca5f94b2c4cd5a40c8b1701a9562d"

    // WKSDK.shared().config.addr = "wss://wss.botgate.cn"
    // WKSDK.shared().config.addr = "ws://192.168.9.99:8090"
    WKSDK.shared().config.uid = userInfo.uid
    WKSDK.shared().config.token = userInfo.token

    console.log("info==", userInfo)

    console.log("WKSDK.shared().config", JSON.stringify(sdk.config, null, 2))

    // 3. 连接服务
    sdk.connectManager.connect()

    sdk.connectManager.connect()
    sdk.connectManager.addConnectStatusListener((status, reason) => {
      if (status === 1) {
        console.log("✅ 已连接")
        fetchConversations()

        const channel = new Channel(
          "5ffdd74b21774efeb79631e71919e46a",
          ChannelTypePerson
        )
        const content = new MessageText("你好~")
        WKSDK.shared().chatManager.send(content, channel)
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

    // WKSDK.shared().config.addr = "ws://192.168.9.88:8090" // 默认端口为5200
    // console.log('WKSDK==', JSON.stringify(WKSDK.shared(), null, 2));

    /*  WKSDK.shared().config.addr = "wss://wss.botgate.cn" // 默认端口为5200
    // 认证信息
    // WKSDK.shared().config.uid = userInfo.uid 
    // WKSDK.shared().config.token = userInfo.token
    WKSDK.shared().config.uid = '5ffdd74b21774efeb79631e71919e46a' // 用户uid（需要在悟空通讯端注册过）
    WKSDK.shared().config.token = '6976e57768f94353a718c2a022984fbb' // 用户token （需要在悟空通讯端注册过）
    WKSDK.shared().connectManager.connect()
    WKSDK.shared().connectManager.addConnectStatusListener(
      (status, reasonCode) => {
        if (status === 1) {
          console.log("连接成功")
        } else {
          console.log("连接失败", reasonCode) //  reasonCode: 2表示认证失败（uid或token错误）
        }
      }
    ) */
    // const text = new MessageText("hello")
    // WKSDK.shared().chatManager.send(text, new Channel("A", ChannelTypePerson))
  }, [userInfo])

  return (
    <>
      <div data-page style={{ height: "100vh" }}>
        <Outlet />
      </div>
    </>
  )
}

export default LayoutContainer
