<script setup>
// 引入图标和组件
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import IconButton from '@src/components/ui/inputs/IconButton.vue'
import LabeledTextInput from '@src/components/ui/inputs/LabeledTextInput.vue'

// 声明向父组件发事件
defineEmits(['valueChanged'])

// 接收传入的属性
const props = defineProps({
  variant: String,
  class: String,
  value: String,
})
</script>

<template>
  <LabeledTextInput
    placeholder="Search.."
    class="pl-7"
    :value="props.value"
    @value-changed="(value) => $emit('valueChanged', value)"
  >
    <!-- 左侧搜索图标 -->
    <template #startAdornment>
      <MagnifyingGlassIcon
        class="w-5 h-5 mx-[8px] translate-y-[75%] text-gray-400 dark:text-white dark:opacity-70"
      />
    </template>

    <!-- 右侧清除按钮 -->
    <template #endAdornment>
      <IconButton
        v-if="props.value"
        title="clear text"
        aria-label="clear text"
        class="ic-btn-ghost-gray m-[.5rem] p-2"
        @click="$emit('valueChanged', '')"
      >
        <XCircleIcon class="w-5 h-5" />
      </IconButton>
    </template>
  </LabeledTextInput>
</template>
