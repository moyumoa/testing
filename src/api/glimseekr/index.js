import request from '@/api/request.js'
export const glimseekr = {
  ulist: {
    rows: (params) => request({ url: '/bs/glimseekr/user', method: 'get', params }),
    create: (data) => request({ url: '/bs/system/users', method: 'post', data }),
    update: (id, data) => request({ url: `/bs/system/users/${id}`, method: 'put', data }),
    delete: (id) => request({ url: `/bs/system/users/${id}`, method: 'delete' }),
  },
  // 封禁用户
  banusers: (id, data) => request({ url: `/bs/system/banusers/${id}`, method: 'put', data }),

  // 临时接口 查询图片列表
  tempImgList: (params) => request({ url: '/middle/space/folder-pics', method: 'get', params }),
}