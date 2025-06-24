<script setup>
import { computed, ref } from 'vue'

import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { PlayIcon } from '@heroicons/vue/24/solid'
import Carousel from '@src/components/ui/data-display/Carousel/Carousel.vue'

// ✅ 定义 props
const props = defineProps({
  message: Object,
  self: Boolean
})

const openCarousel = ref(false)
const selectedAttachmentId = ref()

// 打开预览
const openCarouselWithAttachment = (attachmentId) => {
  selectedAttachmentId.value = attachmentId
  openCarousel.value = true
}

const closeCarousel = () => {
  openCarousel.value = false
}

// 判断是否包含图片/视频
const containsMedia = computed(() => {
  if (props.message.attachments) {
    return props.message.attachments.some((att) => ["image", "video"].includes(att.type))
  }
  return false
})

// 统计图片/视频数量
const numberOfMedia = computed(() => {
  return props.message.attachments?.filter(att => ["image", "video"].includes(att.type)).length || 0
})

// 判断是否是第 N 个 media
const isNumber = (attachment, number, largerThan) => {
  let counter = 0
  let matched = false

  for (const item of props.message.attachments || []) {
    if (["image", "video"].includes(item.type)) {
      counter++
      if (item.id === attachment.id) {
        matched = largerThan ? counter > number : counter === number
        if (matched) break
      }
    }
  }

  return matched
}
</script>

<template>
  <div>
    <div class="flex">
      <div
        v-for="(attachment, index) in props.message.attachments"
        :key="index"
        class="mr-2 flex items-end"
        :class="{ 'mt-4': containsMedia }"
      >
        <!-- 图片 -->
        <button
          v-if="attachment.type === 'image'"
          class="outline-none"
          :aria-label="
            numberOfMedia > 2
              ? props.message.attachments.length - 1 + ' more attachments'
              : attachment.name
          "
          @click="openCarouselWithAttachment(attachment.id)"
        >
          <div
            v-if="!isNumber(attachment, 2, true)"
            :style="{ backgroundImage: `url(${attachment.url})` }"
            class="rounded bg-cover bg-center"
            :class="
              numberOfMedia === 1
                ? ['w-50', 'h-50']
                : ['md:w-27.5', 'md:h-25', 'xs:w-25', 'xs:h-23.75']
            "
          >
            <div
              v-if="isNumber(attachment, 1)"
              class="w-full h-full flex justify-center items-center rounded bg-black/20 hover:bg-black/10 transition duration-200"
            />

            <div
              v-if="isNumber(attachment, 2) && numberOfMedia > 2"
              class="w-full h-full flex items-center justify-center rounded bg-black/40 text-white hover:bg-black/10 transition duration-200"
            >
              {{ props.message.attachments.length - 1 }}+
            </div>
          </div>
        </button>

        <!-- 视频 -->
        <button
          v-if="attachment.type === 'video'"
          class="overflow-hidden outline-none"
          :aria-label="
            numberOfMedia > 2
              ? props.message.attachments.length - 1 + ' more attachments'
              : attachment.name
          "
          @click="openCarouselWithAttachment(attachment.id)"
        >
          <div
            v-if="!isNumber(attachment, 2, true)"
            :style="{ backgroundImage: `url(${attachment.thumbnail})` }"
            class="rounded bg-cover bg-center"
            :class="
              numberOfMedia === 1
                ? ['w-50', 'h-50']
                : ['md:w-27.5', 'md:h-25', 'xs:w-25', 'xs:h-23.75']
            "
          >
            <div
              v-if="isNumber(attachment, 1)"
              class="w-full h-full flex justify-center items-center rounded bg-black/20 hover:bg-black/10 transition duration-200"
            >
              <span class="p-3 rounded-full bg-white/40 transition-all duration-200">
                <PlayIcon class="w-5 h-5 text-white" />
              </span>
            </div>

            <div
              v-else-if="isNumber(attachment, 2) && numberOfMedia < 3"
              class="w-full h-full flex justify-center items-center rounded bg-black/20 hover:bg-black/10 transition duration-200"
            >
              <span class="p-3 rounded-full bg-white/40 transition-all duration-200">
                <PlayIcon class="w-5 h-5 text-white" />
              </span>
            </div>

            <div
              v-else-if="isNumber(attachment, 2) && numberOfMedia > 2"
              class="w-full h-full flex items-center justify-center rounded bg-black/40 text-white hover:bg-black/10 transition duration-200"
            >
              {{ props.message.attachments.length - 1 }}+
            </div>
          </div>
        </button>

        <!-- 文件 -->
        <div v-if="attachment.type === 'file' && !containsMedia">
          <div class="flex">
            <button
              class="w-8 h-8 mr-4 flex justify-center rounded-full outline-none items-center duration-200"
              :class="
                props.self
                  ? ['bg-indigo-300']
                  : ['bg-indigo-50', 'hover:bg-indigo-100', 'active:bg-indigo-200', 'dark:bg-gray-400', 'dark:hover:bg-gray-300', 'dark:focus:bg-gray-300', 'dark:active:bg-gray-200']
              "
            >
              <ArrowDownTrayIcon
                class="stroke-2 h-5 w-5"
                :class="props.self ? ['text-white'] : ['text-blue-500', 'dark:text-gray-50']"
              />
            </button>

            <div class="flex flex-col justify-center">
              <p
                class="heading-2 mb-3"
                :class="props.self ? ['text-black opacity-50 dark:text-white dark:opacity-70'] : ['text-black', 'opacity-50', 'dark:text-white', 'dark:opacity-70']"
              >
                {{ attachment.name }}
              </p>

              <p
                class="body-2"
                :class="props.self ? ['text-black opacity-60 dark:text-white dark:opacity-70'] : ['text-black', 'opacity-50', 'dark:text-white', 'dark:opacity-70']"
              >
                {{ attachment.size }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <Carousel
        :open="openCarousel"
        :starting-id="selectedAttachmentId"
        :close-carousel="closeCarousel"
      />
    </div>
  </div>
</template>
