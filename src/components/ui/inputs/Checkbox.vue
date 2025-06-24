<script setup>
import { CheckIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["update"]);

const props = defineProps({
  value: Boolean,
  inputId: String,
  handleCheck: Function,
});
</script>

<template>
  <div class="relative flex justify-center items-center">
    <input
      :id="props.inputId"
      :class="props.value ? ['bg-indigo-300'] : []"
      type="checkbox"
      :checked="props.value"
      class="h-5 w-5 appearance-none relative cursor-pointer outline-none rounded-[.3125rem] border border-indigo-300 transition-all duration-300"
      @click="
        () => {
          if (props.handleCheck) props.handleCheck();
          emit('update', !props.value);
        }
      "
    >
    <CheckIcon
      class="absolute top-[.1875rem] cursor-pointer z-10 left-[.125rem] w-4 h-4 text-white transition-all duration-300"
      :class="props.value ? [] : ['hidden']"
      @click="
        () => {
          if (props.handleCheck) props.handleCheck();
          emit('update', !props.value);
        }
      "
    />
  </div>
</template>
