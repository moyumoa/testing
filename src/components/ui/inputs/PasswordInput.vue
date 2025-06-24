<script setup>
import { ref } from 'vue'

import LabeledTextInput from '@src/components/ui/inputs/LabeledTextInput.vue'
import { EyeSlashIcon, EyeIcon } from '@heroicons/vue/24/outline'
import IconButton from '@src/components/ui/inputs/IconButton.vue'

// 声明事件发射器
const emit = defineEmits(['valueChanged'])

// 定义 props（JS 写法，不含类型约束）
const props = defineProps({
  id: String,
  type: String,
  label: String,
  value: String,
  placeholder: String,
  description: String,
  bordered: Boolean,
  class: String,
})

// 控制密码可见性
const showPassword = ref(false)
</script>

<template>
  <LabeledTextInput
    :id="props.id"
    :type="showPassword ? 'text' : 'password'"
    :label="props.label"
    :value="props.value"
    :placeholder="props.placeholder"
    :class="props.class"
    :bordered="props.bordered"
    @value-changed="(value) => $emit('valueChanged', value)"
  >
    <template #endAdornment>
      <IconButton
        title="toggle password visibility"
        aria-label="toggle password visibility"
        class="m-[.5rem] p-2"
        @click="showPassword = !showPassword"
      >
        <EyeSlashIcon
          v-if="showPassword"
          class="w-5 h-5"
        />
        <EyeIcon
          v-else
          class="w-5 h-5"
        />
      </IconButton>
    </template>
  </LabeledTextInput>
</template>
