<script setup>
import CollapseTransition from "@src/components/ui/transitions/CollapseTransition.vue";

// 定义 props（无类型约束）
const props = defineProps({
  collapsed: Boolean,
});
</script>

<template>
  <!--折叠区域-->
  <CollapseTransition>
    <div
      v-if="!props.collapsed"
      class="w-full flex flex-col px-5"
      :aria-hidden="props.collapsed"
    >
      <slot />
    </div>
  </CollapseTransition>
</template>
