<script setup>
import { ref } from "vue";

import useStore from "@src/store/store";

import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import CallInfoModal from "@src/components/shared/modals/CallInfoModal/CallInfoModal.vue";
import DialModal from "@src/components/shared/modals/DialModal/DialModal.vue";
import NoCalls from "@src/components/states/empty-states/NoCalls.vue";
import Circle2Lines from "@src/components/states/loading-states/Circle2Lines.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import ExpandTransition from "@src/components/ui/transitions/ExpandTransition.vue";
import Call from "@src/components/views/HomeView/Sidebar/Calls/Call.vue";
import CallList from "@src/components/views/HomeView/Sidebar/Calls/CallList.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";

const store = useStore();

const openDialModal = ref(false);
const selectedCall = ref(null);
const openInfoModal = ref(false);

// 打开语音通话详情弹窗
const handleOpenInfoModal = (call) => {
  openInfoModal.value = true;
  selectedCall.value = call;
};
</script>

<template>
  <div>
    <SidebarHeader>
      <template #title>
        Voice Calls
      </template>

      <template #actions>
        <IconButton
          class="ic-btn-ghost-primary w-7 h-7"
          title="initiate call"
          aria-label="initiate call"
          @click="openDialModal = true"
        >
          <PlusCircleIcon class="w-[1.25rem] h-[1.25rem]" />
        </IconButton>
      </template>
    </SidebarHeader>

    <!-- 通话内容区 -->
    <div
      ref="contactContainer"
      class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <div v-if="store.status === 'loading' || store.delayLoading">
        <Circle2Lines
          v-for="n in 6"
          :key="n"
        />
      </div>

      <div v-else>
        <ExpandTransition>
          <div
            v-if="store.callMinimized && store.activeCall"
            class="max-h-50"
          >
            <Call
              v-if="store.activeCall"
              :call="store.activeCall"
              :open-voice-call-modal="() => (store.openVoiceCall = true)"
              :end-call="() => {
                store.activeCall = undefined;
                store.callMinimized = false;
              }"
              active
            />
          </div>
        </ExpandTransition>

        <CallList
          v-if="store.calls?.length > 0"
          delay-loading="chat.delayLoading"
          :chat-status="store.status"
          :open-info-modal="handleOpenInfoModal"
          :calls="store.calls"
        />

        <NoCalls v-else />
      </div>
    </div>

    <!-- 通话信息弹窗 -->
    <CallInfoModal
      :open="openInfoModal"
      :close-modal="() => (openInfoModal = false)"
      :call="selectedCall"
    />

    <!-- 拨号弹窗 -->
    <DialModal
      :open="openDialModal"
      :close-modal="() => (openDialModal = false)"
    />
  </div>
</template>
