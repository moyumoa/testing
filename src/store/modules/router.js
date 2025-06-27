import { createSlice } from '@reduxjs/toolkit';

const routerSlice = createSlice({
  name: 'router',
  initialState: {
    routes: [], // 登录后设置的动态路由数据
  },
  reducers: {
    setRoutes: (state, action) => {
      state.routes = action.payload;
    },
  },
});

export const { setRoutes } = routerSlice.actions;
export default routerSlice.reducer;
