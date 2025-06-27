import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUserInfo, setToken } from "@/store/modules"
import { FloatingInput } from "@/components"
import styles from "./index.module.scss"
import { auth } from "@/api"
import { notify, getDeviceInfo } from "@/utils"
import { Button, Space, Toast, Modal } from "antd-mobile"
import WKSDK from "wukongimjssdk"

const LoginPage = () => {
  const { token } = useSelector((state) => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const [username, setUsername] = useState("18812345678")
  // const [password, setPassword] = useState("1")
  const [username, setUsername] = useState("15900000003")
  const [password, setPassword] = useState("a1234567")

  const handleLogin = async () => {
    if (!username || !password)
      return Toast.show({ content: "请输入用户名和密码", icon: "fail" })
    // localStorage.setItem("mtttoken", username)
    // navigate("/")
    const device = getDeviceInfo()
    const res = await auth.login({
      username: `0086${username}`,
      password,
      device,
      flag: 1
    })
    console.log("🚀 res:", res)
    await dispatch(setToken({ token: res.token }))
    localStorage.setItem("mtttoken", res.token)
    await dispatch(setUserInfo(res))

    // // WKSDK.shared().config.addr = "ws://192.168.9.88:8090" // 默认端口为5200
    // WKSDK.shared().config.addr = "wss://wss.botgate.cn/" // 默认端口为5200
    // // 认证信息
    // WKSDK.shared().config.uid = uid // 用户uid（需要在悟空通讯端注册过）
    // WKSDK.shared().config.token = token // 用户token （需要在悟空通讯端注册过）
    // WKSDK.shared().connectManager.connect()

    // // WKSDK.shared().connectManager.addConnectStatusListener(
    // //   (status, reasonCode) => {
    // //     console.log("🚀 status:", status, "reasonCode:", reasonCode);

    // //     // if (status === .Connected) {
    // //     //   console.log("连接成功")
    // //     // } else {
    // //     //   console.log("连接失败", reasonCode) //  reasonCode: 2表示认证失败（uid或token错误）
    // //     // }
    // //   }
    // // )
  }

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token, navigate])

  return (
    <div className={styles.login_page}>
      {/* <button onClick={handleLogin}>Login</button> */}
      <div className={styles.login_form}>
        <h1>Login Page</h1>
        <Button
          onClick={() => {
            Modal.alert({
              content: "人在天边月上明",
              onConfirm: () => {
                console.log("Confirmed")
              },
            })
            // Toast.show({
            //   icon: "success",
            //   content: "保存成功",
            // })
          }}
        >
          成功
        </Button>
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
