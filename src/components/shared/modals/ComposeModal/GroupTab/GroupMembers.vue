<script setup>
import { ref } from "vue";
import useStore from "@src/store/store";

const emit = defineEmits(["active-page-change"]);

import Circle2Lines from "@src/components/states/loading-states/Circle2Lines.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import ContactItem from "@src/components/shared/blocks/ContactItem.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import Checkbox from "@src/components/ui/inputs/Checkbox.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";

// 使用全局状态
const store = useStore();

// 已选联系人列表
const selectedContacts = ref([]);

// 检查是否已选中某联系人
const isContactSelected = (contact) => {
  if (contact) {
    return selectedContacts.value.some((item) => item.id === contact.id);
  }
  return false;
};

// 切换联系人选中状态
const handleSelectedContactsChange = (contact) => {
  const index = selectedContacts.value.findIndex((item) => item.id === contact.id);
  if (index !== -1) {
    selectedContacts.value.splice(index, 1);
  } else {
    selectedContacts.value.push(contact);
  }
};
</script>

<template>
  <div>
    <!--搜索框-->
    <div class="mx-5 mt-3 mb-5">
      <SearchInput />
    </div>

    <!--联系人列表-->
    <ScrollBox
      v-if="store.status === 'success' && !store.delayLoading && store.user"
      class="overflow-y-scroll max-h-50 mb-5"
    >
      <div
        v-for="(contact, index) in store.user.contacts"
        :key="index"
      >
        <ContactItem
          :contact="contact"
          :active="isContactSelected(contact)"
          @click="handleSelectedContactsChange(contact)"
        >
          <template #checkbox>
            <Checkbox :value="isContactSelected(contact)" />
          </template>
        </ContactItem>
      </div>
    </ScrollBox>
    <ScrollBox
      v-else-if="store.status === 'loading' || store.delayLoading"
      class="overflow-y-scroll max-h-50 mb-5"
    >
      <Circle2Lines
        v-for="item in 3"
        :key="'loading-' + item"
      />
    </ScrollBox>
    <ScrollBox
      v-else
      class="overflow-y-scroll max-h-50 mb-5"
    />

    <!--底部操作按钮-->
    <div class="flex px-5 mt-5 pb-6">
      <div class="grow" />

      <!--返回按钮-->
      <Button
        class="ghost-primary ghost-text mr-4"
        @click="
          $emit('active-page-change', {
            tabName: 'group-info',
            animationName: 'slide-right',
          })
        "
      >
        <p class="body-5">
          Previous
        </p>
      </Button>

      <!--完成按钮-->
      <Button class="contained-primary contained-text">
        Finish
      </Button>
    </div>
  </div>
</template>
