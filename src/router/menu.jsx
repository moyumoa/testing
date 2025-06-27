import { Icon } from "@/components"

/**
 * 顶部导航栏：一级菜单
 */
export const generateNavbarItems = (routes) =>
  routes.map((r) => ({
    key: r.path || "/",
    label: r.meta?.title || "",
    icon: r.meta?.icon && <Icon name={r.meta.icon} />,
  }))

/**
 * 左侧边栏菜单：根据当前主路由生成 children（支持嵌套）
 */
export const generateSidebarItems = (children, basePath = "") =>
  children
    ?.filter((r) => r.meta)
    .map((r) => {
      const fullPath = r.index
        ? basePath
        : `${basePath}/${r.path}`.replace(/\/+/g, "/")

      if (r.children?.length) {
        return {
          key: fullPath,
          icon: r.meta?.icon && <Icon name={r.meta.icon} />,
          label: r.meta?.title,
          children: generateSidebarItems(r.children, fullPath),
        }
      }

      return {
        key: fullPath,
        icon: r.meta?.icon && <Icon name={r.meta.icon} />,
        label: r.meta?.title,
      }
    })
