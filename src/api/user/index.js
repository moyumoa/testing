import request from '@/api/request.js'
export const userReq = {
  ulist: {
    rows: (params) => request({ url: '/bs/system/users', method: 'get', params }),
    create: (data) => request({ url: '/bs/system/users', method: 'post', data }),
    update: (id, data) => request({ url: `/bs/system/users/${id}`, method: 'put', data }),
    delete: (id) => request({ url: `/bs/system/users/${id}`, method: 'delete' }),
  },
  // 封禁用户
  banusers: (id, data) => request({ url: `/bs/system/banusers/${id}`, method: 'put', data }),
}