<script setup>
// 👉 引入侧边栏头部组件
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";
// 👉 引入设置页的手风琴组件
import SettingsAccordion from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/SettingsAccordion.vue";
</script>

<template>
  <div>
    <!-- 设置页标题栏 -->
    <SidebarHeader>
      <template #title>
        Settings
      </template>
    </SidebarHeader>

    <!-- 设置内容区域，带滚动条 -->
    <div
      class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <SettingsAccordion />
    </div>
  </div>
</template>
