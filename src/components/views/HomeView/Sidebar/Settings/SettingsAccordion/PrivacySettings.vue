<script setup>
// 👉 导入 Store 和组件
import useStore from "@src/store/store";

import AccordionButton from "@src/components/ui/data-display/AccordionButton.vue";
import Collapse from "@src/components/ui/utils/Collapse.vue";
import SettingsSwitch from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/SettingsSwitch.vue";

// 👉 接收外部传入的属性
const props = defineProps({
  collapsed: Boolean,
  handleToggle: Function,
});

const store = useStore();
</script>

<template>
  <!--隐私设置-->
  <AccordionButton
    id="privacy-settings-toggler"
    class="w-full flex px-5 py-6 mb-3 rounded focus:outline-none"
    :collapsed="props.collapsed"
    chevron
    aria-controls="privacy-settings-collapse"
    @click="props.handleToggle()"
  >
    <p class="mb-4 heading-2 text-black/70 dark:text-white/70">
      Privacy & Safety
    </p>
    <p class="body-2 text-black/70 dark:text-white/70">
      控制你的隐私选项
    </p>
  </AccordionButton>

  <Collapse
    id="privacy-settings-collapse"
    :collapsed="props.collapsed"
  >
    <!--展示上次登录时间-->
    <SettingsSwitch
      title="Show Last Seen"
      description="允许他人查看你上次登录时间"
      :value="!!store.settings.lastSeen"
      :handle-toggle-switch="
        (value) => (store.settings.lastSeen = value)
      "
      class="mb-7"
    />
    <!--已读回执-->
    <SettingsSwitch
      title="Show Read Receipt"
      description="允许他人看到你是否已读消息"
      :value="!!store.settings.readReceipt"
      :handle-toggle-switch="
        (value) => (store.settings.readReceipt = value)
      "
      class="mb-7"
    />
    <!--群聊邀请权限-->
    <SettingsSwitch
      title="Joining Groups"
      description="允许他人将你添加到群组"
      :value="!!store.settings.joiningGroups"
      :handle-toggle-switch="
        (value) => (store.settings.joiningGroups = value)
      "
      class="mb-7"
    />
    <!--私信权限-->
    <SettingsSwitch
      title="Private Messages"
      description="允许非联系人向你发送消息"
      :value="!!store.settings.privateMessages"
      :handle-toggle-switch="
        (value) => (store.settings.privateMessages = value)
      "
      class="mb-7"
    />
  </Collapse>
</template>
