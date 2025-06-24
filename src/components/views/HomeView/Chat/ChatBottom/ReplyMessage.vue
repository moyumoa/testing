<script setup>
import { inject } from "vue";

import { getConversationIndex } from "@src/utils";
import useStore from "@src/store/store";

import { XCircleIcon } from "@heroicons/vue/24/outline";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";
import MessagePreview from "@src/components/views/HomeView/Chat/MessagePreview.vue";

// ✅ 获取全局状态
const store = useStore();

// ✅ 注入当前会话对象
const activeConversation = inject("activeConversation");

// ✅ 移除回复消息
const handleRemoveReplyMessage = () => {
  if (activeConversation) {
    const index = getConversationIndex(activeConversation.id);

    if (
      store.conversations &&
      index !== undefined &&
      index !== null
    ) {
      store.conversations[index].replyMessage = undefined;
    }
  }
};
</script>


<template>
  <SlideTransition animation="shelf-up">
    <div
      v-if="activeConversation?.replyMessage"
      class="absolute bottom-0 w-full px-5 py-2 bg-white dark:bg-gray-800 flex items-center justify-between transition-all duration-200"
    >
      <!--selected message overview-->
      <MessagePreview :message="activeConversation?.replyMessage" />

      <!--close selected Message-->
      <IconButton
        class="ic-btn-ghost-primary w-7 h-7"
        title="remove reply"
        aria-label="remove reply"
        @click="handleRemoveReplyMessage"
      >
        <XCircleIcon class="w-5 h-5" />
      </IconButton>
    </div>
  </SlideTransition>
</template>
