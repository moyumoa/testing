<script setup>
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
  defineProps
} from "vue";

import { hasAttachments } from "@src/utils";
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";
import VideoPlayer from "@src/components/ui/data-display/VideoPlayer.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Toolbar from "@src/components/ui/data-display/Carousel/Toolbar.vue";
import ScaleTransition from "@src/components/ui/transitions/ScaleTransition.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  open: Boolean,
  startingId: Number,
  closeCarousel: Function,
});

const carousel = ref();
const { activate, deactivate } = useFocusTrap(carousel);
const conversation = inject("activeConversation");
const currentIndex = ref(0);
const moved = ref(false);

const attachments = computed(() => {
  let attachments = [];
  if (conversation) {
    for (let message of conversation.messages) {
      if (message.attachments && hasAttachments(message)) {
        for (let attachment of message.attachments) {
          if (["video", "image"].includes(attachment.type)) {
            attachments.push(attachment);
          }
        }
      }
    }
  }
  return attachments;
});

const startingIndex = computed(() => {
  let index;
  attachments.value.forEach((value, i) => {
    if (value.id === props.startingId) index = i;
  });
  return index;
});

const selectedAttachment = computed(() =>
  attachments.value[moved.value ? currentIndex.value : startingIndex.value]
);

const imageInvisibility = ref(true);
const image = ref(null);
const zoom = ref(1);
const imageLeft = ref(0);
const imageTop = ref(0);
const startingPositionX = ref(0);
const startingPositionY = ref(0);

const handleCloseCarousel = () => {
  moved.value = false;
  zoom.value = 1;
  props.closeCarousel();
};

const isThereANext = () =>
  attachments.value.length && currentIndex.value + 1 < attachments.value.length;

const isThereAPrevious = () =>
  attachments.value.length && currentIndex.value > 0;

const handleMoveToNextItem = () => {
  if (isThereANext()) {
    zoom.value = 1;
    moved.value = true;
    currentIndex.value++;
    imageInvisibility.value = true;
  }
};

const handleMoveToPreviousItem = () => {
  if (isThereAPrevious()) {
    zoom.value = 1;
    moved.value = true;
    currentIndex.value--;
    imageInvisibility.value = true;
  }
};

watch(
  () => props.open,
  () => {
    currentIndex.value = startingIndex.value;
    props.open ? setTimeout(activate, 500) : setTimeout(deactivate, 200);
  }
);

const handleIncreaseZoom = () => {
  if (zoom.value < 2) zoom.value += 0.5;
};

const handleDecreaseZoom = () => {
  if (zoom.value > 0.5) zoom.value -= 0.5;
};

const handleStartMovingImage = (event) => {
  event.preventDefault();
  startingPositionX.value = event.clientX;
  startingPositionY.value = event.clientY;
  document.addEventListener("mousemove", handleMovingImage);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", handleMovingImage);
  });
};

const handleMovingImage = (event) => {
  if (image.value) {
    const deltaX = startingPositionX.value - event.clientX;
    const deltaY = startingPositionY.value - event.clientY;
    startingPositionX.value = event.clientX;
    startingPositionY.value = event.clientY;
    imageTop.value = image.value.offsetTop - deltaY;
    imageLeft.value = image.value.offsetLeft - deltaX;
  }
};

const handleImageLoad = (event) => {
  if (event.target) {
    setTimeout(() => (imageInvisibility.value = false), 200);
    if (event.target.tagName === "IMG") {
      imageLeft.value = window.innerWidth / 2 - event.target.offsetWidth / 2;
      imageTop.value = window.innerHeight / 2 - event.target.offsetHeight / 2;
    }
  }
};

const handleKeyboardEvents = (event) => {
  if (["Escape", "Esc"].includes(event.key)) handleCloseCarousel();
  else if (event.key === "ArrowLeft") handleMoveToPreviousItem();
  else if (event.key === "ArrowRight") handleMoveToNextItem();
  else if (event.key === "+") handleIncreaseZoom();
  else if (event.key === "-") handleDecreaseZoom();
};

onMounted(() => {
  currentIndex.value = startingIndex.value;
  document.addEventListener("keydown", handleKeyboardEvents);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyboardEvents);
});
</script>

<template>
  <div
    class="relative z-10"
    aria-label="media carousel"
    role="dialog"
    aria-modal="true"
  >
    <!--overlay-->
    <FadeTransition>
      <div
        v-show="props.open"
        class="fixed inset-0 bg-black/60 transition-opacity"
      />
    </FadeTransition>

    <!--content-->
    <ScaleTransition>
      <div
        v-show="props.open"
        class="fixed inset-0 z-10"
      >
        <div
          v-if="props.startingId"
          ref="carousel"
          class="h-full flex flex-col"
        >
          <!--toolbar-->
          <Toolbar
            class="absolute right-0 z-30 mr-5 mt-5"
            :is-image="Boolean(selectedAttachment.type === 'image')"
            :handle-close-carousel="handleCloseCarousel"
            :handle-increase-zoom="handleIncreaseZoom"
            :handle-decrease-zoom="handleDecreaseZoom"
          />

          <div
            class="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            <!--Left controls-->
            <IconButton
              title="previous"
              aria-label="previous item"
              :class="{ hidden: !isThereAPrevious() }"
              class="ic-btn-contained-glass absolute top-[50%] z-30 left-0 flex items-center justify-center mr-5 ml-5 p-4"
              @click="handleMoveToPreviousItem"
            >
              <ChevronLeftIcon class="w-6 h-6" />
            </IconButton>

            <!--Image-->
            <img
              v-if="selectedAttachment.type === 'image'"
              :key="selectedAttachment.id"
              ref="image"
              class="absolute w-auto md:max-w-175 xs:max-w-85 cursor-grab transition-[transform,opacity] duration-200"
              :class="{ 'opacity-0': imageInvisibility }"
              :style="{
                transform: `scale(${zoom})`,
                top: `${imageTop}px`,
                left: `${imageLeft}px`,
              }"
              :src="selectedAttachment?.url"
              :alt="selectedAttachment.name"
              @load="handleImageLoad"
              @mousedown="handleStartMovingImage"
            >

            <!--Video-->
            <VideoPlayer
              v-if="selectedAttachment.type === 'video'"
              :id="'video-player-' + selectedAttachment.id"
              :key="selectedAttachment.id"
              class="transition-[transform,opacity] duration-200"
              :class="{ 'opacity-0': imageInvisibility }"
              :url="selectedAttachment.url"
              :name="selectedAttachment.name"
              :thumbnail="selectedAttachment.thumbnail"
              @video-load="handleImageLoad"
            />

            <!--right controls-->
            <IconButton
              title="next"
              aria-label="next item"
              :class="{ hidden: !isThereANext() }"
              class="ic-btn-contained-glass absolute top-[50%] z-30 right-0 flex items-center justify-center p-4 ml-5 mr-5"
              @click="handleMoveToNextItem"
            >
              <ChevronRightIcon class="w-6 h-6" />
            </IconButton>
          </div>
        </div>
      </div>
    </ScaleTransition>
  </div>
</template>
