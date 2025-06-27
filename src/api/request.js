import axios from 'axios';
import { toast } from '@chatui/core';

import store from '@/store';
import { setToken, markExitPending, setSgcAgingTime } from '@/store/modules/user';
import { logout, showModal, setLock, lockOnce } from "@/utils";
import { parseTime } from "@mvmoo/us"

// const baseURL = import.meta.env.VITE_BASE_URL;
// const baseURL = 'https://web.botgate.cn/api/v1';
const baseURL = 'http://192.168.9.99:8090/v1/';
const instance = axios.create({
  baseURL,
  timeout: 100000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
});

const pendingRequests = new Map();
const sessionKey = 'sessionObj';

/**
 * 生成请求唯一 key
 */
function generateReqKey (config) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}


// 请求拦截器
instance.interceptors.request.use(config => {
  const isToken = config.headers?.isToken === false;
  const isRepeatSubmit = config.headers?.repeatSubmit === false;

  // 请求去重
  const reqKey = generateReqKey(config);
  if (pendingRequests.has(reqKey)) {
    pendingRequests.get(reqKey).abort();
    pendingRequests.delete(reqKey);
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(reqKey, controller);

  // 添加 token
  const token = localStorage.getItem('mtttoken') || store.getState().user.token;
  if (token && !isToken) {
    // config.headers.Authorization = token;
    config.headers.Token = token;
  }

  // GET 参数拼接
  if (config.method === 'get' && config.params) {
    const urlParams = new URLSearchParams(config.params).toString();
    config.url += (config.url.includes('?') ? '&' : '?') + urlParams;
    config.params = {};
  }

  // 防重复提交（200ms内同请求拦截）
  if (!isRepeatSubmit && ['post', 'put'].includes(config.method)) {
    const requestData = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: Date.now(),
    };

    const sessionStr = sessionStorage.getItem(sessionKey);
    const last = sessionStr ? JSON.parse(sessionStr) : null;
    const interval = 200;

    // if (last && last.url === requestData.url && last.data === requestData.data && requestData.time - last.time < interval) {
    //   return Promise.reject(new Error('数据正在处理，请勿重复提交'));
    // }

    sessionStorage.setItem(sessionKey, JSON.stringify(requestData));
  }

  return config;
}, error => Promise.reject(error));

// 响应拦截器
instance.interceptors.response.use(response => {
  const reqKey = generateReqKey(response.config);
  pendingRequests.delete(reqKey);

  // const newToken = response.headers?.authorization;
  // if (newToken) {
  //   store.dispatch(setToken({ token: newToken }));
  //   localStorage.setItem('mtttoken', newToken);
  // }

  const SgcAging = response.headers?.['sgc-aging'];
  if (SgcAging) {
    store.dispatch(setSgcAgingTime(parseTime(parseInt(SgcAging), '{m}/{d} {h}:{i}')));
  }

  const data = response.data;
  // if (data.errCode !== 0) {
  //   toast.fail(data.errMsg || '服务异常');
  //   // 如果需要处理特定的
  //   return Promise.reject(data);
  // }

  return data;
}, error => {
  console.log('axios error:', error);
  // 请求取消
  if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
    console.warn('请求被主动取消:', error.message);
    return Promise.reject(error);
  }

  // 清除 pending
  if (error.config) {
    const reqKey = generateReqKey(error.config);
    pendingRequests.delete(reqKey);
  }

  // console.log('error.response', error.response)

  const status = error.response?.status || error.response?.code;
  const data = error.response?.data || {};

  const errCodeMap = {
    401: '登录已失效',
    402: '权限变更',
    403: '没有权限',
    404: '请求地址错误',
    421: '登录状态已失效',
    444: '账号封禁',
    500: '服务器异常',
  };

  const handlers = {
    // 421: () => handle401(error),
    402: () => {
      lockOnce(() => {
        showModal.warning({
          title: '权限变更',
          content: '当前持有权限已更新，需重新登录。',
          okText: '重新登录',
          onOk: () => logout(),
        });
      });
    },
    403: () => {
      lockOnce(() => {
        showModal.error({
          title: '权限不足',
          content: '您没有权限访问此资源，请联系管理员。',
          onOk: () => setLock(false)
        });
      });
    },
    401: () => {
      lockOnce(() => {
        // notify.error('登录已过期或被挤下线，请重新登录');
        store.dispatch(markExitPending());
      });
    },
    444: () => {
      lockOnce(() => {
        showModal.error({
          title: '账号异常',
          content: '您的账号已被封禁，请联系管理员。',
          onOk: () => logout(),
        });
      });
    },
  };

  (handlers[status] || (() => toast.fail(errCodeMap[status] || data?.msg || data.message || '服务异常')))?.();

  return Promise.reject(error);
});

export default instance;
