<script setup>
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";
import { onMounted, onUnmounted, ref, watch } from "vue";

import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";

// 组件 props
const props = defineProps({
  open: Boolean,
  closeModal: Function,
});

const modal = ref();

const { activate, deactivate } = useFocusTrap(modal);

// 点击遮罩关闭
const closeOnClick = (event) => {
  if (event.target.id === "close-modal") {
    props.closeModal();
  }
};

// 按下 ESC 键关闭
const handleCloseOnEscape = (event) => {
  if (["Escape", "Esc"].includes(event.key)) {
    props.closeModal();
  }
};

// 添加 / 移除全局监听
onMounted(() => {
  document.addEventListener("keydown", handleCloseOnEscape);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleCloseOnEscape);
});

// 弹窗 focus trap 控制
watch(
  () => props.open,
  () => {
    if (props.open) {
      setTimeout(() => activate(), 500);
    } else {
      setTimeout(() => deactivate(), 200);
    }
  }
);
</script>

<template>
  <div
    role="dialog"
    class="relative z-20"
    :aria-hidden="!props.open"
    aria-labelledby="modal-title"
    aria-modal="true"
  >
    <!--遮罩层-->
    <Transition name="fade">
      <div
        v-show="props.open"
        class="fixed inset-0 bg-black/60 transition-opacity"
      />
    </Transition>

    <!--模态框内容-->
    <SlideTransition animation="slide-down">
      <div
        v-show="props.open"
        class="fixed inset-0 z-10 h-full overflow-y-auto"
      >
        <div
          id="close-modal"
          ref="modal"
          class="h-full flex items-center justify-center p-4 text-center sm:items-center sm:p-0"
          @click="closeOnClick"
        >
          <!-- 插槽内容 -->
          <slot name="content" />
        </div>
      </div>
    </SlideTransition>
  </div>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.1s ease;
}

.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
