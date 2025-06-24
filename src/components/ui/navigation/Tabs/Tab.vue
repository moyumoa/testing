<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    class="p-4 flex-auto rounded-sm outline-none focus:outline-none transition-all duration-200"
    :class="
      props.active
        ? ['bg-indigo-300', 'text-white']
        : ['text-black', 'opacity-60', 'dark:text-white', 'dark:opacity-70']
    "
  >
    <p class="body-5">
      {{ props.name }}
    </p>
  </button>
</template>
