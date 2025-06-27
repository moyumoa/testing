// src/components/KeepAliveOutlet.jsx
import { useLocation, useMatches, Outlet } from "react-router-dom"

const cacheMap = new Map()

export const KeepAliveOutlet = () => {
  const location = useLocation()
  const matches = useMatches()
  const isTabPage = matches.some((m) => m.handle?.isTab)

  const key = location.pathname

  if (isTabPage && !cacheMap.has(key)) {
    cacheMap.set(key, <Outlet key={key} />)
  }

  return (
    <>
      {Array.from(cacheMap.entries()).map(([path, element]) => {
        const active = path === location.pathname
        return (
          <div
            key={path}
            style={{
              display: active ? "block" : "none",
              height: "100%",
              overflow: "auto", // 或 auto，根据你需求
            }}
          >
            {element}
          </div>
        )
      })}
    </>
  )
}