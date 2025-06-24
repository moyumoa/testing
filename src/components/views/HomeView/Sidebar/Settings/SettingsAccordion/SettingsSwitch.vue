<script setup>
// 👉 引入开关组件
import SwitchInput from "@src/components/ui/inputs/SwitchInput.vue";

// 👇 props 定义
const props = defineProps({
  value: Boolean, // 当前开关状态
  title: String, // 设置项标题
  description: String, // 设置项描述
  handleToggleSwitch: Function, // 点击开关后的处理函数
});
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="flex">
      <!--左侧标题 label-->
      <div class="grow">
        <label
          for="last-seen"
          class="inline-block outline-none mb-4"
          tabindex="0"
        >
          <p class="heading-2 text-black/70 dark:text-white/70 w-13">
            {{ props.title }}
          </p>
        </label>
      </div>

      <!--右侧开关组件-->
      <SwitchInput
        id="last-seen"
        :value="props.value"
        @switch-clicked="(value) => props.handleToggleSwitch(value)"
      />
    </div>

    <!--底部描述文字-->
    <p
      class="body-2 text-black/70 dark:text-white/70 help-block outline-none"
      tabindex="0"
    >
      {{ props.description }}
    </p>
  </div>
</template>
