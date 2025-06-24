<script setup>
import TextInput from '@src/components/ui/inputs/TextInput.vue'

const emit = defineEmits(['valueChanged'])

const props = defineProps({
  id: String,
  type: String,
  label: String,
  value: String,
  name: String,
  class: String,
  placeholder: String,
  bordered: Boolean,
})
</script>

<template>
  <div class="flex flex-col">
    <label
      v-if="props.label"
      :id="props.id"
      class="body-2 text-black/70 dark:text-white/70 mb-3"
    >
      {{ props.label }}
    </label>

    <div class="relative">
      <!-- 左边插槽 -->
      <div class="absolute left-0 top-0">
        <slot name="startAdornment" />
      </div>

      <TextInput
        :id="props.id"
        :type="props.type || 'text'"
        :name="props.name"
        :value="props.value"
        class="text-input"
        :class="[
          props.bordered ? 'bordered-input' : 'ringed-input',
          props.class,
        ]"
        :placeholder="props.placeholder"
        @value-changed="(value) => emit('valueChanged', value)"
      />

      <!-- 右边插槽 -->
      <div class="absolute top-0 right-0">
        <slot name="endAdornment" />
      </div>
    </div>
  </div>
</template>
