// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const STORAGE_KEY = 'APP_STORE';

const store = new Vuex.Store({
  state: {
		userInfo: uni.getStorageSync(STORAGE_KEY)?.userInfo || {},
    messageList: uni.getStorageSync(STORAGE_KEY)?.messageList || [],
    deletedOrder: ['1231'], // 用于存储已删除的订单
    updatedOrder: [], // 用于存储更新的订单
    paginatedState: null, // 用于存储分页数据
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
    },
    addDeletedOrder(state, order) {
      state.deletedOrder.push(order);
    },
    clearDeletedOrders(state) {
      state.deletedOrder = [];
    },
    updatateOrderItem(state, orderId) {
      const index = state.updatedOrder.indexOf(orderId);
      if (index === -1) {
        state.updatedOrder.push(orderId);
      }else {
        state.updatedOrder.splice(index, 1);
      }
    },
    setPaginated(state, paginated) {
      state.paginatedState = paginated; 
    },
    // 删除state.paginated.data中的指定项
    removePaginatedItem(state, id) {
      if (state.paginatedState && state.paginatedState.data) {
        const index = state.paginatedState.data.findIndex(item => item.id === id);
        if (index !== -1) {
          state.paginatedState.data.splice(index, 1);
        }
      }
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
    },
    markOrderDeleted({ commit }, order) {
      commit('addDeletedOrder', order);
    },
    updatateOrder({ commit }, orderId) {
      commit('updatateOrderItem', orderId);
    },
    initPaginated({ commit }, paginated) {
      commit('setPaginated', paginated);
    },
    removePaginItem({ commit }, id) {
      commit('removePaginatedItem', id);
    },
  },
  getters: {
    getUserInfo: state => state.userInfo,
    getMessageList: state => state.messageList,
    getDeletedOrders: state => state.deletedOrder,
    getUpdatedOrders: state => state.updatedOrder,
    paginated: state => state.paginatedState,
  }
});

export default store;