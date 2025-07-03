// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const STORAGE_KEY = 'APP_STORE';

const store = new Vuex.Store({
  state: {
		userInfo: uni.getStorageSync(STORAGE_KEY)?.userInfo || {},
    messageList: uni.getStorageSync(STORAGE_KEY)?.messageList || []
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      uni.setStorageSync(STORAGE_KEY, { ...uni.getStorageSync(STORAGE_KEY), userInfo });
    },
    addMessage(state, message) {
      state.messageList.push(message);
      uni.setStorageSync(STORAGE_KEY, { ...uni.getStorageSync(STORAGE_KEY), messageList: state.messageList });
    },
    setMessageList(state, messages) {
      state.messageList = messages;
      uni.setStorageSync(STORAGE_KEY, { ...uni.getStorageSync(STORAGE_KEY), messageList: messages });
    }
  },
  actions: {
    updateUserInfo({ commit }, userInfo) {
      commit('setUserInfo', userInfo);
    },
    pushMessage({ commit }, message) {
      commit('addMessage', message);
    },
    loadMessages({ commit }, messages) {
      commit('setMessageList', messages);
    }
  },
  getters: {
    getUserInfo: state => state.userInfo,
    getMessageList: state => state.messageList
  }
});

export default store;