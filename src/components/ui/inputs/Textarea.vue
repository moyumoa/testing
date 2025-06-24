<script setup>
import { ref } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  id: String,
  type: String,
  value: String,
  name: String,
  placeholder: String,
  bordered: Boolean,
  autoResize: Boolean,
});

const textarea = ref(null);

// 自动调整文本域高度
const autoResize = () => {
  if (props.autoResize && textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height = textarea.value.scrollHeight + "px";
  }
};

// 监听输入事件，更新 modelValue 和调整高度
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
  autoResize();
};
</script>

<template>
  <textarea
    :id="props.id"
    ref="textarea"
    :name="props.name"
    class="text-input"
    :class="[props.bordered ? 'bordered-input' : 'ringed-input']"
    :placeholder="props.placeholder"
    :value="props.value"
    @input="handleInput"
  />
</template>
