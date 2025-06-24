<script setup>
import { computed } from "vue";

import { getCallName, getOtherMembers } from "@src/utils";

import {
  PhoneIcon,
  PhoneArrowDownLeftIcon,
  PhoneArrowUpRightIcon,
  PhoneXMarkIcon,
} from "@heroicons/vue/24/solid";
import CallAvatar from "@src/components/shared/blocks/CallAvatar.vue";

const props = defineProps({
  call: Object,
  active: Boolean,
  openInfoModal: Function,
  openVoiceCallModal: Function,
  endCall: Function,
});

const members = computed(() => {
  return getOtherMembers(props.call);
});

const handleOpenInfoModal = () => {
  if (props.openInfoModal && !props.active) {
    props.openInfoModal(props.call);
  }
};
</script>
