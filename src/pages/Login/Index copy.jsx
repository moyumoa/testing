// import { useRouterControl } from "@/router/RouterContext"
import React, { useState } from "react"

import { useRouterControl } from "@/hooks/useRouterControl"

import { useDispatch } from "react-redux"
import { createAppRouter } from "@/router" // Adjust the import path as needed
import { useNavigate } from "react-router-dom"
import { setRoutes, setUserInfo, setPermissions } from "@/store/modules"
import store from "@/store"
import { FloatingInput } from "@/components"
import styles from "./index.module.scss"
import { auth } from "@/api"
import { notify } from "@/utils"
const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { setRouter } = useRouterControl()
  const [username, setUsername] = useState("system")
  const [password, setPassword] = useState("1")

  // console.log("跳转前 router 是：", store.getState().router.routes)

  const handleLogin = async () => {
    if (!username || !password) return notify.msg.warning("请输入用户名和密码")

    notify.task({
      text: "登录中...",
      final: async () => {
        const res = await auth.login({ username, password })
        console.log("🚀 res:", res)
        const userInfo = res.data.userInfo
        const rawRoutes = res.data.menus
        await dispatch(setUserInfo(userInfo))
        await dispatch(setRoutes(rawRoutes))
        await setRouter(createAppRouter(rawRoutes))
        await dispatch(setPermissions(res.data.permissions))
        await navigate("/")
        return "登录成功"
      },
      errorText: "登录失败",
    })

    //   return
    // 假设接口返回你完整的 rawRoutes
    // const rawRoutes = [
    //   {
    //     path: "/",
    //     meta: { title: "首页", icon: "kongzhitai" },
    //     component: "src/pages/Dashboard/Index",
    //   },
    //   {
    //     path: "/dashboard",
    //     redirect: "index",
    //     meta: { title: "西戈云", icon: "yun" },
    //     children: [
    //       {
    //         path: "index",
    //         component: "src/pages/Dashboard/Index",
    //         meta: { title: "数据指标", icon: "shuju2" },
    //       },
    //       {
    //         path: "home",
    //         component: "src/pages/Home",
    //         meta: { title: "用户管理", icon: "kehu2" },
    //         children: [
    //           {
    //             path: "about",
    //             component: "src/pages/About",
    //             meta: { title: "用户列表", icon: "kehu1" },
    //           },
    //         ],
    //       },
    //       {
    //         path: "system",
    //         meta: { title: "系统维护", icon: "danxingjiqun" },
    //         children: [
    //           {
    //             path: "menus",
    //             component: "src/pages/System/Menus/Index",
    //             meta: { title: "菜单管理", icon: "prokongzhitai" },
    //           },
    //           {
    //             path: "about4",
    //             component: "src/pages/System/Roles/Index",
    //             meta: {
    //               title: "权限管理",
    //               icon: "ziyuanzhongxinquanxianziyuan",
    //             },
    //           },
    //           {
    //             path: "about3",
    //             component: "src/pages/About",
    //             meta: {
    //               title: "公共资源",
    //               icon: "wulumuqishigongandashujuguanlipingtaiico",
    //             },
    //           },
    //           {
    //             path: "about2",
    //             component: "src/pages/About",
    //             meta: { title: "API接口", icon: "daimaguanli" },
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     path: "/dashboard2",
    //     redirect: "home/about",
    //     meta: { title: "芥光寻影", icon: "a046zhaopian" },
    //     children: [
    //       {
    //         path: "index",
    //         component: "src/pages/Dashboard/Index",
    //         meta: { title: "数据指标", icon: "shuju2" },
    //       },
    //       {
    //         path: "index22",
    //         component: "src/pages/Dashboard/Index",
    //         meta: { title: "云空间", icon: "shuju1" },
    //       },
    //       {
    //         path: "index2",
    //         component: "src/pages/Dashboard/Index",
    //         meta: { title: "订阅管理", icon: "huiyuan1" },
    //         children: [
    //           {
    //             path: "about",
    //             component: "src/pages/About",
    //             meta: { title: "套餐维护", icon: "dingyue" },
    //           },
    //           {
    //             path: "about1",
    //             component: "src/pages/About",
    //             meta: { title: "订阅记录", icon: "ziyuanbaoliebiao" },
    //           },
    //         ],
    //       },
    //       {
    //         path: "index3",
    //         component: "src/pages/Dashboard/Index",
    //         meta: { title: "资源包管理", icon: "liuliang1" },
    //         children: [
    //           {
    //             path: "about",
    //             component: "src/pages/About",
    //             meta: { title: "资源包套餐", icon: "ziyuanbao2" },
    //           },
    //           {
    //             path: "about1",
    //             component: "src/pages/About",
    //             meta: { title: "叠加记录", icon: "ziyuan1" },
    //           },
    //         ],
    //       },
    //       {
    //         path: "home",
    //         component: "src/pages/Home",
    //         meta: { title: "用户管理", icon: "kehuziliao" },
    //         children: [
    //           {
    //             path: "about",
    //             component: "src/pages/About",
    //             meta: { title: "用户列表", icon: "kehu1" },
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     path: "/user",
    //     redirect: "detail",
    //     meta: { title: "移动端", icon: "iconxiangcefengmian" },
    //     children: [
    //       // {
    //       //   index: true,
    //       //   redirect: 'detail',
    //       // },
    //       {
    //         path: "list",
    //         component: "src/pages/User/List",
    //         meta: { title: "用户列表", icon: "list" },
    //       },
    //       {
    //         path: "detail",
    //         component: "src/pages/User/Detail",
    //         meta: { title: "用户详情", icon: "file" },
    //       },
    //     ],
    //   },
    //   {
    //     path: "https://baidu.com",
    //     meta: { title: "外链", icon: "liulanqi" },
    //   },
    // ]

    // const userData = {
    //   userInfo: {
    //     name: "张三",
    //     role: "admin",
    //     avatar: "https://i.pravatar.cc/100?u=张三",
    //   },
    // }

    // // ✅ 存用户信息
    // dispatch(setUserInfo(userData))

    // // ✅ 存路由
    // dispatch(setRoutes(rawRoutes))
    // // ✅ 立即打印 Redux 中的 routes 确认是否设置成功
    // console.log("🚀 Redux routes:", store.getState().router.routes)

    // // 重新构造 router
    // setRouter(createAppRouter())

    // // 跳转首页
    // navigate("/")
  }

  return (
    <div className={styles.login_page}>
      {/* <button onClick={handleLogin}>Login</button> */}
      <div className={styles.login_form}>
        <h1>Login Page</h1>

        <FloatingInput
          id="username"
          label="用户名"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          size="small"
        />
        <FloatingInput
          id="password"
          label="密码"
          name="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleLogin} className={styles.login_button}>
          登录
        </button>
      </div>
    </div>
  )
}
export default LoginPage
