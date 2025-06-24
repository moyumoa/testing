<script setup>
// 引入 Vue 工具
import { computed } from "vue";

// 引入状态管理
import useStore from "@src/store/store";

// 引入页面组件
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import Calls from "@src/components/views/HomeView/Sidebar/Calls/Calls.vue";
import Contacts from "@src/components/views/HomeView/Sidebar/Contacts/Contacts.vue";
import Conversations from "@src/components/views/HomeView/Sidebar/Conversations/Conversations.vue";
import Notifications from "@src/components/views/HomeView/Sidebar/Notifications/Notifications.vue";
import Settings from "@src/components/views/HomeView/Sidebar/Settings/Settings.vue";

// 获取全局状态
const store = useStore();

// 🧠 根据当前激活的侧边栏组件类型动态切换组件
const ActiveComponent = computed(() => {
  switch (store.activeSidebarComponent) {
    case "messages":
      return Conversations;
    case "contacts":
      return Contacts;
    case "notifications":
      return Notifications;
    case "phone":
      return Calls;
    case "settings":
      return Settings;
    default:
      return Conversations; // 默认回到消息页
  }
});
</script>

<template>
  <aside
    class="xs:w-full md:w-72.5 h-full xs:px-5 md:p-0 flex flex-col overflow-visible transition-all duration-500"
  >
    <!-- 渐变进入动画 + 当前侧边栏组件 -->
    <FadeTransition>
      <component
        :is="ActiveComponent"
        class="h-full flex flex-col"
      />
    </FadeTransition>
  </aside>
</template>
