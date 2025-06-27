import React, { useEffect } from "react"
import { pubsub } from "@/utils/pubsub"

function About() {
  useEffect(() => {
    const unsubscribe = pubsub.subscribe("user:login", (data) => {
      console.log("用户登录：", data)
    })

    return () => unsubscribe() // 卸载时取消订阅
  }, [])

  return <div>这是关于页</div>
}

export default About
