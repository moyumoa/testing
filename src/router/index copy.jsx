import { createBrowserRouter } from 'react-router-dom';
import { lazyLoad } from './lazyLoad';
import AuthGuard from './AuthGuard';
import Layout from '@/App';
import rawRoutes from './routes.config';

// 🚀 生成每个一级模块的 route（/、/user 等）
function transformRoutes(routes = []) {
  return routes.map((r) => {
    const route = {
      path: r.path,
      index: r.index,
      meta: r.meta,
    };

    if (r.component) {
      route.element = lazyLoad(() => import(/* @vite-ignore */ `/${r.component}`));
    }

    // ✅ 如果有 children，则递归解析
    if (r.children) {
      route.children = transformRoutes(r.children);
    }

    return route;
  });
}


// ✅ 最终 routes 配置
export const routes = [
  // ...transformRoutes(rawRoutes),
  ...rawRoutes.map((r) => ({
    path: r.path,
    meta: r.meta,
    element: <AuthGuard><Layout /></AuthGuard>,
    children: transformRoutes(r.children || []),
  })),
  {
    path: '/login',
    element: lazyLoad(() => import('@/pages/Login')),
  },
  {
    path: '*',
    element: lazyLoad(() => import('@/pages/NotFound')),
  },
];

console.log('🚀 routes', routes);


export const router = createBrowserRouter(routes);
export default router;
