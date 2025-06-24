<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import useStore from "@src/store/store";
import { fetchData } from "@src/store/defaults";

import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";

const store = useStore();

// 🌟 当状态变化时同步到 localStorage
store.$subscribe((_mutation, state) => {
  localStorage.setItem("chat", JSON.stringify(state));
});

// 🌟 组件挂载时：从服务器加载数据
onMounted(async () => {
  store.status = "loading";

  // 模拟延迟加载状态
  setTimeout(() => {
    store.delayLoading = false;
  });

  // 模拟获取用户与会话数据
  const request = await fetchData();

  store.$patch({
    status: "success",
    user: request.data.user,
    conversations: request.data.conversations,
    notifications: request.data.notifications,
    archivedConversations: request.data.archivedConversations,
  });
});

// 📐 页面高度（用于设置主视图高度）
const height = ref(`${window.innerHeight}px`);

// 🌟 设置高度更新函数（窗口大小变化时触发）
const resizeWindow = () => {
  height.value = `${window.innerHeight}px`;
};

// 🪟 组件挂载时监听窗口变化
onMounted(() => {
  window.addEventListener("resize", resizeWindow);
});

// 🧹 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>

<template>
  <!-- 🌙 暗黑模式控制 -->
  <div :class="{ dark: store.settings.darkMode }">
    <div
      class="bg-white dark:bg-gray-800 transition-colors duration-500"
      :style="{ height: height }"
    >
      <!-- 👀 渲染当前路由视图组件，带过渡效果 -->
      <router-view v-slot="{ Component }">
        <FadeTransition>
          <component :is="Component" />
        </FadeTransition>
      </router-view>
    </div>
  </div>
</template>
