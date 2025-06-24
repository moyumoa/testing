<script setup>
import { computed, ref } from "vue";

import useStore from "@src/store/store";
import { getOtherMembers } from "@src/utils";

import IncomingTab from "@src/components/shared/modals/VoiceCallModal/IncomingTab.vue";
import OngoingTab from "@src/components/shared/modals/VoiceCallModal/OngoingTab.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import Modal from "@src/components/ui/utils/Modal.vue";

const props = defineProps({
  open: Boolean,
  closeModal: Function
});

const store = useStore();

const members = computed(() => {
  if (store.activeCall) {
    return getOtherMembers(store.activeCall);
  }
  return [];
});

// 根据状态切换 tab
const modalSize = computed(() => {
  if (store.activeCall) {
    if (store.activeCall.status === "dialing") {
      return "290px";
    } else if (store.activeCall.status === "ongoing") {
      return "400px";
    }
  }
  return "290px";
});

const ActiveTab = computed(() => {
  if (store.activeCall) {
    if (store.activeCall.status === "dialing") {
      return IncomingTab;
    } else if (store.activeCall.status === "ongoing") {
      return OngoingTab;
    }
  }
  return "div";
});

const handleCallStatusChange = (status) => {
  if (store.activeCall) {
    store.activeCall.status = status;
  }
};
</script>


<template>
  <Modal
    :open="props.open"
    :close-modal="() => props.closeModal(false)"
  >
    <template #content>
      <div
        class="rounded bg-white dark:bg-gray-800 transition-all duration-300"
        :style="{ width: modalSize }"
      >
        <FadeTransition>
          <component
            :is="ActiveTab"
            :members="members"
            :active-call="store.activeCall"
            :close-modal="() => props.closeModal(true)"
            :handle-call-status-change="handleCallStatusChange"
          />
        </FadeTransition>
      </div>
    </template>
  </Modal>
</template>
