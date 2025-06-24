<script setup>
// 👉 导入 Vue 相关 API
import { ref } from "vue";

// 👉 导入每个设置区域的组件
import AccountSettings from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/AccountSettings.vue";
import PrivacySettings from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/PrivacySettings.vue";
import AppearanceSettings from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/AppearanceSettings.vue";
import NotificationsSettings from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/NotificationsSettings.vue";

// 👉 预设手风琴每项的 key 名（用于逻辑判断）
const accordionItems = {
  accountSettings: "account-settings",
  privacySettings: "privacy-settings",
  appearanceSettings: "appearance-settings",
  notificationsSettings: "notifications-settings",
};

// 👉 控制每一项是否折叠
const accordionState = ref({
  "account-settings": true,
  "privacy-settings": true,
  "appearance-settings": true,
  "notifications-settings": true,
});

// 👉 点击某项时，只展开该项，其它收起
const handleToggle = (name) => {
  for (let key of Object.keys(accordionState.value)) {
    if (key !== name) {
      accordionState.value[key] = true; // 其它项收起
    }
  }
  // 当前项展开/折叠切换
  accordionState.value[name] = !accordionState.value[name];
};
</script>

<template>
  <!-- 设置页面的手风琴区域 -->
  <div
    role="list"
    aria-label="设置选项卡按钮组"
    class="h-full"
  >
    <AccountSettings
      :collapsed="accordionState['account-settings']"
      :handle-toggle="() => handleToggle(accordionItems.accountSettings)"
    />
    <PrivacySettings
      :collapsed="accordionState['privacy-settings']"
      :handle-toggle="() => handleToggle(accordionItems.privacySettings)"
    />
    <AppearanceSettings
      :collapsed="accordionState['appearance-settings']"
      :handle-toggle="() => handleToggle(accordionItems.appearanceSettings)"
    />
    <NotificationsSettings
      :collapsed="accordionState['notifications-settings']"
      :handle-toggle="() => handleToggle(accordionItems.notificationsSettings)"
    />
  </div>
</template>
