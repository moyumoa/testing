<script setup>
// 👉 通知图标
import {
  ArrowPathIcon,
  LockClosedIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";

// 👉 接收外部传入的通知对象
const props = defineProps({
  notification: Object,
});
</script>

<template>
  <div
    class="w-full px-5 py-5 mb-3 flex rounded outline-none"
    tabindex="0"
    :aria-label="props.notification.message"
  >
    <!--通知图标区域-->
    <div class="mr-4">
      <div
        class="w-7 h-7 flex justify-center items-center rounded-full transition duration-500"
        :class="{
          'bg-blue-100 dark:bg-blue-600':
            notification.flag === 'account-update',
          'bg-yellow-100 dark:bg-yellow-600': notification.flag === 'security',
          'bg-green-100 dark:bg-green-600':
            notification.flag === 'added-to-group',
        }"
      >
        <!--根据 flag 不同显示不同图标-->
        <ArrowPathIcon
          v-if="notification.flag === 'account-update'"
          class="w-5 h-5 stroke-1 text-blue-500 dark:text-white transition duration-500"
        />
        <LockClosedIcon
          v-else-if="notification.flag === 'security'"
          class="w-5 h-5 stroke-1 text-yellow-500 dark:text-white transition duration-500"
        />
        <PlusCircleIcon
          v-else-if="notification.flag === 'added-to-group'"
          class="w-5 h-5 stroke-1 text-green-500 dark:text-white transition duration-500"
        />
      </div>
    </div>

    <!--通知内容区域-->
    <div class="grow">
      <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
        {{ props.notification.title }}
      </p>
      <p class="body-2 text-black/70 dark:text-white/70">
        {{ props.notification.message }}
      </p>
    </div>
  </div>
</template>
