<script setup>
// 引入 Pinia store
import useStore from "@src/store/store";

// 引入组件
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import Navigation from "@src/components/views/HomeView/Navigation/Navigation.vue";
import Sidebar from "@src/components/views/HomeView/Sidebar/Sidebar.vue";

// 获取当前会话 ID 的工具函数
import { getActiveConversationId } from "@src/utils";
import { useRoute } from 'vue-router'
const route = useRoute()

const store = useStore();
</script>

<template>
  <KeepAlive>
    <div class="xs:relative md:static h-full flex xs:flex-col md:flex-row overflow-hidden">
      <!-- 导航栏 -->
      <Navigation class="xs:order-1 md:order-none" />

      <!-- 侧边栏 -->
      <Sidebar
        class="xs:grow-1 md:grow-0 xs:overflow-y-scroll md:overflow-visible scrollbar-hidden"
      />

      <!-- 聊天内容区域 -->
      <div
        id="mainContent"
        class="xs:absolute xs:z-10 md:static grow h-full xs:w-full md:w-fit scrollbar-hidden bg-white dark:bg-gray-800 transition-all duration-500"
        :class="
          getActiveConversationId(route)
            ? ['xs:-left-[0rem]', 'xs:static']
            : ['xs:left-250']
        "
        role="region"
      >
        <router-view v-slot="{ Component }">
          <FadeTransition
            name="fade"
            mode="out-in"
          >
            <component
              :is="Component"
              :key="getActiveConversationId(route)"
            />
          </FadeTransition>
        </router-view>
      </div>
    </div>
  </KeepAlive>
</template>
