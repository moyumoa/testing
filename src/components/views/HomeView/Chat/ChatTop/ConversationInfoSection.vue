<script setup>
import { inject, ref } from "vue";

import router from "@src/router";
import { activeCall } from "@src/store/defaults";
import useStore from "@src/store/store";
import { getAvatar, getName } from "@src/utils";

import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PhoneIcon,
  ShareIcon,
} from "@heroicons/vue/24/outline";

import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@src/components/ui/navigation/Dropdown/DropdownLink.vue";

const props = defineProps({
  handleOpenInfo: Function,
  handleOpenSearch: Function,
});

const store = useStore();
const activeConversation = inject("activeConversation");
const showDropdown = ref(false);

const handleCloseDropdown = () => {
  showDropdown.value = false;
};



const handleClickOutside = (event) => {
  const target = event.target;
  const parent = target?.parentElement;

  if (
    !target?.classList.contains("open-top-menu") &&
    !parent?.classList.contains("open-top-menu")
  ) {
    handleCloseDropdown();
  }
};

const handleCloseConversation = () => {
  router.push({ path: "/chat/" });
};

const handleClickProfile = () => {
  handleCloseDropdown();
  props.handleOpenInfo();
};

const handleClickVoiceCall = () => {
  handleCloseDropdown();
  handleOpenVoiceCallModal();
};

const handleOpenVoiceCallModal = () => {
  store.activeCall = activeCall;
  store.callMinimized = false;
  setTimeout(() => {
    store.openVoiceCall = true;
  }, 300);
};
</script>

<template>
  <div class="w-full flex justify-center items-center">
    <div class="group mr-4 md:hidden">
      <IconButton
        class="ic-btn-ghost-primary w-7 h-7"
        title="close conversation"
        aria-label="close conversation"
        @click="handleCloseConversation"
      >
        <ChevronLeftIcon class="w-[1.25rem] h-[1.25rem]" />
      </IconButton>
    </div>

    <div
      v-if="store.status !== 'loading'"
      class="flex grow"
    >
      <button
        class="mr-5 outline-none"
        aria-label="profile avatar"
        @click="props.handleOpenInfo"
      >
        <div
          :style="{ backgroundImage: `url(${getAvatar(activeConversation)})` }"
          class="w-[2.25rem] h-[2.25rem] rounded-full bg-cover bg-center"
        />
      </button>

      <div class="flex flex-col">
        <p
          class="w-fit heading-2 text-black/70 dark:text-white/70 mb-2 cursor-pointer"
          tabindex="0"
          @click="props.handleOpenInfo"
        >
          {{ getName(activeConversation) }}
        </p>
        <p
          class="body-2 text-black/70 dark:text-white/70 font-extralight rounded-[.25rem]"
          tabindex="0"
          aria-label="Last seen december 16, 2019"
        >
          Last seen Dec 16, 2019
        </p>
      </div>
    </div>

    <div
      class="flex"
      :class="{ hidden: store.status === 'loading' }"
    >
      <IconButton
        title="search messages"
        aria-label="search messages"
        class="ic-btn-ghost-primary w-7 h-7 mr-3"
        @click="props.handleOpenSearch"
      >
        <MagnifyingGlassIcon class="w-[1.25rem] h-[1.25rem] text-gray-400 group-hover:text-indigo-300" />
      </IconButton>

      <div class="relative">
        <IconButton
          id="open-conversation-menu"
          class="ic-btn-ghost-primary open-top-menu group w-7 h-7"
          :aria-expanded="showDropdown"
          tabindex="0"
          aria-controls="conversation-menu"
          title="toggle conversation menu"
          aria-label="toggle conversation menu"
          @click="showDropdown = !showDropdown"
        >
          <EllipsisVerticalIcon class="open-top-menu w-[1.25rem] h-[1.25rem]" />
        </IconButton>

        <Dropdown
          id="conversation-menu"
          :close-dropdown="handleCloseDropdown"
          :show="showDropdown"
          :position="['right-0']"
          :handle-click-outside="handleClickOutside"
          aria-labelledby="open-conversation-menu"
        >
          <button
            class="dropdown-link dropdown-link-primary"
            aria-label="Show profile information"
            role="menuitem"
            @click="handleClickProfile"
          >
            <InformationCircleIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            Profile Information
          </button>

          <button
            class="dropdown-link dropdown-link-primary"
            aria-label="start a voice call with this contact"
            role="menuitem"
            @click="handleClickVoiceCall"
          >
            <PhoneIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            Voice call
          </button>

          <button
            class="dropdown-link dropdown-link-primary"
            aria-label="share this contact"
            role="menuitem"
            @click="handleCloseDropdown"
          >
            <ShareIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            Shared media
          </button>

          <button
            class="dropdown-link dropdown-link-danger"
            aria-label="block this contact"
            role="menuitem"
            @click="handleCloseDropdown"
          >
            <NoSymbolIcon class="h-5 w-5 mr-3" />
            Block contact
          </button>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
