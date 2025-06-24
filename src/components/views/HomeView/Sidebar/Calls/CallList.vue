<script setup>
import Call from "@src/components/views/HomeView/Sidebar/Calls/Call.vue";

const props = defineProps({
  calls: Array,
  chatStatus: String,
  delayLoading: String,
  openInfoModal: Function,
});
</script>

<template>
  <div>
    <Call
      v-for="call in props.calls"
      :key="call.id"
      :call="call"
      :open-info-modal="props.openInfoModal"
    />
  </div>
</template>
