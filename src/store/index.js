import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import storage from 'redux-persist/lib/storage/createWebStorage';
import { combineReducers } from 'redux';

import counter from './modules/counter';
import user from './modules/user';
import router from './modules/router';
import localforage from 'localforage';
localforage.config({
  name: 'mtt-backend', // ✅ 给系统命名一个存储空间
});
const persistConfig = {
  key: 'root',
  storage: localforage, // 使用 localforage 作为存储引擎
  whitelist: ['user', 'router'],
};

const rootReducer = combineReducers({
  counter,
  user,
  router,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ 忽略 redux-persist 的这些 action 类型
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
