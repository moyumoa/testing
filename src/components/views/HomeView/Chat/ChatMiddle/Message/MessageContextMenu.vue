<script setup>
// 导入类型相关内容已移除（JS不需要）
import { inject } from "vue";

import useStore from "@src/store/store";
import { getConversationIndex } from "@src/utils";

// 图标组件
import {
  ArrowUturnLeftIcon,
  BookmarkSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/vue/24/outline";

// 自定义组件
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";

// 接收 props 参数
const props = defineProps({
  message: Object,
  show: Boolean,
  left: Number,
  top: Number,
  selected: Boolean,
  handleCloseContextMenu: Function,
  handleSelectMessage: Function,
  handleDeselectMessage: Function,
});

// 获取全局 store
const store = useStore();

// 注入当前激活的会话
const activeConversation = inject("activeConversation");

// 🧷 设为置顶消息
const handlePinMessage = () => {
  props.handleCloseContextMenu();

  if (activeConversation) {
    const index = getConversationIndex(activeConversation.id);

    if (store.conversations && index !== undefined && index !== null) {
      store.conversations[index].pinnedMessage = props.message;
      store.conversations[index].pinnedMessageHidden = false;
    }
  }
};

// 💬 设置回复消息
const handleReplyToMessage = () => {
  props.handleCloseContextMenu();

  if (activeConversation) {
    const index = getConversationIndex(activeConversation.id);

    if (store.conversations && index !== undefined && index !== null) {
      store.conversations[index].replyMessage = props.message;
    }
  }
};
</script>

<template>
  <!-- 自定义右键菜单 -->
  <Dropdown
    :close-dropdown="handleCloseContextMenu"
    :handle-click-outside="handleCloseContextMenu"
    :show="show"
    :coordinates="{ left: props.left + 'px', top: props.top + 'px' }"
    :position="['top-0']"
  >
    <!-- 回复消息 -->
    <button
      class="dropdown-link dropdown-link-primary"
      role="menuitem"
      aria-label="reply to this message"
      @click="handleReplyToMessage"
    >
      <ArrowUturnLeftIcon class="h-5 w-5 mr-3" />
      Reply
    </button>

    <!-- 复制消息 -->
    <button
      class="dropdown-link dropdown-link-primary"
      role="menuitem"
      aria-label="copy this message"
      @click="handleCloseContextMenu"
    >
      <ClipboardDocumentIcon class="h-5 w-5 mr-3" />
      Copy
    </button>

    <!-- 置顶消息 -->
    <button
      class="dropdown-link dropdown-link-primary"
      role="menuitem"
      aria-label="pin this message"
      @click="handlePinMessage"
    >
      <BookmarkSquareIcon class="h-5 w-5 mr-3" />
      Pin
    </button>

    <!-- 选择 / 取消选择 -->
    <button
      v-if="props.selected"
      class="dropdown-link dropdown-link-primary"
      role="menuitem"
      aria-label="deselect this message"
      @click="
        () => {
          handleCloseContextMenu();
          props.handleDeselectMessage(props.message.id);
        }
      "
    >
      <XCircleIcon class="h-5 w-5 mr-3" />
      Deselect
    </button>

    <button
      v-else
      class="dropdown-link dropdown-link-primary"
      role="menuitem"
      aria-label="select this message"
      @click="
        () => {
          handleCloseContextMenu();
          props.handleSelectMessage(props.message.id);
        }
      "
    >
      <CheckCircleIcon class="h-5 w-5 mr-3" />
      Select
    </button>

    <!-- 删除消息 -->
    <button
      class="dropdown-link dropdown-link-danger"
      role="menuitem"
      aria-label="delete this message"
      @click="handleCloseContextMenu"
    >
      <TrashIcon class="h-5 w-5 mr-3" />
      Delete Message
    </button>
  </Dropdown>
</template>
