<script setup>
import { ref } from "vue";

import useStore from "@src/store/store";

import Button from "@src/components/ui/inputs/Button.vue";
import Checkbox from "@src/components/ui/inputs/Checkbox.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import ContactItem from "@src/components/shared/blocks/ContactItem.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";
import Circle2Lines from "@src/components/states/loading-states/Circle2Lines.vue";

const props = defineProps({
  closeModal: Function,
  open: Boolean,
});

const store = useStore();

// 已选中的联系人列表
const selectedContacts = ref([]);

// 判断某个联系人是否已被选中
const isContactSelected = (contact) => {
  if (contact) {
    return !!selectedContacts.value.find((item) => item.id === contact.id);
  }
  return false;
};

// 切换联系人选中状态
const handleSelectedContactsChange = (contact) => {
  const index = selectedContacts.value.findIndex(
    (item) => item.id === contact.id
  );
  if (index !== -1) {
    selectedContacts.value.splice(index, 1);
  } else {
    selectedContacts.value.push(contact);
  }
};
</script>


<template>
  <Modal
    :open="props.open"
    :close-modal="props.closeModal"
  >
    <template #content>
      <div class="w-75 py-6 bg-white dark:bg-gray-800 rounded">
        <!--modal header-->
        <div class="flex justify-between items-center mb-6 px-5">
          <p
            id="modal-title"
            class="heading-1 text-black/70 dark:text-white/70"
            tabindex="0"
          >
            Contacts
          </p>

          <!--close button-->
          <Button
            class="outlined-danger ghost-text py-2 px-4"
            typography="body-4"
            @click="props.closeModal"
          >
            esc
          </Button>
        </div>

        <!--search-->
        <div class="mb-5 mx-5">
          <SearchInput />
        </div>

        <!--contacts-->
        <ScrollBox
          ref="contactContainer"
          class="max-h-54 mb-5 overflow-y-scroll"
        >
          <template v-if="store.status === 'loading' || store.delayLoading">
            <Circle2Lines
              v-for="index in 3"
              :key="index"
            />
          </template>

          <ContactItem
            v-for="(contact, index) in store.user.contacts"
            v-else-if="store.user"
            :key="index"
            :contact="contact"
            :active="isContactSelected(contact)"
            @click="handleSelectedContactsChange(contact)"
          >
            <template #checkbox>
              <Checkbox :value="isContactSelected(contact)" />
            </template>
          </ContactItem>
        </ScrollBox>

        <!--call button-->
        <div class="px-5">
          <Button class="contained-success contained-text w-full">
            Call
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
