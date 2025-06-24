<script setup>
import { ref } from "vue";

import useStore from "@src/store/store";

import { EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/solid";
import ContactItem from "@src/components/shared/blocks/ContactItem.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@src/components/ui/navigation/Dropdown/DropdownLink.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";

const props = defineProps({
  closeModal: Function,
  conversation: Object,
});

const emit = defineEmits(["active-page-change"]);

const store = useStore();

// 联系人列表容器元素
const contactContainer = ref();

// 每个联系人下拉菜单开关状态
const dropdownMenuStates = ref(
  props.conversation.contacts?.map(() => false)
);

// 下拉菜单定位方向
const dropdownMenuPosition = ref(["top-6", "right-0"]);

// 关闭所有下拉菜单
const closeDropdowns = () => {
  dropdownMenuStates.value = props.conversation.contacts?.map(() => false);
};

// 切换某个联系人的菜单显示状态
const handleToggleDropdown = (event, contactIndex) => {
  if (contactContainer.value) {
    const buttonBottom = event.currentTarget.getBoundingClientRect().bottom;
    const containerBottom =
      contactContainer.value.getBoundingClientRect().bottom;

    if (buttonBottom >= containerBottom - 50) {
      dropdownMenuPosition.value = ["bottom-6", "right-0"];
    } else {
      dropdownMenuPosition.value = ["top-6", "right-0"];
    }
  }

  dropdownMenuStates.value = props.conversation.contacts?.map((_, index) =>
    index === contactIndex
  );
};

// 点击下拉外部时关闭菜单
const handleClickOutside = (event) => {
  const target = event.target;

  if (
    target.parentElement &&
    !target.classList.contains("open-menu") &&
    !target.parentElement.classList.contains("open-menu")
  ) {
    closeDropdowns();
  }
};
</script>


<template>
  <div>
    <!--header-->
    <div class="flex justify-between items-center mb-6 px-5">
      <p
        id="modal-title"
        class="heading-1 text-black/70 dark:text-white/70"
      >
        Members
      </p>

      <!--return button-->
      <IconButton
        class="ic-btn-outlined-danger p-2"
        @click="
          $emit('active-page-change', {
            tabName: 'conversation-info',
            animationName: 'slide-right',
            removeContact: true,
          })
        "
      >
        <ArrowUturnLeftIcon class="w-5 h-5" />
      </IconButton>
    </div>

    <!--search-->
    <div class="mb-5 mx-5">
      <SearchInput />
    </div>

    <!--contacts-->
    <div ref="contactContainer">
      <ScrollBox class="max-h-58 overflow-y-scroll">
        <ContactItem
          v-for="(contact, index) in props.conversation.contacts"
          :key="index"
          variant="card"
          :contact="contact"
          @contact-selected="
            (contact) =>
              $emit('active-page-change', {
                tabName: 'conversation-info',
                animationName: 'slide-left',
                contact: contact,
              })
          "
        >
          <template
            v-if="Array.isArray(props.conversation.admins) && props.conversation.admins.includes(contact.id)"
            #tag
          >
            <div class="ml-3">
              <p class="body-4 text-indigo-400">
                admin
              </p>
            </div>
          </template>

          <template
            v-if="
              store.user &&
                Array.isArray(props.conversation.admins) &&
                props.conversation.admins.includes(store.user.id) &&
                contact.id !== store.user.id
            "
            #menu
          >
            <div>
              <!--dropdown menu button-->
              <IconButton
                title="menu"
                class="open-menu w-6 h-6"
                @click="(event) => handleToggleDropdown(event, index)"
              >
                <EllipsisVerticalIcon
                  class="open-menu h-5 w-5"
                  tabindex="0"
                />
              </IconButton>

              <!--dropdown menu-->
              <Dropdown
                :close-dropdown="closeDropdowns"
                :handle-click-outside="handleClickOutside"
                :show="dropdownMenuStates[index]"
                :position="dropdownMenuPosition"
              >
                <button
                  class="dropdown-link dropdown-link-primary"
                  aria-label="give admin permissions"
                  role="menuitem"
                >
                  Promote to admin
                </button>
                <button
                  class="dropdown-link dropdown-link-primary"
                  aria-label="remove admin permissions"
                  role="menuitem"
                >
                  Demote to member
                </button>
                <button
                  class="dropdown-link dropdown-link-danger"
                  aria-label="remove contacts"
                  role="menuitem"
                >
                  Remove contact
                </button>
              </Dropdown>
            </div>
          </template>
        </ContactItem>
      </ScrollBox>
    </div>
  </div>
</template>
