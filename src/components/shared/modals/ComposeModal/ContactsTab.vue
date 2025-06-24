<script setup>
import useStore from "@src/store/store";

import NoContacts from "@src/components/states/empty-states/NoContacts.vue";
import Circle2Lines from "@src/components/states/loading-states/Circle2Lines.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import ContactItem from "@src/components/shared/blocks/ContactItem.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";

const store = useStore();
</script>

<template>
  <div class="pb-6">
    <!--search-->
    <div class="mx-5 mb-5">
      <SearchInput />
    </div>

    <!--contacts-->
    <ScrollBox class="overflow-y-scroll max-h-50">
      <template v-if="store.status === 'loading' || store.delayLoading">
        <Circle2Lines
          v-for="index in 3"
          :key="index"
        />
      </template>

      <ContactItem
        v-for="(contact, index) in store.user.contacts"
        v-else-if="
          store.status === 'success' &&
            !store.delayLoading &&
            store.user &&
            store.user.contacts.length > 0
        "
        :key="index"
        :contact="contact"
      />

      <NoContacts
        v-else
        vertical
      />
    </ScrollBox>
  </div>
</template>
