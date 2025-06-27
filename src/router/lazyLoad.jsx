import React from "react"
import { ReactComponent as LoadIcon } from "@/assets/svg/loading.svg"

export const lazyLoad = (factory) => {
  const Component = React.lazy(factory)
  return (
    <React.Suspense
      fallback={
        <LoadIcon
          className="m_loading"
          style={{ width: "22px", height: "22px" }}
        />
      }
    >
      <Component />
    </React.Suspense>
  )
}
