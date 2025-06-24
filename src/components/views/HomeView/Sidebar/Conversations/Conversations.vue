<script setup>
// 👉 引入依赖
import { ref, onMounted, watch } from "vue";
import useStore from "@src/store/store";
import { getActiveConversationId, getName } from "@src/utils";
import { useRoute } from 'vue-router'
const route = useRoute()

// 👉 引入图标组件 & 子组件
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import ComposeModal from "@src/components/shared/modals/ComposeModal/ComposeModal.vue";
import NoConversation from "@src/components/states/empty-states/NoConversation.vue";
import Circle2Lines from "@src/components/states/loading-states/Circle2Lines.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import ArchivedButton from "@src/components/views/HomeView/Sidebar/Conversations/ArchivedButton.vue";
import ConversationsList from "@src/components/views/HomeView/Sidebar/Conversations/ConversationsList.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";

// 👉 初始化 store
const store = useStore();

// 搜索关键字
const keyword = ref("");

// 是否打开新建会话弹窗
const composeOpen = ref(false);

// 是否查看归档会话
const openArchive = ref(false);

// 当前过滤后的会话列表
const filteredConversations = ref(store.conversations);

// 👉 监听搜索关键字或归档开关变化，重新过滤会话列表
watch([keyword, openArchive], () => {
  const target = openArchive.value ? store.archivedConversations : store.conversations;
  filteredConversations.value = target?.filter((conversation) => {
    return getName(conversation)?.toLowerCase().includes(keyword.value.toLowerCase());
  }) || [];
});

// 👉 关闭新建会话弹窗
const closeComposeModal = () => {
  composeOpen.value = false;
};

// 👉 初始化时判断当前激活会话是否为归档会话
onMounted(() => {
  const isInArchive = store.archivedConversations.find(
    (conversation) => conversation.id === getActiveConversationId(route)
  );
  if (isInArchive) openArchive.value = true;
});
</script>

<template>
  <div>
    <!-- 左侧栏标题 & 操作按钮 -->
    <SidebarHeader>
      <template #title>
        Messages
      </template>
      <template #actions>
        <IconButton
          class="ic-btn-ghost-primary w-7 h-7"
          aria-label="compose conversation"
          title="compose conversation"
          @click="composeOpen = true"
        >
          <PencilSquareIcon class="w-[1.25rem] h-[1.25rem]" />
        </IconButton>
      </template>
    </SidebarHeader>

    <!-- 搜索框 -->
    <div class="px-5 xs:pb-6 md:pb-5">
      <SearchInput
        :value="keyword"
        @value-changed="(value) => (keyword.value = value)"
      />
    </div>

    <!-- 会话区域 -->
    <div
      role="list"
      aria-label="conversations"
      class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <!-- 加载中 -->
      <template v-if="store.status === 'loading' || store.delayLoading">
        <Circle2Lines
          v-for="index in 6"
          :key="index"
        />
      </template>

      <!-- 加载完成 -->
      <div v-else>
        <!-- 切换查看归档按钮 -->
        <ArchivedButton
          v-if="store.archivedConversations.length > 0"
          :open="openArchive"
          @click="openArchive = !openArchive"
        />

        <!-- 会话列表 -->
        <div
          v-if="
            store.status === 'success' &&
              !store.delayLoading &&
              filteredConversations.length > 0
          "
        >
          <FadeTransition>
            <component
              :is="ConversationsList"
              :key="openArchive ? 'archive' : 'active'"
              :filtered-conversations="filteredConversations"
            />
          </FadeTransition>
        </div>

        <!-- 空状态 -->
        <div v-else>
          <NoConversation v-if="store.archivedConversations.length === 0" />
        </div>
      </div>
    </div>

    <!-- 新建会话弹窗 -->
    <ComposeModal
      :open="composeOpen"
      :close-modal="closeComposeModal"
    />
  </div>
</template>
