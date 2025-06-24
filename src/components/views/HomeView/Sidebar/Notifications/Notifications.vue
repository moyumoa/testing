<script setup>
// 👉 导入通知类型定义（虽然 JS 不会用到，但如果保留 .d.ts 文件就能继续享受提示）
import useStore from "@src/store/store";

// 👉 引入组件
import NoNotifications from "@src/components/states/empty-states/NoNotifications.vue";
import Circle2Lines from "@src/components/states/loading-states/Circle2Lines.vue";
import Notification from "@src/components/views/HomeView/Sidebar/Notifications/Notification.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";

// 👉 全局状态
const store = useStore();
</script>

<template>
  <div>
    <!--侧边栏标题-->
    <SidebarHeader>
      <template #title>
        通知
      </template>
    </SidebarHeader>

    <!--通知内容区域-->
    <div
      class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <!--加载中状态，显示6个动画图标-->
      <template
        v-if="
          store.status === 'loading' ||
            (store.delayLoading && store.notifications.length > 0)
        "
      >
        <Circle2Lines
          v-for="item in 6"
          :key="item"
        />
      </template>

      <!--加载完成，渲染通知项-->
      <Notification
        v-for="(notification, index) in store.notifications"
        v-else-if="store.status === 'success' && !store.delayLoading"
        :key="index"
        :notification="notification"
      />

      <!--无通知时的占位提示-->
      <NoNotifications v-else />
    </div>
  </div>
</template>
