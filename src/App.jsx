import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import LayoutContainer from "./LayoutContainer"
import rawRoutes from "@/router/routes.config"
import { Navigate, useNavigate } from "react-router-dom"
import { setNavigate } from "@/utils"
const App = () => {
  const token = useSelector((state) => state.user.token)
  const navigate = useNavigate()
  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  if (!token) {
    return Navigate("/login", { replace: true })
  }

  return <LayoutContainer routes={rawRoutes} />
}

export default App
