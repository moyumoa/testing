<script setup>
// 引入类型和依赖
import { inject, onMounted, ref } from "vue";

import useStore from "@src/store/store";

// 引入组件
import Message from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Message.vue";
import TimelineDivider from "@src/components/views/HomeView/Chat/ChatMiddle/TimelineDivider.vue";

// 接收 props 参数
const props = defineProps({
  handleSelectMessage: Function,
  handleDeselectMessage: Function,
  selectedMessages: Array
});

const store = useStore();

// 容器元素引用
const container = ref(null);

// 注入当前会话对象
const activeConversation = inject("activeConversation");

// ✅ 判断是否是同一个用户连续发言
const isFollowUp = (index, previousIndex) => {
  if (previousIndex < 0) return false;
  const previousSender = activeConversation.messages[previousIndex].sender.id;
  const currentSender = activeConversation.messages[index].sender.id;
  return previousSender === currentSender;
};

// ✅ 判断当前消息是否为自己发出的
const isSelf = (message) => {
  return store.user && message.sender.id === store.user.id;
};

// ✅ 判断是否显示时间分割线（这里是写死 index === 3，后续可改为日期判断）
const renderDivider = (index, previousIndex) => {
  return index === 3;
};

// ✅ 组件挂载后自动滚动到底部
onMounted(() => {
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight;
  }
});
</script>

<template>
  <div
    v-if="store.status !== 'loading'"
    ref="container"
    class="grow px-5 py-5 flex flex-col overflow-y-scroll scrollbar-hidden"
  >
    <div
      v-for="(message, index) in activeConversation.messages"
      :key="index"
    >
      <TimelineDivider v-if="renderDivider(index, index - 1)" />

      <Message
        :message="message"
        :self="isSelf(message)"
        :follow-up="isFollowUp(index, index - 1)"
        :divider="renderDivider(index, index - 1)"
        :selected="props.selectedMessages.includes(message.id)"
        :handle-select-message="handleSelectMessage"
        :handle-deselect-message="handleDeselectMessage"
      />
    </div>
  </div>
</template>
