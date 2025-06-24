<script setup>
import { ref, computed, provide } from "vue";

import useStore from "@src/store/store";
import { getActiveConversationId } from "@src/utils";
import { useRoute } from 'vue-router'
const route = useRoute()

import NoChatSelected from "@src/components/states/empty-states/NoChatSelected.vue";
import Spinner from "@src/components/states/loading-states/Spinner.vue";
import ChatBottom from "@src/components/views/HomeView/Chat/ChatBottom/ChatBottom.vue";
import ChatMiddle from "@src/components/views/HomeView/Chat/ChatMiddle/ChatMiddle.vue";
import ChatTop from "@src/components/views/HomeView/Chat/ChatTop/ChatTop.vue";

const store = useStore();

// 🔍 当前活跃会话
const activeConversation = computed(() => {
  const activeId = getActiveConversationId(route);

  return (
    store.conversations.find((c) => c.id === activeId) ||
    store.archivedConversations.find((c) => c.id === activeId)
  );
});

// 🌐 提供当前会话供子组件使用
provide("activeConversation", activeConversation.value);

// 🛠️ 选择模式
const selectMode = ref(false);
// ✅ 是否全选
const selectAll = ref(false);
// 📌 当前选中的消息 ID 列表
const selectedMessages = ref([]);

// ➕ 添加一条选中的消息
const handleSelectMessage = (messageId) => {
  selectedMessages.value.push(messageId);

  if (
    activeConversation.value &&
    selectedMessages.value.length === activeConversation.value.messages.length
  ) {
    selectAll.value = true;
  }

  if (!selectMode.value) {
    selectMode.value = true;
  }
};

// ➖ 取消选中一条消息
const handleDeselectMessage = (messageId) => {
  selectAll.value = false;
  selectedMessages.value = selectedMessages.value.filter((id) => id !== messageId);

  if (activeConversation.value && selectedMessages.value.length === 0) {
    selectMode.value = false;
  }
};

// ✅ 全选所有消息
const handleSelectAll = () => {
  if (activeConversation.value) {
    selectedMessages.value = activeConversation.value.messages.map((m) => m.id);
    selectAll.value = true;
  }
};

// ❌ 取消全部选中
const handleDeselectAll = () => {
  selectedMessages.value = [];
  selectAll.value = false;
};

// ❎ 退出选择模式
const handleCloseSelect = () => {
  selectedMessages.value = [];
  selectAll.value = false;
  selectMode.value = false;
};
</script>

<template>
  <Spinner v-if="store.status === 'loading' || store.delayLoading" />

  <div
    v-else-if="getActiveConversationId(route) && activeConversation"
    class="h-full flex flex-col scrollbar-hidden"
  >
    <ChatTop
      :select-all="selectAll"
      :select-mode="selectMode"
      :handle-select-all="handleSelectAll"
      :handle-deselect-all="handleDeselectAll"
      :handle-close-select="handleCloseSelect"
    />
    <ChatMiddle
      :selected-messages="selectedMessages"
      :handle-select-message="handleSelectMessage"
      :handle-deselect-message="handleDeselectMessage"
    />
    <ChatBottom />
  </div>

  <NoChatSelected v-else />
</template>

