<script setup>
import { UserPlusIcon } from "@heroicons/vue/24/outline";
import { ref, watch } from "vue";

import useStore from "@src/store/store";

import AddContactModal from "@src/components/shared/modals/AddContactModal.vue";
import NoContacts from "@src/components/states/empty-states/NoContacts.vue";
import MultipleLines from "@src/components/states/loading-states/MultipleLines.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import SortedContacts from "@src/components/views/HomeView/Sidebar/Contacts/SortedContacts.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";

const store = useStore();

const searchText = ref("");

const openModal = ref(false);

// html element containing the contact groups
const contactContainer = ref(null);

// contact groups filtered by search text
const filteredContactGroups = ref(store.contactGroups);

// 根据搜索内容实时过滤联系人分组
watch(searchText, () => {
  filteredContactGroups.value = store.contactGroups
    ?.map((group) => {
      const newGroup = { ...group };
      newGroup.contacts = newGroup.contacts.filter((contact) => {
        return (
          contact.firstName.toLowerCase().includes(searchText.value.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(searchText.value.toLowerCase())
        );
      });
      return newGroup;
    })
    .filter((group) => group.contacts.length > 0);
});
</script>

<template>
  <div>
    <SidebarHeader>
      <template #title>
        Contacts
      </template>

      <template #actions>
        <IconButton
          class="ic-btn-ghost-primary w-7 h-7"
          title="add contacts"
          aria-label="add contacts"
          @click="openModal = true"
        >
          <UserPlusIcon class="w-[1.25rem] h-[1.25rem]" />
        </IconButton>
      </template>
    </SidebarHeader>

    <!-- 搜索栏 -->
    <div class="px-5 xs:pb-6 md:pb-5">
      <SearchInput v-model="searchText" />
    </div>

    <!-- 联系人列表 -->
    <div
      ref="contactContainer"
      class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <template v-if="store.status === 'loading' || store.delayLoading">
        <MultipleLines
          v-for="n in 5"
          :key="n"
        />
      </template>

      <SortedContacts
        v-else-if="
          store.status === 'success' &&
            !store.delayLoading &&
            store.user &&
            store.user.contacts.length > 0
        "
        :contact-groups="filteredContactGroups"
        :bottom-edge="contactContainer?.getBoundingClientRect().bottom"
      />

      <NoContacts v-else />
    </div>

    <!-- 添加联系人弹窗 -->
    <AddContactModal
      :open-modal="openModal"
      :close-modal="() => (openModal = false)"
    />
  </div>
</template>
