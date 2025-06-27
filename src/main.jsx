// src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
// import router from "@/router"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import store, { persistor } from "@/store"
import "./assets/app.css"
import { RouterProviderWrapper } from "@/router/RouterContext"
import "@chatui/core/dist/index.css"

document.documentElement.setAttribute("data-theme", "light")
document.documentElement.classList.add("light")

if (import.meta.env.MODE === "development") {
  const origWarn = console.warn
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Second param return from event is node data instead of TreeNode instance"
      )
    ) {
      return
    }
    origWarn(...args)
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProviderWrapper>
          {(router) => <RouterProvider router={router} />}
        </RouterProviderWrapper>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
