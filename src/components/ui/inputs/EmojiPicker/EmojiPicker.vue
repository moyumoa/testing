<script setup>
import { ref } from "vue";
import Emojis from "@src/components/ui/inputs/EmojiPicker/Emojis.vue";
import EmojiSkinTones from "@src/components/ui/inputs/EmojiPicker/EmojiSkinTones.vue";
import EmojiTabs from "@src/components/ui/inputs/EmojiPicker/EmojiTabs.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";

const props = defineProps({
  show: Boolean,
});

// 当前选中的表情分组
const activeTab = ref("people");

// 搜索关键词
const keyword = ref("");

// 切换 Tab
const handleActiveTabChange = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <div
    v-if="props.show"
    class="w-75 p-5 rounded-2xl border shadow-xl shadow-outline bg-white dark:bg-gray-800 border-gray-50 dark:border-gray-700"
  >
    <!-- Tabs -->
    <EmojiTabs
      class="w-full mb-5"
      :active="activeTab"
      @tab-change="handleActiveTabChange"
    />

    <!-- Search -->
    <SearchInput
      v-model="keyword"
      class="w-full mb-5 rounded-[.75rem]"
    />

    <!-- Emojis -->
    <Emojis
      :keyword="keyword"
      :active-tab="activeTab"
      class="w-full mb-5"
    />

    <!-- Skin tones -->
    <EmojiSkinTones class="w-full" />
  </div>
</template>
