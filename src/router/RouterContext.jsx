import { createContext, useState } from "react"
import { createAppRouter } from "./index"

const RouterContext = createContext()

export const RouterProviderWrapper = ({ children }) => {
  const [router, setRouter] = useState(createAppRouter())

  return (
    <RouterContext.Provider value={{ router, setRouter }}>
      {children(router)}
    </RouterContext.Provider>
  )
}

export default RouterContext;
