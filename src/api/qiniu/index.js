import request from '@/api/request.js'
/* 获取七牛云token */
export const qiniuToken = (params) => request({ url: '/un/qn/tk', method: 'get', params })