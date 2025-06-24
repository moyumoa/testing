<script setup>
// ✅ 引入图标资源
import GreenChecks from "@src/assets/vectors/green_checks.svg";
import GrayChecks from "@src/assets/vectors/gray_checks.svg";

// 定义 props（不使用 TS 类型）
const props = defineProps({
  state: String // 消息状态：'delivered'（已送达）或 'read'（已读）
});
</script>

<template>
  <!-- 已送达：灰色双对勾 -->
  <img
    v-if="props.state === 'delivered'"
    :src="GrayChecks"
    class="w-[.875rem] h-[.875rem]"
    alt="已送达"
  >

  <!-- 已读：绿色双对勾 -->
  <img
    v-else-if="props.state === 'read'"
    :src="GreenChecks"
    class="w-[.875rem] h-[.875rem]"
    alt="已读"
  >
</template>
