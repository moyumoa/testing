// src/components/AuthWrap.jsx
import React from "react"
import { useSelector } from "react-redux"

/**
 * 权限包装组件：用于控制组件显示与否
 * @param {string|string[]} permission 权限码，支持多个
 * @param {ReactNode} children 子组件
 * @param {ReactNode} fallback 无权限时显示内容（可选）
 */
const AuthWrap = ({ permission, children, fallback = null }) => {
  const userPermissions = useSelector((state) => state.user.permissions || [])

  const required = Array.isArray(permission) ? permission : [permission]

  const isAdmin = userPermissions.includes("*:*:*")
  const hasPermission =
    isAdmin || required.every((p) => userPermissions.includes(p))

  return hasPermission ? children : fallback
}

export default AuthWrap
