<script setup>
import { getCallName } from "@src/utils";

import {
  ChatBubbleBottomCenterTextIcon,
  PhoneIcon,
  SpeakerXMarkIcon,
  UserPlusIcon,
} from "@heroicons/vue/24/solid";
import CallAvatar from "@src/components/shared/blocks/CallAvatar.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";

const props = defineProps({
  members: Array,
  activeCall: Object,
  closeModal: Function,
});
</script>
