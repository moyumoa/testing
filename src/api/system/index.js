import request from '@/api/request.js'
export const system = {
  menus: {
    rows: (params) => request({ url: '/bs/system/menus/all', method: 'get', params }),
    rowsAuth: (params) => request({ url: '/bs/system/menus/auth', method: 'get', params }),
    create: (data) => request({ url: '/bs/system/menus', method: 'post', data }),
    update: (id, data) => request({ url: `/bs/system/menus/${id}`, method: 'put', data }),
    delete: (id) => request({ url: `/bs/system/menus/${id}`, method: 'delete' }),
  },
  roles: {
    rows: (params) => request({ url: '/bs/system/roles', method: 'get', params }),
    create: (data) => request({ url: '/bs/system/roles', method: 'post', data }),
    update: (id, data) => request({ url: `/bs/system/roles/${id}`, method: 'put', data }),
    delete: (id) => request({ url: `/bs/system/roles/${id}`, method: 'delete' }),
    authorize: (id, data) => request({ url: `/bs/system/roles/authorize/${id}`, method: 'put', data }),
  },
  configs: {
    rows: (params) => request({ url: '/bs/system/configs', method: 'get', params }),
    create: (data) => request({ url: '/bs/system/configs', method: 'post', data }),
    update: (id, data) => request({ url: `/bs/system/configs/${id}`, method: 'put', data }),
    delete: (id) => request({ url: `/bs/system/configs/${id}`, method: 'delete' }),
  },
  avatarPool: {
    rows: (params) => request({ url: '/bs/system/avatar', method: 'get', params }),
    upload: (data) => request({ url: '/bs/system/avatar', method: 'post', data }),
    delete: (id) => request({ url: `/bs/system/avatar/${id}`, method: 'delete' }),
  },
}