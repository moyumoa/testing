import { createBrowserRouter, Navigate } from "react-router-dom"
import { lazyLoad } from "./lazyLoad"
import AuthGuard from "./AuthGuard"
import Layout from "@/App"

// 创建应用的完整路由器
export const createAppRouter = () => {
  const routes = [
    // {
    //   path: "/",
    //   element: (
    //       <Layout />
    //   ),
    //   children: transformRoutesWithCache(dynamicRoutes),
    // },
    {
      path: "/",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
         { index: true, element: <Navigate to="home" replace /> },
        {
          path: "home",
          element: lazyLoad(() => import("@/pages/Home")),
          handle: { title: "首页", isTab: true },
        },
        {
          path: "todo",
          element: lazyLoad(() => import("@/pages/Todo")),
          handle: { title: "待办", isTab: true },
        },
        {
          path: "message",
          element: lazyLoad(() => import("@/pages/Message/Index")),
          handle: { title: "消息", isTab: true },
        },
        {
          path: "chat/:id",
          element: lazyLoad(() => import("@/pages/Message/Session")),
          handle: { title: "会话" },
        },
        {
          path: "me",
          element: lazyLoad(() => import("@/pages/Me")),
          handle: { title: "我的", isTab: true },
        },
        // {
        //   index: true,
        //   element: <Navigate to="chat" replace />,
        // },
        // {
        //   path: "chat",
        //   element: lazyLoad(() => import("@/pages/Chat/Index")),
        //   handle: { title: "聊天", isTab: true },
        //   children: [
        //     {
        //       path: "session/:id",
        //       element: lazyLoad(() => import("@/pages/Chat/Session")),
        //       handle: { title: "聊天详情" },
        //     },
        //   ],
        // },
        {
          path: "user",
          element: lazyLoad(() => import("@/pages/User/Index")),
          handle: { title: "我的", isTab: true },
          children: [
            {
              path: "profile",
              element: lazyLoad(() => import("@/pages/User/Profile")),
              handle: { title: "个人资料" },
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: lazyLoad(() => import("@/pages/Login/Index")),
    },
    {
      path: "*",
      element: lazyLoad(() => import("@/pages/NotFound")),
    },
  ]

  return createBrowserRouter(routes)
}
