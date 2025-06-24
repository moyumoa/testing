<script setup>
import { computed, ref } from "vue";

import ContactsTab from "@src/components/shared/modals/ComposeModal/ContactsTab.vue";
import GroupTab from "@src/components/shared/modals/ComposeModal/GroupTab/GroupTab.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import Tabs from "@src/components/ui/navigation/Tabs/Tabs.vue";
import Tab from "@src/components/ui/navigation/Tabs/Tab.vue";

// props 定义（无类型）
const props = defineProps({
  open: Boolean,
  closeModal: Function,
});

// modal 标题引用
const modalTitle = ref(null);

// 当前激活的 Tab 名称
const activeTabName = ref("contacts");

// 切换 Tab
const handleSwitchTab = (tabName) => {
  activeTabName.value = tabName;
};

// 当前激活的组件
const activeTab = computed(() => {
  return activeTabName.value === "contacts" ? ContactsTab : GroupTab;
});
</script>

<template>
  <Modal
    :open="props.open"
    :close-modal="props.closeModal"
  >
    <template #content>
      <div class="w-75 bg-white dark:bg-gray-800 rounded pt-6">
        <!--header-->
        <div class="flex justify-between items-center mb-6 px-5">
          <p
            id="modal-title"
            ref="modalTitle"
            class="heading-1 text-black/70 dark:text-white/70"
            tabindex="0"
          >
            Compose
          </p>

          <Button
            class="outlined-danger ghost-text py-2 px-4"
            @click="props.closeModal"
          >
            esc
          </Button>
        </div>

        <!--tabs-->
        <div class="px-5 pb-5">
          <Tabs>
            <Tab
              name="Contact"
              :active="activeTabName === 'contacts'"
              @click="handleSwitchTab('contacts')"
            />
            <Tab
              name="Group"
              :active="activeTabName === 'group'"
              @click="handleSwitchTab('group')"
            />
          </Tabs>
        </div>

        <!--ActiveTab-->
        <FadeTransition>
          <component :is="activeTab" />
        </FadeTransition>
      </div>
    </template>
  </Modal>
</template>
