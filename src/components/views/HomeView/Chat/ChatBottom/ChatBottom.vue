<script setup>
import { ref, inject, onMounted } from "vue";

import useStore from "@src/store/store";
import { getConversationIndex } from "@src/utils";

import {
  CheckIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";

import AttachmentsModal from "@src/components/shared/modals/AttachmentsModal/AttachmentsModal.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import ScaleTransition from "@src/components/ui/transitions/ScaleTransition.vue";
import ReplyMessage from "@src/components/views/HomeView/Chat/ChatBottom/ReplyMessage.vue";
import EmojiPicker from "@src/components/ui/inputs/EmojiPicker/EmojiPicker.vue";
import Textarea from "@src/components/ui/inputs/Textarea.vue";

const store = useStore();
const activeConversation = inject("activeConversation");

// 消息内容
const value = ref("");

// 是否录音中
const recording = ref(false);

// 表情选择器是否显示
const showPicker = ref(false);

// 附件弹窗是否打开
const openAttachmentsModal = ref(false);

// 开始/结束录音
const handleToggleRecording = () => {
  recording.value = !recording.value;
};

// 取消录音
const handleCancelRecording = () => {
  recording.value = false;
};

// 点击外部关闭表情选择器
const handleClickOutside = (event) => {
  const target = event.target;
  const parent = target?.parentElement;

  if (
    target &&
    !target.classList.contains("toggle-picker-button") &&
    parent &&
    !parent.classList.contains("toggle-picker-button")
  ) {
    showPicker.value = false;
  }
};

// 设置草稿
const handleSetDraft = () => {
  const index = getConversationIndex(activeConversation.id);
  if (index !== undefined) {
    store.conversations[index].draftMessage = value.value;
  }
};

// 初始化草稿
onMounted(() => {
  value.value = activeConversation.draftMessage;
});
</script>


<template>
  <div class="w-full">
    <!--selected reply display-->
    <div
      class="relative transition-all duration-200"
      :class="{ 'pt-15': activeConversation?.replyMessage }"
    >
      <ReplyMessage />
    </div>

    <div
      v-if="store.status !== 'loading'"
      class="h-auto min-h-21 p-5 flex items-end"
      :class="recording ? ['justify-between'] : []"
    >
      <div class="min-h-[2.75rem]">
        <!--select attachments button-->
        <IconButton
          v-if="!recording"
          class="ic-btn-ghost-primary w-7 h-7 md:mr-5 xs:mr-4"
          title="open select attachments modal"
          aria-label="open select attachments modal"
          @click="openAttachmentsModal = true"
        >
          <PaperClipIcon class="w-[1.25rem] h-[1.25rem]" />
        </IconButton>

        <!--recording timer-->
        <p
          v-if="recording"
          class="body-1 text-indigo-300"
        >
          00:11
        </p>
      </div>

      <!--message textarea-->
      <div
        v-if="!recording"
        class="grow md:mr-5 xs:mr-4 self-end"
      >
        <div class="relative">
          <Textarea
            class="max-h-[5rem] pr-12.5 resize-none scrollbar-hidden"
            :value="value"
            auto-resize
            cols="30"
            rows="1"
            placeholder="Write your message here"
            aria-label="Write your message here"
            @value-changed="newValue => value = newValue"
            @input="handleSetDraft"
          />

          <!--emojis-->
          <div class="absolute bottom-[.8125rem] right-0">
            <!--emoji button-->
            <IconButton
              title="toggle emoji picker"
              aria-label="toggle emoji picker"
              class="ic-btn-ghost-primary toggle-picker-button w-7 h-7 md:mr-5 xs:mr-4"
              @click="showPicker = !showPicker"
            >
              <XCircleIcon
                v-if="showPicker"
                class="w-[1.25rem] h-[1.25rem]"
              />
              <FaceSmileIcon
                v-else
                class="w-[1.25rem] h-[1.25rem] text-gray-400 group-hover:text-indigo-300"
              />
            </IconButton>

            <!--emoji picker-->
            <ScaleTransition>
              <div
                v-show="showPicker"
                v-click-outside="handleClickOutside"
                class="absolute z-10 bottom-13.75 md:right-0 xs:right-[-5rem] mt-2"
              >
                <div role="none">
                  <EmojiPicker :show="showPicker" />
                </div>
              </div>
            </ScaleTransition>
          </div>
        </div>
      </div>

      <div class="min-h-[2.75rem]">
        <!--cancel recording button-->
        <div
          v-if="recording"
          @click="handleCancelRecording"
        >
          <Button class="ghost-danger ghost-text">
            Cancel
          </Button>
        </div>
      </div>

      <div class="min-h-[2.75rem] flex">
        <!--finish recording button-->
        <IconButton
          v-if="recording"
          title="finish recording"
          aria-label="finish recording"
          class="relative group w-7 h-7 flex justify-center items-center outline-none rounded-full bg-indigo-300 hover:bg-green-300 dark:hover:bg-green-400 dark:focus:bg-green-400 focus:outline-none transition-all duration-200"
          @click="handleToggleRecording"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 group-hover:bg-green-300 opacity-40"
          />

          <MicrophoneIcon
            class="w-[1.25rem] h-[1.25rem] text-white group-hover:hidden"
          />
          <CheckIcon
            class="w-[1.25rem] h-[1.25rem] hidden text-white group-hover:block"
          />
        </IconButton>

        <!--start recording button-->
        <IconButton
          v-else
          title="start recording"
          aria-label="start recording"
          class="ic-btn-ghost-primary w-7 h-7 md:mr-5 xs:mr-4"
          @click="handleToggleRecording"
        >
          <MicrophoneIcon class="w-[1.25rem] h-[1.25rem]" />
        </IconButton>

        <!--send message button-->
        <IconButton
          v-if="!recording"
          class="ic-btn-contained-primary w-7 h-7 active:scale-110"
          title="send message"
          aria-label="send message"
        >
          <PaperAirplaneIcon class="w-4.25 h-4.25" />
        </IconButton>
      </div>
    </div>

    <AttachmentsModal
      :open="openAttachmentsModal"
      :close-modal="() => (openAttachmentsModal = false)"
    />
  </div>
</template>

<style>
input[placeholder="Search emoji"] {
  background: rgba(0, 0, 0, 0);
}

.v3-emoji-picker .v3-header {
  border-bottom: 0;
}

.v3-emoji-picker .v3-footer {
  border-top: 0;
}
</style>
