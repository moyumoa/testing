<script setup>
import useStore from "@src/store/store";
import { getFullName } from "@src/utils";

// 事件发射器
const emit = defineEmits(["contactSelected"]);

// 接收 props，无需显式类型
const props = defineProps({
  contact: Object,
  variant: String,
  active: Boolean,
  unselectable: Boolean,
});

const store = useStore();
</script>

<template>
  <div>
    <component
      :is="props.variant === 'card' ? 'div' : 'button'"
      class="w-full p-5 flex transition duration-200 ease-out outline-none"
      :class="{
        'hover:bg-indigo-50 active:bg-indigo-100 focus:bg-indigo-50 dark:hover:bg-gray-600 dark:focus:bg-gray-600':
          props.variant !== 'card',
        'bg-indigo-50 dark:bg-gray-600': props.active,
      }"
      @click="
        props.variant !== 'card' && emit('contactSelected', props.contact)
      "
    >
      <!--头像-->
      <div class="mr-4">
        <div
          :style="{ backgroundImage: `url(${props.contact.avatar})` }"
          class="w-7 h-7 rounded-full bg-cover bg-center"
        />
      </div>

      <div class="w-full flex flex-col items-start">
        <div class="w-full mb-3 flex justify-between items-center">
          <!--名字-->
          <component
            :is="props.variant === 'card' && !props.unselectable ? 'a' : 'div'"
            href="#"
            class="flex items-center"
            @click="
              props.variant === 'card' && !props.unselectable &&
                emit('contactSelected', props.contact)
            "
          >
            <p class="heading-2 text-black/70 dark:text-white/70">
              {{
                store.user && store.user.id === props.contact.id
                  ? "You"
                  : getFullName(props.contact)
              }}
            </p>
            <slot name="tag" />
          </component>

          <!--菜单插槽-->
          <div class="relative">
            <slot name="menu" />
          </div>
        </div>

        <!--最后上线时间-->
        <p class="body-2 text-black/70 dark:text-white/70">
          Last seen 2:30 am
        </p>
      </div>

      <!--复选框插槽-->
      <div class="h-full flex flex-col justify-center items-center">
        <slot name="checkbox" />
      </div>
    </component>
  </div>
</template>
