<script setup>
import { computed } from "vue";
import { twMerge } from "tailwind-merge";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  handleClick: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <button
    :aria-label="props.label"
    role="menuitem"
    @click.prevent="props.handleClick"
  >
    <slot />
  </button>
</template>
