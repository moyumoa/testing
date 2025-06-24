<script setup>
import { onMounted, onUnmounted } from "vue";
import ScaleTransition from "@src/components/ui/transitions/ScaleTransition.vue";

// 去掉类型声明
const props = defineProps({
  show: Boolean,
  handleClickOutside: Function,
  preventClickOutside: Boolean,
  coordinates: Object,
  position: Array,
  closeDropdown: Function,
});

// ESC 关闭下拉菜单
const handleCloseOnEscape = (event) => {
  if (["Escape", "Esc"].includes(event.key)) {
    props.closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleCloseOnEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleCloseOnEscape);
});
</script>

<template>
  <div>
    <div
      v-if="props.show"
      class="fixed left-0 top-0 z-50 w-full h-full"
    />

    <ScaleTransition>
      <div
        v-show="props.show"
        v-click-outside="props.handleClickOutside"
        :class="props.position"
        :style="props.coordinates"
        class="absolute z-100 w-50 mt-2 rounded-sm bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-600 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div role="none">
          <slot />
        </div>
      </div>
    </ScaleTransition>
  </div>
</template>
