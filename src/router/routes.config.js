// src/router/routes.config.js
export default [
  {
    path: '/',
    meta: { title: '首页', icon: 'kongzhitai' },
    component: 'Chat/Index',
  },
  {
    path: '/user',
    redirect: 'detail',
    meta: { title: '移动端', icon: 'iconxiangcefengmian' },
    children: [
      // {
      //   index: true,
      //   redirect: 'detail',
      // },
      {
        path: 'list',
        component: 'User/List',
        meta: { title: '用户列表', icon: 'list' },
      },
      {
        path: 'detail',
        component: 'User/Detail',
        meta: { title: '用户详情', icon: 'file' },
      },
    ],
  },
  {
    path: 'https://baidu.com',
    meta: { title: '外链', icon: 'liulanqi' },
  }

];