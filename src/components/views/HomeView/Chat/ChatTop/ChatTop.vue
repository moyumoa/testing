<script setup>
// 引入 Vue 工具
import { inject, ref } from "vue";

// 引入全局状态
import useStore from "@src/store/store";

// 引入组件
import ConversationInfoModal from "@src/components/shared/modals/ConversationInfoModal/ConversationInfoModal.vue";
import SearchModal from "@src/components/shared/modals/SearchModal/SearchModal.vue";
import VoiceCallModal from "@src/components/shared/modals/VoiceCallModal/VoiceCallModal.vue";
import PinnedMessage from "@src/components/views/HomeView/Chat/ChatTop/PinnedMessage.vue";
import ConversationInfoSection from "./ConversationInfoSection.vue";
import SelectSection from "./SelectSection.vue";

// 接收 props 参数
const props = defineProps({
  selectMode: Boolean,
  selectAll: Boolean,
  handleSelectAll: Function,
  handleDeselectAll: Function,
  handleCloseSelect: Function
});

const store = useStore();

// 注入当前会话对象
const activeConversation = inject("activeConversation");

// 控制搜索和信息弹窗显隐
const openSearch = ref(false);
const openInfo = ref(false);

// 👉 打开搜索弹窗
const handleOpenSearch = () => {
  openSearch.value = true;
};

// 👉 打开会话信息弹窗
const handleOpenInfo = () => {
  openInfo.value = true;
};

// 👉 关闭语音通话弹窗并控制通话状态
const handleCloseVoiceCallModal = (endCall) => {
  if (endCall) {
    store.activeCall = undefined;
    store.callMinimized = false;
  }

  if (store.openVoiceCall) {
    store.openVoiceCall = false;
    store.callMinimized = true;
  }
};
</script>

<template>
  <div class="w-full">
    <!--Top section-->
    <div class="w-full min-h-21 px-5 py-6">
      <SelectSection
        v-if="props.selectMode"
        :select-mode="props.selectMode"
        :select-all="props.selectAll"
        :handle-close-select="props.handleCloseSelect"
        :handle-select-all="props.handleSelectAll"
        :handle-deselect-all="props.handleDeselectAll"
      />
      <ConversationInfoSection
        v-else
        :handle-open-info="handleOpenInfo"
        :handle-open-search="handleOpenSearch"
      />
    </div>

    <!--Pinned Message-->
    <div
      class="relative transition-[padding] duration-200"
      :class="{
        'pb-15':
          activeConversation.pinnedMessage &&
          !activeConversation.pinnedMessageHidden,
      }"
    >
      <PinnedMessage :active-conversation="activeConversation" />
    </div>

    <!--Search modal-->
    <SearchModal
      :open="openSearch"
      :close-modal="() => (openSearch = false)"
      :conversation="activeConversation"
    />

    <!--Contact info modal-->
    <ConversationInfoModal
      :open="openInfo"
      :close-modal="() => (openInfo = false)"
      :conversation="activeConversation"
    />

    <!--voice call modal-->
    <VoiceCallModal
      :open="store.openVoiceCall"
      :close-modal="handleCloseVoiceCallModal"
    />
  </div>
</template>
