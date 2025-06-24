<script setup>
// 引入图标组件
import { LinkIcon } from "@heroicons/vue/24/outline";

// 接收父组件传入的 props
const props = defineProps({
  self: Boolean, // 是否是自己发送的消息
  previewData: Object // 链接预览的数据（包含 title、description、image、link、domain 等）
});
</script>

<template>
  <!-- 外层容器：左边带竖线 -->
  <div
    class="border-l pl-3 cursor-pointer duration-200"
    :class="
      props.self
        ? ['border-white/50']
        : ['border-black/70', 'dark:border-white']
    "
  >
    <!-- 链接标题 -->
    <p
      class="mb-3 font-semibold text-xs leading-4 tracking-[.01rem]"
      :class="
        props.self
          ? ['text-white']
          : ['text-black', 'opacity-50', 'dark:text-white', 'dark:opacity-70']
      "
    >
      {{ props.previewData.title }}
    </p>

    <!-- 链接描述 -->
    <p
      class="font-normal text-xs leading-4 tracking-[.01rem]"
      :class="
        props.self
          ? ['text-white']
          : ['text-black', 'opacity-50', 'dark:text-white', 'dark:opacity-70']
      "
    >
      {{ props.previewData.description }}
    </p>

    <!-- 预览图片 -->
    <img
      :src="props.previewData.image"
      class="my-5 rounded-sm"
      :alt="props.previewData.link"
    >

    <!-- 链接域名（带图标）-->
    <a
      :href="props.previewData.link"
      class="font-normal text-xs leading-4 tracking-[.01rem] flex items-center"
      :class="
        props.self
          ? ['text-white']
          : ['text-black', 'opacity-50', 'dark:text-white', 'dark:opacity-70']
      "
    >
      <LinkIcon class="w-4 h-4 mr-2 stroke-1" />
      {{ props.previewData.domain }}
    </a>
  </div>
</template>
