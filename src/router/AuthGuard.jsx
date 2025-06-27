// src/router/AuthGuard.jsx
import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const AuthGuard = ({ children }) => {
  const { token } = useSelector((state) => state.user)

  const mtttoken = token || localStorage.getItem("mtttoken")

  const location = useLocation()

  if (!mtttoken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AuthGuard
