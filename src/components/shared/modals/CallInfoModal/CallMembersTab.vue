<script setup>
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/solid";


import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import ContactItem from "@src/components/shared/blocks/ContactItem.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";

const props = defineProps({
  call: {
    type: Object,
    required: false, // 可选
    default: null,   // 默认值
  },
});

const emit = defineEmits(['active-page-change']);
</script>

<template>
  <div>
    <!--modal header-->
    <div class="px-5 flex justify-between items-center">
      <p
        id="modal-title"
        class="heading-1 text-black/70 dark:text-white/70"
        tabindex="0"
      >
        Call Members
      </p>

      <!--return button-->
      <IconButton
        class="p-2 ic-btn-outlined-danger"
        @click="
          $emit('active-page-change', {
            tabName: 'call-info',
            animationName: 'slide-right',
          })
        "
      >
        <ArrowUturnLeftIcon class="w-5 h-5" />
      </IconButton>
    </div>

    <!--search-->
    <div class="mb-5 mx-5 mt-6">
      <SearchInput />
    </div>

    <!--contacts-->
    <ScrollBox
      ref="contactContainer"
      class="max-h-35 mb-5 overflow-y-scroll"
    >
      <ContactItem
        v-for="(member, index) in props.call.members"
        :key="index"
        variant="card"
        :unselectable="true"
        :contact="member"
      />
    </ScrollBox>
  </div>
</template>
