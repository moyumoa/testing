<script setup>
// 导入图标组件
import { CheckIcon, ClockIcon } from "@heroicons/vue/24/outline";
import DoubleChecks from "@src/components/views/HomeView/Chat/ChatMiddle/Message/DoubleChecks.vue";

// 接收 props 参数
const props = defineProps({
  state: String
});
</script>

<template>
  <!-- 等待状态图标 -->
  <ClockIcon
    v-if="props.state === 'waiting'"
    class="w-[.875rem] h-[.875rem] text-gray-300"
  />
  
  <!-- 已发送单勾图标 -->
  <CheckIcon
    v-else-if="props.state === 'sent'"
    class="w-[.875rem] h-[.875rem] text-gray-300"
  />

  <!-- 已读双勾图标 -->
  <DoubleChecks
    v-else
    :state="props.state"
  />
</template>
