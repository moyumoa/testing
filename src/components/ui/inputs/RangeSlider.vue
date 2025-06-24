<script setup>
// 引入 vue 组合式 API
import { ref } from 'vue'

// 声明事件发射器
const emit = defineEmits(['valueChanged'])

// 定义 props（不带类型）
const props = defineProps({
  self: Boolean,
  initialValue: Number,
  percentage: Number,
})

// ref 绑定输入框元素
const input = ref(null)

// 处理滑块值变化事件
const handleValueChange = (event) => {
  emit('valueChanged', event.target.value)
}
</script>

<template>
  <input
    ref="input"
    min="0"
    max="100"
    type="range"
    class="slider accent-indigo-500"
    :value="props.percentage"
    @input="handleValueChange"
  >
</template>
