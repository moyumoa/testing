<script setup>
import Button from "@src/components/ui/inputs/Button.vue";
import Checkbox from "@src/components/ui/inputs/Checkbox.vue";

// 🧩 接收父组件传来的属性
const props = defineProps({
  selectMode: Boolean,
  selectAll: Boolean,
  handleCloseSelect: Function,
  handleDeselectAll: Function,
  handleSelectAll: Function,
});

// ✅ 切换“全选”勾选框
const handleCheck = () => {
  if (props.selectAll) {
    props.handleDeselectAll();
  } else {
    props.handleSelectAll();
  }
};
</script>

<template>
  <!--select mode controls-->
  <div
    v-if="props.selectMode"
    class="w-full flex justify-between items-center"
  >
    <div class="flex items-center">
      <Checkbox
        input-id="select-all"
        :value="props.selectAll"
        class="mr-3"
        :handle-check="handleCheck"
      />
      <label for="select-all">
        <p class="body-2 text-black/70 dark:text-white/70">Select All</p>
      </label>
    </div>
    <div class="flex items-center">
      <Button class="ghost-danger ghost-text mr-3">
        Delete
      </Button>
      <Button
        class="ghost-primary ghost-text"
        @click="props.handleCloseSelect"
      >
        Cancel
      </Button>
    </div>
  </div>
</template>
