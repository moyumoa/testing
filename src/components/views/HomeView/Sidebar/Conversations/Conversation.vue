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

const handleRemoveUnreadAndSelectConversation = () => {
  handleRemoveUnread();
  handleSelectConversation();
};

</script>

<template>
  <div class="select-none">
    <!-- 会话按钮 -->
    <button
      :aria-label="'conversation with' + getName(props.conversation)"
      tabindex="0"
      class="w-full h-23 px-5 py-6 mb-3 flex rounded focus:bg-indigo-50 dark:active:bg-gray-600 dark:focus:bg-gray-600 dark:hover:bg-gray-600 hover:bg-indigo-50 active:bg-indigo-100 focus:outline-none transition duration-500 ease-out"
      :class="{
        'md:bg-indigo-50': isActive,
        'md:dark:bg-gray-600': isActive,
      }"
      @contextmenu.prevent="handleShowContextMenu"
      @click="handleRemoveUnreadAndSelectConversation"
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
        <div class="w-full">
          <!--conversation name-->
          <div class="flex items-start">
            <div class="grow mb-3 text-start">
              <p class="heading-2 text-black/70 dark:text-white/70">
                {{ getName(props.conversation) }}
              </p>
            </div>

            <!--last message date-->
            <p class="body-1 text-black/70 dark:text-white/70">
              {{ lastMessage?.date }}
            </p>
          </div>
        </div>

        <div class="flex justify-between">
          <div>
            <!--draft Message-->
            <p
              v-if="
                props.conversation.draftMessage &&
                  props.conversation.id !== getActiveConversationId()
              "
              class="body-2 flex justify-start items-center text-red-400"
            >
              draft: {{ shorten(props.conversation.draftMessage) }}
            </p>

            <!--recording name-->
            <p
              v-else-if="
                lastMessage.type === 'recording' && lastMessage.content
              "
              class="body-2 text-black/70 dark:text-white/70 flex justify-start items-center"
            >
              <MicrophoneIcon
                class="w-4 h-4 mr-2 text-black opacity-60 dark:text-white dark:opacity-70"
                :class="{ 'text-indigo-400': props.conversation.unread }"
              />
              <span :class="{ 'text-indigo-400': props.conversation.unread }">
                Recording
                {{ lastMessage.content.duration }}
              </span>
            </p>

            <!--attachments title-->
            <p
              v-else-if="hasAttachments(lastMessage)"
              class="body-2 text-black/70 dark:text-white/70 flex justify-start items-center"
              :class="{ 'text-indigo-400': props.conversation.unread }"
            >
              <span :class="{ 'text-indigo-400': props.conversation.unread }">
                {{ lastMessage?.attachments[0].name }}
              </span>
            </p>

            <!--last message content -->
            <p
              v-else
              class="body-2 text-black/70 dark:text-white/70 flex justify-start items-center"
              :class="{ 'text-indigo-400': props.conversation.unread }"
            >
              <span :class="{ 'text-indigo-400': props.conversation.unread }">
                {{ shorten(lastMessage) }}
              </span>
            </p>
          </div>

          <div v-if="props.conversation.unread">
            <div
              class="w-4.5 h-4.5 flex justify-center items-center rounded-[50%] bg-indigo-300"
            >
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
        aria-label="Show conversation information"
        role="menuitem"
        @click="handleCloseContextMenu"
      >
        <InformationCircleIcon class="h-5 w-5 mr-3" />
        Conversation info
      </button>

      <button
        class="dropdown-link dropdown-link-primary"
        aria-label="Add conversation to archive"
        role="menuitem"
        @click="handleCloseContextMenu"
      >
        <ArchiveBoxArrowDownIcon class="h-5 w-5 mr-3" />
        Archive conversation
      </button>

      <button
        class="dropdown-link dropdown-link-danger"
        aria-label="Delete the conversation"
        role="menuitem"
        @click="handleCloseContextMenu"
      >
        <TrashIcon class="h-5 w-5 mr-3" />
        Delete conversation
      </button>
    </Dropdown>
  </div>
</template>
