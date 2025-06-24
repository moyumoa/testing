<script setup>
// 👉 导入全局状态和 UI 组件
import useStore from "@src/store/store";
import AccordionButton from "@src/components/ui/data-display/AccordionButton.vue";
import Collapse from "@src/components/ui/utils/Collapse.vue";
import SettingsSwitch from "@src/components/views/HomeView/Sidebar/Settings/SettingsAccordion/SettingsSwitch.vue";

// 👉 接收折叠控制的 props
const props = defineProps({
  collapsed: Boolean,
  handleToggle: Function,
});

const store = useStore();
</script>

<template>
  <!--外观设置-->
  <AccordionButton
    id="appearance-settings-toggler"
    class="w-full flex px-5 py-6 mb-3 rounded focus:outline-none"
    :collapsed="props.collapsed"
    chevron
    aria-controls="appearance-settings-collapse"
    @click="props.handleToggle()"
  >
    <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
      外观设置
    </p>
    <p class="body-2 text-black/70 dark:text-white/70">
      自定义界面显示风格
    </p>
  </AccordionButton>

  <Collapse
    id="appearance-settings-collapse"
    :collapsed="props.collapsed"
  >
    <!--暗色模式切换-->
    <SettingsSwitch
      title="暗黑模式"
      description="启用深色主题界面"
      :value="!!store.settings.darkMode"
      :handle-toggle-switch="value => store.settings.darkMode = value"
      class="mb-7"
    />

    <!--边框主题切换-->
    <SettingsSwitch
      title="边框风格"
      description="为界面元素增加边框样式"
      :value="!!store.settings.borderedTheme"
      :handle-toggle-switch="value => store.settings.borderedTheme = value"
      class="mb-7"
    />
  </Collapse>
</template>
