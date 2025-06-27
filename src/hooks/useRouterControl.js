import { useContext } from "react"
import RouterContext from "@/router/RouterContext"

// export const useRouterControl = () => useContext(RouterContext)
export const useRouterControl = () => useContext(RouterContext) || {}

