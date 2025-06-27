import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: '',           // 登录令牌
    permissions: [],    // 权限列表
    userInfo: null,      // 用户详情（如 name, role 等）
    exitPending: false, // 退出登录请求是否正在进行中
    SgcAgingTime: 0, // SGC缓存过期时间
  },
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
    clearUserInfo(state) {
      state.token = '';
      state.userInfo = null;
    },
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
    clearPermissions(state) {
      state.permissions = [];
    },

    setToken(state, action) {
      const { token } = action.payload;
      localStorage.setItem('mtttoken', token); // 存储 token
      state.token = token;
    },
    clearToken(state) {
      state.token = '';
      state.exitPending = false;
      localStorage.removeItem('mtttoken'); // 清除 token
    },

    markExitPending(state) {
      state.exitPending = true;
    },

    setSgcAgingTime(state, action) {
      state.SgcAgingTime = action.payload;
    },
  },
});

export const {
  setUserInfo,
  clearUserInfo,
  setPermissions,
  clearPermissions,
  setToken,
  clearToken,
  markExitPending,
  setSgcAgingTime
} = userSlice.actions;
export default userSlice.reducer;
