<script setup>
import useStore from "@src/store/store";
import { getFullName, hasAttachments, shorten } from "@src/utils";

const props = defineProps({
  message: Object,
  self: Boolean,
});

const store = useStore();
</script>

<template>
  <div
    v-if="props.message"
    class="border-l-2 pl-3 cursor-pointer outline-none duration-200"
    :class="['border-gray-900/50', 'dark:border-white/50']"
    tabindex="0"
    :aria-label="'reply to: ' + getFullName(props.message.sender)"
  >
    <!-- 👤 发信人名称 -->
    <p
      class="mb-3 font-semibold text-xs leading-4 tracking-[.01rem]"
      :class="['text-black', 'opacity-60', 'dark:text-white', 'dark:opacity-70']"
    >
      {{
        store.user && props.message.sender.id !== store.user.id
          ? getFullName(props.message.sender)
          : "You"
      }}
    </p>

    <!-- 📝 文本消息内容 -->
    <p
      v-if="props.message.type !== 'recording' && props.message.content"
      class="body-2 text-black opacity-50 dark:text-white dark:opacity-70"
    >
      {{ shorten(props.message, 60) }}
    </p>

    <!-- 📎 附件标题 -->
    <p
      v-else-if="hasAttachments(props.message)"
      class="body-2 text-black opacity-50 dark:text-white dark:opacity-70"
    >
      {{ props.message.attachments?.[0].name }}
    </p>

    <!-- 🎙️ 语音录音占位 -->
    <p
      v-else-if="props.message.type === 'recording'"
      class="body-2 text-black opacity-50 dark:text-white dark:opacity-70"
    >
      recording 23s
    </p>
  </div>
</template>
