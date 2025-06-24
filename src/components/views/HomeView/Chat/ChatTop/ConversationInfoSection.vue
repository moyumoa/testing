<script setup>
// Vue 相关
import { inject, ref } from "vue";

// 路由 & 状态
import router from "@src/router";
import { activeCall } from "@src/store/defaults";
import useStore from "@src/store/store";

// 工具函数
import { getAvatar, getName } from "@src/utils";

// Heroicons 图标
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PhoneIcon,
  ShareIcon,
} from "@heroicons/vue/24/outline";

// 组件
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@src/components/ui/navigation/Dropdown/DropdownLink.vue";

// 接收 props
const props = defineProps({
  handleOpenInfo: Function,
  handleOpenSearch: Function,
});

const store = useStore();

// 注入当前会话
const activeConversation = inject("activeConversation");

// 控制 dropdown 显隐
const showDropdown = ref(false);

// 👉 关闭 dropdown 菜单（点击项）
const handleCloseDropdown = () => {
  showDropdown.value = false;
};

// 👉 关闭 dropdown 菜单（点击外部区域）
const handleClickOutside = (event) => {
  const target = event.target;
  const parentElement = target.parentElement;

  if (
    !target.classList.contains("open-top-menu") &&
    !(parentElement && parentElement.classList.contains("open-top-menu"))
  ) {
    handleCloseDropdown();
  }
};

// 👉 返回聊天首页
const handleCloseConversation = () => {
  router.push({ path: "/chat/" });
};

// 👉 打开语音通话
const handleOpenVoiceCallModal = () => {
  store.activeCall = activeCall;
  store.callMinimized = false;

  // 等待动画展开
  setTimeout(() => {
    store.openVoiceCall = true;
  }, 300);
};
</script>

<template>
  <!-- 🧾 会话顶部信息 -->
  <div class="w-full flex justify-center items-center">
    <!-- ⬅️ 返回按钮（仅移动端显示） -->
    <div class="group mr-4 md:hidden">
      <IconButton
        class="ic-btn-ghost-primary w-7 h-7"
        title="关闭会话"
        aria-label="关闭会话"
        @click="handleCloseConversation"
      >
        <ChevronLeftIcon class="w-[1.25rem] h-[1.25rem]" />
      </IconButton>
    </div>

    <!-- 🧍 用户头像和信息 -->
    <div
      v-if="store.status !== 'loading'"
      class="flex grow"
    >
      <button
        class="mr-5 outline-none"
        aria-label="查看资料"
        @click="props.handleOpenInfo"
      >
        <div
          :style="{ backgroundImage: `url(${getAvatar(activeConversation)})` }"
          class="w-[2.25rem] h-[2.25rem] rounded-full bg-cover bg-center"
        />
      </button>

      <div class="flex flex-col">
        <p
          class="w-fit heading-2 text-black/70 dark:text-white/70 mb-2 cursor-pointer"
          tabindex="0"
          @click="props.handleOpenInfo"
        >
          {{ getName(activeConversation) }}
        </p>
        <p
          class="body-2 text-black/70 dark:text-white/70 font-extralight rounded-[.25rem]"
          tabindex="0"
          aria-label="上次在线时间：2019年12月16日"
        >
          Last seen Dec 16, 2019
        </p>
      </div>
    </div>

    <!-- 🔍 操作按钮区 -->
    <div
      class="flex"
      :class="{ hidden: store.status === 'loading' }"
    >
      <!-- 🔍 搜索按钮 -->
      <IconButton
        title="搜索消息"
        aria-label="搜索消息"
        class="ic-btn-ghost-primary w-7 h-7 mr-3"
        @click="props.handleOpenSearch"
      >
        <MagnifyingGlassIcon
          class="w-[1.25rem] h-[1.25rem] text-gray-400 group-hover:text-indigo-300"
        />
      </IconButton>

      <!-- ⬇️ 下拉菜单 -->
      <div class="relative">
        <IconButton
          id="open-conversation-menu"
          class="ic-btn-ghost-primary open-top-menu group w-7 h-7"
          :aria-expanded="showDropdown"
          tabindex="0"
          aria-controls="conversation-menu"
          title="切换菜单"
          aria-label="切换菜单"
          @click="showDropdown = !showDropdown"
        >
          <EllipsisVerticalIcon class="open-top-menu w-[1.25rem] h-[1.25rem]" />
        </IconButton>

        <Dropdown
          id="conversation-menu"
          :close-dropdown="handleCloseDropdown"
          :show="showDropdown"
          :position="['right-0']"
          :handle-click-outside="handleClickOutside"
          aria-labelledby="open-conversation-menu"
        >
          <!-- 📋 查看资料 -->
          <button
            class="dropdown-link dropdown-link-primary"
            aria-label="查看资料"
            role="menuitem"
            @click="() => { handleCloseDropdown(); props.handleOpenInfo(); }"
          >
            <InformationCircleIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            查看资料
          </button>

          <!-- 📞 发起语音通话 -->
          <button
            class="dropdown-link dropdown-link-primary"
            aria-label="发起语音通话"
            role="menuitem"
            @click="() => { handleCloseDropdown(); handleOpenVoiceCallModal(); }"
          >
            <PhoneIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            语音通话
          </button>

          <!-- 📤 分享内容 -->
          <button
            class="dropdown-link dropdown-link-primary"
            aria-label="共享内容"
            role="menuitem"
            @click="handleCloseDropdown"
          >
            <ShareIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            已共享内容
          </button>

          <!-- 🚫 拉黑对方 -->
          <button
            class="dropdown-link dropdown-link-danger"
            aria-label="拉黑对方"
            role="menuitem"
            @click="handleCloseDropdown"
          >
            <NoSymbolIcon class="h-5 w-5 mr-3" />
            拉黑
          </button>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
