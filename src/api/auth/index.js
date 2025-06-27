import request from '@/api/request.js'

export const auth = {
  login: (data) => request({ url: '/user/login', method: 'post', data, headers: { isToken: false } }),
  logout: () => request({ url: '/un/logout', method: 'post' }),
}