// src/utils/auth.js
import store from '@/store';
import { clearUserInfo, clearToken, clearPermissions, setRoutes } from '@/store/modules';
import { getNavigate, setLock, notify } from '@/utils'
import { auth } from '@/api';

export const logout = async (nav) => {
  const navigate = nav || getNavigate()
  if (!navigate) return console.warn('❌ navigate 不存在！')

  // await auth.logout();
  // 清除 Redux 状态
  store.dispatch(clearToken());
  store.dispatch(clearPermissions());
  store.dispatch(clearUserInfo());
  store.dispatch(setRoutes([]));

  // 跳转到登录页面
  // navigate('/login'); 
  navigate('/login', { replace: true })
  setLock(false); // 重置锁状态

};
