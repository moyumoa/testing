<script setup>

import { computed, ref } from "vue";

import CallInfoTab from "@src/components/shared/modals/CallInfoModal/CallInfoTab.vue";
import CallMembersTab from "@src/components/shared/modals/CallInfoModal/CallMembersTab.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";
import Modal from "@src/components/ui/utils/Modal.vue";

defineEmits(["activePageChange"]);

const props = defineProps({
  open: {
    type: Boolean,
  },
  closeModal: {
    type: Function,
  },
  call: {
    type: Object,
    default: null
  },
});

const activePageName = ref("call-info");

const animation = ref("slide-left");

const ActivePage = computed(() => {
  if (activePageName.value === "call-info") {
    return CallInfoTab;
  } else if (activePageName.value === "call-members") {
    return CallMembersTab;
  }
  return null;
});

// (event) move between modal pages
const handleChangeActiveTab = (event) => {
  animation.value = event.animationName;
  activePageName.value = event.tabName;
};
</script>

<template>
  <Modal
    :open="props.open"
    :close-modal="props.closeModal"
  >
    <template #content>
      <div
        class="w-75 py-6 overflow-x-hidden rounded bg-white dark:bg-gray-800"
      >
        <!--modal content-->
        <SlideTransition :animation="animation">
          <component
            :is="ActivePage"
            :call="props.call"
            :close-modal="closeModal"
            @active-page-change="handleChangeActiveTab"
          />
        </SlideTransition>

        <!--Call again button-->
        <div class="px-5">
          <Button class="contained-success contained-text w-full">
            Call again
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
