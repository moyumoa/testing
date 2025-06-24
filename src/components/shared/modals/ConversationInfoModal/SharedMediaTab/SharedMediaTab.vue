<script setup>
import { computed } from "vue";

import { hasAttachments } from "@src/utils";

import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
import MediaItem from "@src/components/shared/modals/ConversationInfoModal/SharedMediaTab/MediaItem.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import NoMedia from "@src/components/states/empty-states/NoMedia.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";

// 定义 props
const props = defineProps({
  closeModal: Function,
  conversation: Object,
  contact: Object,
});

// 声明 emits
const emit = defineEmits(['active-page-change']);

// 提取包含附件的消息
const attachmentMessages = computed(() => {
  let media = [];
  for (let message of props.conversation.messages) {
    if (hasAttachments(message)) {
      if (props.contact) {
        if (message.sender.id === props.contact.id) {
          media.push(message);
        }
      } else {
        media.push(message);
      }
    }
  }
  return media;
});
</script>

<template>
  <div>
    <!--header-->
    <div class="mb-6 px-5 flex justify-between items-center">
      <p
        id="modal-title"
        class="heading-1 text-black/70 dark:text-white/70"
        tabindex="0"
      >
        Shared Media
      </p>

      <!--return button-->
      <IconButton
        class="ic-btn-outlined-danger p-2"
        @click="
          $emit('active-page-change', {
            tabName: 'conversation-info',
            animationName: 'slide-right',
          })
        "
      >
        <ArrowUturnLeftIcon class="w-5 h-5" />
      </IconButton>
    </div>

    <!--search-->
    <div class="mb-5 mx-5">
      <SearchInput />
    </div>

    <!--media messages-->
    <ScrollBox
      v-if="attachmentMessages.length > 0"
      class="overflow-y-scroll max-h-55.5"
    >
      <div
        v-for="(message, index) in attachmentMessages"
        :key="index"
      >
        <MediaItem
          v-for="(attachment, attIndex) in message.attachments"
          :key="attIndex"
          :attachment="attachment"
          :date="message.date"
        />
      </div>
    </ScrollBox>
    <NoMedia
      v-else
      vertical
    />
  </div>
</template>
