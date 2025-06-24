<script setup>
const emit = defineEmits(["valueChanged"]);

const props = defineProps({
  id: String,
  type: String,
  value: String,
  name: String,
  placeholder: String,
  bordered: Boolean,
});

const handleInput = (event) => {
  emit("valueChanged", event.target.value);
};
</script>

<template>
  <input
    :id="props.id"
    :type="props.type || 'text'"
    :name="props.name"
    class="text-input"
    :class="[props.bordered ? 'bordered-input' : 'ringed-input']"
    :value="props.value"
    :placeholder="props.placeholder"
    @input="handleInput"
  >
</template>
