import request from '@/api/request.js'

export const chat = {
  conversation: (data) => request({ url: '/conversation/sync', method: 'post', data }),
}