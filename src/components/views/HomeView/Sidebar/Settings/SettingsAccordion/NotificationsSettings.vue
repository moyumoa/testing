<script setup>
// 👉 导入 Store 和 UI 组件
import useStore from "@src/store/store";

import AccordionButton from "@src/components/ui/data-display/AccordionButton.vue";
import Collapse from "@src/components/ui/utils/Collapse.vue";
import SettingsSwitch from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/SettingsSwitch.vue";

// 👉 接收 props 参数
const props = defineProps({
  collapsed: Boolean,
  handleToggle: Function,
});

const store = useStore();
</script>

<template>
  <!--通知设置-->
  <AccordionButton
    id="notifications-settings-toggler"
    class="w-full flex px-5 py-6 mb-3 rounded focus:outline-none"
    :collapsed="props.collapsed"
    chevron
    aria-controls="notifications-settings-collapse"
    @click="props.handleToggle()"
  >
    <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
      通知设置
    </p>
    <p class="body-2 text-black/70 dark:text-white/70">
      自定义通知偏好
    </p>
  </AccordionButton>

  <Collapse
    id="notifications-settings-collapse"
    :collapsed="props.collapsed"
  >
    <!--是否允许通知-->
    <SettingsSwitch
      title="开启通知"
      description="接收来自 Avian 的通知"
      :value="!!store.settings.allowNotifications"
      :handle-toggle-switch="value => store.settings.allowNotifications = value"
      class="mb-7"
    />

    <!--是否保留通知历史-->
    <SettingsSwitch
      title="保留通知"
      description="接收后保留通知内容"
      :value="!!store.settings.keepNotifications"
      :handle-toggle-switch="value => store.settings.keepNotifications = value"
      class="mb-7"
    />
  </Collapse>
</template>
