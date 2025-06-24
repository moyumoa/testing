<script setup>
// 引入依赖
import { ref, onMounted, onUnmounted } from "vue";
import { PauseIcon, PlayIcon } from "@heroicons/vue/24/outline";
import WaveSurfer from "wavesurfer.js";
import Spinner from "@src/components/ui/utils/Spinner.vue";

// 接收 props 参数
const props = defineProps({
  recording: Object,
  self: Boolean
});

// 🎵 WaveSurfer 实例
const wavesurfer = ref(null);

// 🔁 播放状态
const playing = ref(false);

// ⏳ 是否加载中
const loading = ref(true);

// 播放/暂停控制
const handleTogglePlay = () => {
  if (!wavesurfer.value) return;

  if (playing.value) {
    wavesurfer.value.pause();
    playing.value = false;
  } else {
    wavesurfer.value.play();
    playing.value = true;
  }
};

// 组件挂载时初始化 WaveSurfer
onMounted(() => {
  const waveform = document.querySelector("#waveform-" + props.recording.id);

  if (waveform) {
    // 初始化
    wavesurfer.value = WaveSurfer.create({
      container: waveform,
      waveColor: "rgb(209 213 219)", // 灰色波形
      progressColor: "rgb(165 180 252)", // 蓝色进度
      cursorColor: "transparent", // 不显示游标
      barWidth: 1,
      barRadius: 1,
      cursorWidth: 1,
      height: 30,
      barGap: 4,
    });

    // 加载音频
    wavesurfer.value.load(props.recording.src);

    // 监听准备就绪事件
    wavesurfer.value.on("ready", () => {
      loading.value = false;
    });
  }
});

// 卸载时暂停音频
onUnmounted(() => {
  if (wavesurfer.value) {
    wavesurfer.value.pause();
  }
});
</script>


<template>
  <!--loading indicator-->
  <div
    class="flex items-center outline-none"
    tabindex="0"
    aria-label="audio message"
  >
    <div
      v-if="loading"
      class="p-4 mr-4 flex justify-center items-center rounded-[.75rem] outline-none transition-all duration-200 bg-indigo-300 active:bg-indigo-400"
    >
      <Spinner />
    </div>

    <!--play/pause button-->
    <button
      v-else
      class="p-4 mr-4 flex justify-center items-center rounded-[.75rem] outline-none transition-all duration-200 bg-indigo-300 active:bg-indigo-400"
      :aria-label="playing ? 'pause' : 'play'"
      @click="handleTogglePlay"
    >
      <PauseIcon
        v-if="playing"
        class="w-5 h-5 text-white"
      />
      <PlayIcon
        v-else
        class="w-5 h-5 text-white"
      />
    </button>

    <!--audio waveform-->
    <div class="w-full mr-4 relative flex items-center">
      <div
        :id="'waveform-' + props.recording.id"
        class="w-37.5"
      />
      <div
        v-show="loading"
        class="absolute border animate-pulse w-37.5 border-gray-300"
      />
    </div>

    <p
      class="body-1 text-black dark:text-white opacity-40 dark:opacity-70"
      tabindex="0"
      aria-label="11 seconds"
    >
      00:11
    </p>
  </div>
</template>
