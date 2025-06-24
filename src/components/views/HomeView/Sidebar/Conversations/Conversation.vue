<script setup>
// 👉 引入依赖
import { ref, computed } from "vue";
import useStore from "@src/store/store";
import {
  getActiveConversationId,
  getAvatar,
  getConversationIndex,
  getName,
  hasAttachments,
  shorten,
} from "@src/utils";
import router from "@src/router";
import { useRoute } from 'vue-router'
const route = useRoute()

// 👉 引入图标组件和子组件
import {
  ArchiveBoxArrowDownIcon,
  InformationCircleIcon,
  MicrophoneIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@src/components/ui/navigation/Dropdown/DropdownLink.vue";

const props = defineProps({
  conversation: Object,
});

const store = useStore();
const showContextMenu = ref(false); // 是否显示右键菜单
const contextMenuCoordinations = ref(); // 右键菜单位置

// 显示右键菜单
const handleShowContextMenu = (event) => {
  showContextMenu.value = true;
  contextMenuCoordinations.value = {
    x:
      window.innerWidth - 205 <= event.pageX
        ? window.innerWidth - 220
        : event.pageX,
    y:
      window.innerHeight - 125 <= event.pageY
        ? window.innerHeight - 200
        : event.pageY,
  };
};

// 关闭右键菜单
const handleCloseContextMenu = () => {
  showContextMenu.value = false;
};

// 选中当前会话
const handleSelectConversation = () => {
  showContextMenu.value = false;
  router.push({ path: `/chat/${props.conversation.id}/` });
};

// 最后一条消息
const lastMessage = computed(
  () => props.conversation.messages[props.conversation.messages.length - 1]
);

// 移除未读标识
const handleRemoveUnread = () => {
  let index = getConversationIndex(props.conversation.id);
  if (index !== undefined) {
    store.conversations[index].unread = 0;
  }
};

// 当前会话是否激活
const isActive = computed(
  () => getActiveConversationId(route) === props.conversation.id
);
</script>

<template>
  <div class="select-none">
    <!-- 会话按钮 -->
    <button
      :aria-label="'conversation with' + getName(props.conversation)"
      tabindex="0"
      class="w-full h-23 px-5 py-6 mb-3 flex rounded focus:outline-none transition duration-500 ease-out"
      :class="{
        'md:bg-indigo-50': isActive,
        'md:dark:bg-gray-600': isActive,
      }"
      @contextmenu.prevent="handleShowContextMenu"
      @click="() => { handleRemoveUnread(); handleSelectConversation(); }"
    >
      <!-- 头像 -->
      <div class="mr-4">
        <div
          :style="{ backgroundImage: `url(${getAvatar(props.conversation)})` }"
          class="w-7 h-7 rounded-full bg-cover bg-center"
        />
      </div>

      <!-- 会话内容 -->
      <div class="w-full flex flex-col">
        <div class="flex items-start justify-between">
          <p class="heading-2 text-black/70 dark:text-white/70">
            {{ getName(props.conversation) }}
          </p>
          <p class="body-1 text-black/70 dark:text-white/70">
            {{ lastMessage?.date }}
          </p>
        </div>

        <!-- 最后一条消息展示 -->
        <div class="flex justify-between">
          <div>
            <p
              v-if="props.conversation.draftMessage && props.conversation.id !== getActiveConversationId()"
              class="body-2 flex items-center text-red-400"
            >
              draft: {{ shorten(props.conversation.draftMessage) }}
            </p>

            <p
              v-else-if="lastMessage.type === 'recording' && lastMessage.content"
              class="body-2 flex items-center"
              :class="{ 'text-indigo-400': props.conversation.unread }"
            >
              <MicrophoneIcon class="w-4 h-4 mr-2" />
              <span>{{ 'Recording ' + lastMessage.content.duration }}</span>
            </p>

            <p
              v-else-if="hasAttachments(lastMessage)"
              class="body-2 flex items-center"
              :class="{ 'text-indigo-400': props.conversation.unread }"
            >
              <span>{{ lastMessage.attachments[0].name }}</span>
            </p>

            <p
              v-else
              class="body-2 flex items-center"
              :class="{ 'text-indigo-400': props.conversation.unread }"
            >
              <span>{{ shorten(lastMessage) }}</span>
            </p>
          </div>

          <!-- 未读提示 -->
          <div v-if="props.conversation.unread">
            <div class="w-4.5 h-4.5 flex items-center justify-center rounded-full bg-indigo-300">
              <p class="body-1 text-white">
                {{ props.conversation.unread }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>

    <!-- 右键菜单 -->
    <Dropdown
      :close-dropdown="() => (showContextMenu = false)"
      :show="showContextMenu"
      :handle-close="handleCloseContextMenu"
      :handle-click-outside="handleCloseContextMenu"
      :coordinates="{
        left: contextMenuCoordinations?.x + 'px',
        top: contextMenuCoordinations?.y + 'px',
      }"
      :position="['top-0']"
    >
      <button
        class="dropdown-link dropdown-link-primary"
        @click="handleCloseContextMenu"
      >
        <InformationCircleIcon class="h-5 w-5 mr-3" />
        Conversation info
      </button>
      <button
        class="dropdown-link dropdown-link-primary"
        @click="handleCloseContextMenu"
      >
        <ArchiveBoxArrowDownIcon class="h-5 w-5 mr-3" />
        Archive conversation
      </button>
      <button
        class="dropdown-link dropdown-link-danger"
        @click="handleCloseContextMenu"
      >
        <TrashIcon class="h-5 w-5 mr-3" />
        Delete conversation
      </button>
    </Dropdown>
  </div>
</template>
