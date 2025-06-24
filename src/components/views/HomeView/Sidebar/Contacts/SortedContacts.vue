<script setup>
import { ref } from "vue";
import useStore from "@src/store/store";

import { getFullName } from "@src/utils";

import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@src/components/ui/navigation/Dropdown/DropdownLink.vue";

// 接收父组件传入的属性
const props = defineProps({
  contactGroups: Array,
  bottomEdge: Number,
});

// 控制 Dropdown 菜单的位置（上方或下方）
const dropdownMenuPosition = ref(["top-6", "right-0"]);

// 控制每个联系人下拉菜单的开关状态
const dropdownMenuStates = ref(
  props.contactGroups?.map((contactGroup) => {
    return contactGroup.contacts.map(() => false);
  })
);

// 关闭所有下拉菜单
const handleCloseAllMenus = () => {
  dropdownMenuStates.value = props.contactGroups?.map((contactGroup) => {
    return contactGroup.contacts.map(() => false);
  });
};

// 点击展开或关闭某一个联系人菜单
const handleToggleDropdown = (event, groupIndex, index) => {
  if (props.bottomEdge) {
    let buttonBottom = event.currentTarget.getBoundingClientRect().bottom;
    dropdownMenuPosition.value =
      buttonBottom >= props.bottomEdge - 75
        ? ["bottom-6", "right-0"]
        : ["top-6", "right-0"];
  }

  dropdownMenuStates.value = dropdownMenuStates.value.map((group, gIndex) => {
    return group.map((value, idx) => {
      return gIndex === groupIndex && idx === index ? !value : false;
    });
  });
};

// 点击页面空白处时关闭菜单
const handleClickOutside = (event) => {
  const target = event.target;
  const parentElement = target.parentElement;

  if (
    !target.classList.contains("open-menu") &&
    !(parentElement && parentElement.classList.contains("open-menu"))
  ) {
    handleCloseAllMenus();
  }
};
</script>

<template>
  <div
    v-for="(group, groupIndex) in props.contactGroups"
    :key="groupIndex"
  >
    <!-- 组标题 -->
    <p class="heading-3 text-black/70 dark:text-white/70 w-full px-5 pb-3 pt-5">
      {{ group.letter }}
    </p>

    <!-- 每组联系人 -->
    <div
      v-for="(contact, index) in group.contacts"
      :key="index"
    >
      <div class="w-full p-5 flex justify-between items-center">
        <button
          class="transition-all duration-200 ease-out"
          :aria-label="getFullName(contact)"
        >
          <div class="flex-row">
            <p class="heading-2 text-black/70 dark:text-white/70">
              {{ getFullName(contact) }}
            </p>
          </div>
        </button>

        <!-- 下拉菜单区域 -->
        <div class="relative">
          <IconButton
            :id="'open-contact-menu-' + index"
            class="open-menu w-6 h-6"
            :aria-expanded="dropdownMenuStates[groupIndex][index]"
            :aria-controls="'contact-menu-' + index"
            title="toggle contact menu"
            aria-label="toggle contact menu"
            @click="(event) => handleToggleDropdown(event, groupIndex, index)"
          >
            <EllipsisVerticalIcon
              class="open-menu h-5 w-5"
              tabindex="0"
            />
          </IconButton>

          <Dropdown
            :id="'contact-menu-' + index"
            :close-dropdown="handleCloseAllMenus"
            :handle-click-outside="handleClickOutside"
            :aria-labelledby="'open-contact-menu-' + index"
            :show="dropdownMenuStates[groupIndex][index]"
            :position="dropdownMenuPosition"
          >
            <button
              class="dropdown-link dropdown-link-primary"
              aria-label="Show profile information"
              role="menuitem"
            >
              <InformationCircleIcon
                class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70"
              />
              Personal information
            </button>

            <button
              class="dropdown-link dropdown-link-danger"
              aria-label="Delete contact"
              role="menuitem"
            >
              <TrashIcon class="h-5 w-5 mr-3" />
              Delete contact
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>