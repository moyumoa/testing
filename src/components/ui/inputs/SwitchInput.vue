<script setup>
const emit = defineEmits(['switchClicked'])

const props = defineProps({
  id: String,
  label: String,
  value: {
    type: Boolean,
    required: true,
  },
  description: String,
})

// ⌨️ 按下 Enter 键切换开关
const handleToggleSwitchOnEnter = (event) => {
  if (event.key === 'Enter') {
    emit('switchClicked', !props.value)
  }
}
</script>

<template>
  <!-- 开关组件 -->
  <div
    role="switch"
    :aria-checked="!!props.value"
    :aria-label="'Switch ' + (props.value ? 'checked' : 'not checked')"
    class="relative flex select-none outline-none transition-all duration-200 ease-in"
    tabindex="0"
  >
    <!-- 隐藏的 checkbox 实际控制状态 -->
    <input
      :id="props.id"
      :checked="props.value"
      type="checkbox"
      :name="props.label"
      class="absolute block w-5 h-5 rounded-full bg-white scale-[0.6] appearance-none cursor-pointer foucs:outline-none transition-all duration-300"
      :class="{ 'right-0': props.value }"
      tabindex="-1"
    >

    <!-- 开关外壳，点击或按键触发切换 -->
    <label
      :for="props.id"
      class="block w-7 h-5 rounded-full outline-none cursor-pointer"
      :class="{
        'bg-indigo-300': props.value,
        'bg-gray-300 dark:bg-gray-600': !props.value,
      }"
      tabindex="-1"
      @click.capture="$emit('switchClicked', !props.value)"
      @keydown="handleToggleSwitchOnEnter"
    />
  </div>
</template>
