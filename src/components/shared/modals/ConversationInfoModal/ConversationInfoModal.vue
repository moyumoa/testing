<script setup>
import { computed, ref } from "vue";

import ConversationInfoTab from "@src/components/shared/modals/ConversationInfoModal/ConversationInfoTab/ConversationInfoTab.vue";
import EditGroupInfoTab from "@src/components/shared/modals/ConversationInfoModal/EditGroupInfoTab.vue";
import ConversationMembersTab from "@src/components/shared/modals/ConversationInfoModal/ConversationMembersTab.vue";
import SharedMediaTab from "@src/components/shared/modals/ConversationInfoModal/SharedMediaTab/SharedMediaTab.vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";

defineEmits(["activePageChange"]);

const props = defineProps({
  open: Boolean,
  conversation: Object,
  closeModal: Function,
});

// 当前选中的联系人
const selectedMember = ref();

// 当前切换的动画方向（向左/向右）
const animation = ref("slide-left");

// 当前显示的 Tab 页面
const activePageName = ref("conversation-info");

// 根据页面名称返回对应组件
const ActiveTab = computed(() => {
  if (activePageName.value === "conversation-info") return ConversationInfoTab;
  if (activePageName.value === "members") return ConversationMembersTab;
  if (activePageName.value === "group-member") return ConversationInfoTab;
  if (activePageName.value === "shared-media") return SharedMediaTab;
  if (activePageName.value === "edit-group") return EditGroupInfoTab;
  return null;
});

// 页面切换事件处理
const handleChangeActiveTab = (event) => {
  animation.value = event.animationName;
  activePageName.value = event.tabName;

  if (event.contact) {
    selectedMember.value = event.contact;
  }

  if (event.removeContact) {
    selectedMember.value = undefined;
  }
};
</script>

<template>
  <Modal
    :open="props.open"
    :close-modal="props.closeModal"
  >
    <template #content>
      <div class="overflow-x-hidden">
        <div class="w-75 bg-white dark:bg-gray-800 rounded py-6">
          <!--content-->
          <SlideTransition :animation="animation">
            <component
              :is="ActiveTab"
              :key="activePageName"
              :conversation="props.conversation"
              :close-modal="props.closeModal"
              :contact="selectedMember"
              @active-page-change="handleChangeActiveTab"
            />
          </SlideTransition>
        </div>
      </div>
    </template>
  </Modal>
</template>
