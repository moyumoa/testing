<script setup>
import { computed } from "vue";

import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import SwitchInput from "@src/components/ui/inputs/SwitchInput.vue";

// 声明 emits
const emit = defineEmits(["active-page-change"]);

// 接收 props，无需类型定义
const props = defineProps({
  link: Boolean,
  type: [Object, Function],
  title: String,
  chevron: Boolean,
  switch: Boolean,
  color: String,
});

// 计算颜色样式类
const colorClasses = computed(() => {
  if (props.color === "danger") {
    return "text-red-400 group-hover:text-red-500";
  } else {
    return `text-black/50 dark:text-white/70
        group-hover:text-indigo-500 group-active:text-indigo-600 
        dark:group-hover:text-indigo-300 dark:group-active:text-indigo-400`;
  }
});
</script>

<template>
  <!-- 链接按钮样式 -->
  <button
    v-if="props.link"
    type="button"
    class="w-full flex items-center"
    @click="
      emit('active-page-change', {
        tabName: 'members',
        animationName: 'slide-left',
      })
    "
  >
    <component
      :is="props.icon"
      class="w-[1.25rem] h-[1.25rem] mr-6 transition-all duration-200"
      :class="colorClasses"
    />

    <div class="grow flex justify-start items-start">
      <p
        class="body-2 transition-all duration-200"
        :class="colorClasses"
      >
        {{ props.title }}
      </p>
    </div>

    <ChevronRightIcon
      v-if="props.chevron"
      class="w-[1.25rem] h-[1.25rem] duration-200"
      :class="colorClasses"
    />
  </button>

  <!-- 非链接静态项 -->
  <div
    v-else
    class="w-full flex items-center"
  >
    <component
      :is="props.icon"
      class="w-[1.25rem] h-[1.25rem] mr-6 transition-all duration-200"
      :class="colorClasses"
    />

    <div class="grow flex justify-start items-start">
      <p
        class="body-2"
        :class="colorClasses"
      >
        {{ props.title }}
      </p>
    </div>

    <!-- 开关组件 -->
    <SwitchInput
      v-if="props.switch"
      :value="true"
    />
  </div>
</template>
