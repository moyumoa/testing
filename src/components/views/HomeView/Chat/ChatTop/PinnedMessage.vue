<script setup>
import { inject } from "vue";
import useStore from "@src/store/store";
import { getConversationIndex } from "@src/utils";

import { EyeSlashIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";
import MessagePreview from "@src/components/views/HomeView/Chat/MessagePreview.vue";

// 使用状态管理
const store = useStore();

// 注入当前激活的会话对象
const activeConversation = inject("activeConversation");

// 🧩 隐藏置顶消息
const handleHidePinnedMessage = () => {
  if (activeConversation) {
    const index = getConversationIndex(activeConversation.id);
    if (store.conversations && index !== undefined && index !== null) {
      store.conversations[index].pinnedMessageHidden = true;
    }
  }
};

// 🧩 移除置顶消息
const handleRemovePinnedMessage = () => {
  if (activeConversation) {
    const index = getConversationIndex(activeConversation.id);
    if (store.conversations && index !== undefined && index !== null) {
      store.conversations[index].pinnedMessage = undefined;

      // 👉 此处可以加入 socket 通知逻辑（如 emit("unpinned-message", ...)）
    }
  }
};
</script>

<template>
  <SlideTransition animation="shelf-down">
    <div
      v-if="
        activeConversation.pinnedMessage &&
          !activeConversation.pinnedMessageHidden
      "
      class="absolute z-10 w-full px-5 py-2 bg-white dark:bg-gray-800 flex items-center justify-between transition-all duration-500"
    >
      <!--pinned message preview-->
      <MessagePreview :message="activeConversation?.pinnedMessage" />

      <div class="flex">
        <!--hide pinned Message-->
        <IconButton
          title="hide pinned message"
          aria-label="hide pinned message"
          class="ic-btn-ghost-primary w-7 h-7"
          :class="{
            'mr-3':
              store.user && activeConversation?.admins?.includes(store.user.id),
          }"
          @click="handleHidePinnedMessage"
        >
          <EyeSlashIcon class="w-5 h-5" />
        </IconButton>

        <!--remove pinned Message-->
        <IconButton
          v-if="
            store.user && activeConversation?.admins?.includes(store.user.id)
          "
          class="ic-btn-ghost-primary w-7 h-7"
          title="close pinned message"
          aria-label="close pinned message"
          @click="handleRemovePinnedMessage"
        >
          <XCircleIcon class="w-5 h-5" />
        </IconButton>
      </div>
    </div>
  </SlideTransition>
</template>
