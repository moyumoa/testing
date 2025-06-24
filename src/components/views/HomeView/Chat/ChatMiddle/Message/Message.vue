<script setup>
// ✅ 引入 Vue 相关
import { inject, ref } from "vue";

// ✅ 工具函数
import linkifyStr from "linkify-string";
import { getFullName, getMessageById } from "@src/utils";

// ✅ 引入组件
import Attachments from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Attachments.vue";
import LinkPreview from "@src/components/views/HomeView/Chat/ChatMiddle/Message/LinkPreview.vue";
import MessageContextMenu from "@src/components/views/HomeView/Chat/ChatMiddle/Message/MessageContextMenu.vue";
import Receipt from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Receipt.vue";
import Recording from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Recording.vue";
import MessagePreview from "@src/components/views/HomeView/Chat/MessagePreview.vue";

// ✅ 接收 props
const props = defineProps({
  message: Object,
  followUp: Boolean,
  self: Boolean,
  divider: Boolean,
  selected: Boolean,
  handleSelectMessage: Function,
  handleDeselectMessage: Function,
});

// ✅ 注入会话
const activeConversation = inject("activeConversation");

// ✅ 控制右键菜单显示
const showContextMenu = ref(false);
const contextMenuCoordinations = ref({ x: 0, y: 0 });

// ✅ 打开右键菜单
const handleShowContextMenu = (event) => {
  showContextMenu.value = true;
  contextMenuCoordinations.value = {
    x:
      window.innerWidth - 220 <= event.pageX
        ? window.innerWidth - 250
        : event.pageX,
    y:
      window.innerHeight - 300 <= event.pageY
        ? window.innerHeight - 250
        : event.pageY,
  };
};

// ✅ 关闭右键菜单
const handleCloseContextMenu = () => {
  showContextMenu.value = false;
};

// ✅ 用于指令点击外部关闭菜单
const contextConfig = {
  handler: handleCloseContextMenu,
  events: ["contextmenu"],
};

// ✅ 控制是否隐藏头像
const hideAvatar = () => {
  if (props.divider && !props.self) return false;
  if (props.followUp || props.self) return true;
  return false;
};

// ✅ 获取回复的消息
const replyMessage = getMessageById(activeConversation, props.message.replyTo);
</script>

<template>
  <div class="select-none">
    <div
      class="xs:mb-6 md:mb-5 flex"
      :class="{ 'justify-end': props.self }"
    >
      <!-- 头像 -->
      <div
        class="mr-4"
        :class="{ 'ml-[2.25rem]': props.followUp && !divider }"
      >
        <div
          v-if="!hideAvatar()"
          :aria-label="getFullName(props.message.sender)"
          class="outline-none"
        >
          <div
            :style="{ backgroundImage: `url(${props.message.sender.avatar})` }"
            class="w-[2.25rem] h-[2.25rem] bg-cover bg-center rounded-full"
          />
        </div>
      </div>

      <div class="flex items-end">
        <!-- 气泡内容 -->
        <div
          v-click-outside="contextConfig"
          class="group max-w-125 p-5 rounded-b-xl transition duration-500"
          :class="{
            'rounded-tl-xl ml-4 order-2 bg-indigo-50 dark:bg-gray-600': props.self && !props.selected,
            'rounded-tr-xl mr-4 bg-gray-50 dark:bg-gray-600': !props.self && !props.selected,
            'rounded-tl-xl ml-4 order-2 bg-indigo-200 dark:bg-indigo-500': props.self && props.selected,
            'rounded-tr-xl mr-4 bg-indigo-200 dark:bg-indigo-500': !props.self && props.selected,
          }"
          @click="handleCloseContextMenu"
          @contextmenu.prevent="handleShowContextMenu"
        >
          <!-- 回复内容 -->
          <MessagePreview
            v-if="replyMessage"
            :message="replyMessage"
            :self="props.self"
            class="mb-5 px-3"
          />

          <!-- 文本内容 -->
          <p
            v-if="props.message.content && props.message.type !== 'recording'"
            class="body-2 outline-none text-black opacity-60 dark:text-white dark:opacity-70"
            tabindex="0"
            v-html="
              linkifyStr(props.message.content, {
                className: props.self
                  ? 'text-black opacity-50'
                  : 'text-indigo-500 dark:text-indigo-300',
                format: {
                  url: (value) =>
                    value.length > 50 ? value.slice(0, 50) + `…` : value,
                },
              })
            "
          />

          <!-- 录音消息 -->
          <div
            v-else-if="props.message.content && props.message.type === 'recording'"
          >
            <Recording
              :recording="props.message.content"
              :self="props.self"
            />
          </div>

          <!-- 附件 -->
          <Attachments
            v-if="props.message.attachments?.length > 0"
            :message="props.message"
            :self="props.self"
          />

          <!-- 链接预览 -->
          <LinkPreview
            v-if="props.message.previewData && !props.message.attachments"
            :self="props.self"
            :preview-data="props.message.previewData"
            class="mt-5"
          />
        </div>

        <!-- 时间 -->
        <div :class="props.self ? ['ml-4', 'order-1'] : ['mr-4']">
          <p class="body-1 text-black/70 dark:text-white/70 whitespace-pre">
            {{ props.message.date }}
          </p>
        </div>

        <!-- 状态：已读/已送达 -->
        <Receipt
          v-if="props.self"
          :state="props.message.state"
        />
      </div>
    </div>

    <!-- 右键菜单组件 -->
    <MessageContextMenu
      :selected="props.selected"
      :message="props.message"
      :show="showContextMenu"
      :left="contextMenuCoordinations.x"
      :top="contextMenuCoordinations.y"
      :handle-close-context-menu="handleCloseContextMenu"
      :handle-select-message="props.handleSelectMessage"
      :handle-deselect-message="props.handleDeselectMessage"
    />
  </div>
</template>
