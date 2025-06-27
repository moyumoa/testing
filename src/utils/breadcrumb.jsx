// utils/breadcrumb.js
export const buildBreadcrumbMap = (routes, basePath = "") => {
  const map = {}

  routes.forEach((route) => {
    let fullPath = ""

    if (route.index) {
      fullPath = basePath || "/" // ✅ index 路由使用父级路径作为 key
    } else {
      fullPath = `${basePath}/${route.path || ""}`.replace(/\/+/g, "/")
    }

    if (route.meta?.title) {
      map[fullPath] = route.meta.title
    }

    if (route.children) {
      Object.assign(map, buildBreadcrumbMap(route.children, fullPath))
    }
  })

  return map
}

import { Icon } from "@/components"

export const generateBreadcrumbItemsFromMap = (breadcrumbMap, pathname) => {
  const segments = pathname.split("/").filter(Boolean)
  const paths = segments.map((_, i) => "/" + segments.slice(0, i + 1).join("/"))

  const items = paths
    .map((path) => {
      const title = breadcrumbMap[path]
      return title ? { title, key: path } : null
    })
    .filter(Boolean)

  const home = {
    title: (
      <Icon
        name="arongqi1951x"
        size="16px"
        fill="#555FFF"
        style={{ transform: "translateY(-1.6px)" }}
      />
    ),
    key: "/",
  }

  return [home, ...items]
}

/* 
export const generateBreadcrumbItemsFromMap = (breadcrumbMap, pathname) => {
  // 👇 特殊处理首页路径
  if (pathname === '/' && breadcrumbMap['/']) {
    return [{ title: breadcrumbMap['/'] }];
  }

  const segments = pathname.split('/').filter(Boolean);
  const paths = segments.map((_, i) => '/' + segments.slice(0, i + 1).join('/'));

  const items = paths
    .map((path) => {
      const title = breadcrumbMap[path];
      return title ? { title } : null;
    })
    .filter(Boolean);

  return items;
}; 
*/
