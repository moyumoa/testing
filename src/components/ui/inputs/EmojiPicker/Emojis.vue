<script setup>
import { watch, ref, onMounted } from "vue";
import useStore from "@src/store/store";
import { unicodeToEmoji } from "@src/utils";

import emojis from "@src/components/ui/inputs/EmojiPicker/emojis.json";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";

const props = defineProps({
  keyword: String,
  activeTab: String,
});

const store = useStore();

// 按关键字和肤色过滤后的 emoji 数据
const filteredEmojis = ref(emojis);

// 搜索匹配 emoji
const filterEmojis = () => {
  const _emojiGroups = {};

  Object.keys(emojis).forEach((key) => {
    const _emojis = [];

    if (key === props.activeTab) {
      emojis[key].forEach((emoji) => {
        if (emoji.n[0].includes(props.keyword.toLowerCase())) {
          let result = emoji.u;

          if (store.emojiSkinTone !== "neutral" && Array.isArray(emoji.v)) {
            const index = emoji.v.findIndex((v) =>
              v.includes(store.emojiSkinTone)
            );
            if (index !== -1) {
              result = emoji.v[index];
            }
          }

          _emojis.push({ ...emoji, r: result });
        }
      });

      if (_emojis.length) {
        _emojiGroups[key] = _emojis;
      }
    }
  });

  return _emojiGroups;
};

// 监听搜索关键字、Tab 和肤色变化
watch(
  () => [props.keyword, props.activeTab, store.emojiSkinTone],
  () => {
    filteredEmojis.value = filterEmojis();
  }
);

// 初始化时执行一次过滤
onMounted(() => {
  filteredEmojis.value = filterEmojis();
});
</script>

<template>
  <ScrollBox class="w-full max-h-68.5 overflow-y-scroll">
    <div
      v-for="[name, group] in Object.entries(filteredEmojis)"
      :key="name"
      class="mb-6"
    >
      <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
        {{ name }}
      </p>
      <div class="flex flex-wrap justify-start">
        <div
          v-for="emoji in group"
          :key="emoji.r"
        >
          <IconButton
            v-if="emoji && emoji.r"
            class="ic-btn-ghost-gray w-7.5 h-7.5 mr-1"
            :title="emoji.n[0]"
            :aria-label="emoji.n[0]"
          >
            {{ unicodeToEmoji(emoji.r) }}
          </IconButton>
        </div>
      </div>
    </div>
  </ScrollBox>
</template>
