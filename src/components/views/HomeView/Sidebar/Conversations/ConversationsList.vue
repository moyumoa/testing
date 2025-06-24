<script setup>
// 👉 引入子组件：单条会话
import Conversation from "./Conversation.vue";

// 👉 接收父组件传入的 props
const props = defineProps({
  filteredConversations: Array, // 过滤后的会话列表（可选）
});
</script>

<template>
  <div>
    <!-- 遍历渲染每条会话 -->
    <Conversation
      v-for="conversation in props.filteredConversations"
      :key="conversation.id"
      :conversation="conversation"
      role="listitem"
    />
  </div>
</template>
