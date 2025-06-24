<script setup>
// 👉 导入所需模块与组件
import { ref } from "vue";
import useStore from "@src/store/store";

import AccordionButton from "@src/components/ui/data-display/AccordionButton.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import DropFileUpload from "@src/components/ui/inputs/DropFileUpload.vue";
import LabeledTextInput from "@src/components/ui/inputs/LabeledTextInput.vue";
import Collapse from "@src/components/ui/utils/Collapse.vue";

// 👉 接收父组件的控制属性
const props = defineProps({
  collapsed: Boolean,
  handleToggle: Function,
});

// 👉 获取全局状态管理
const store = useStore();

// 👉 表单绑定数据：账号设置字段
const accountValues = ref({
  firstName: store.user?.firstName,
  lastName: store.user?.lastName,
  avatar: undefined,
});

// 👉 控制保存按钮加载状态
const loading = ref(false);

// 👉 提交保存表单
const handleSubmit = () => {
  loading.value = true;

  // 更新全局状态中的用户信息
  store.$patch({
    user: {
      ...store.user,
      firstName: accountValues.value.firstName,
      lastName: accountValues.value.lastName,
    },
  });

  // 模拟延时提交
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>

<template>
  <!--账号设置-->
  <AccordionButton
    id="account-settings-toggler"
    class="w-full flex px-5 py-6 mb-3 rounded focus:outline-none"
    :collapsed="props.collapsed"
    chevron
    aria-controls="account-settings-collapse"
    @click="handleToggle()"
  >
    <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
      账号信息
    </p>
    <p class="body-2 text-black/70 dark:text-white/70">
      修改个人资料信息
    </p>
  </AccordionButton>

  <Collapse
    id="account-settings-collapse"
    :collapsed="props.collapsed"
  >
    <!--名字输入框-->
    <LabeledTextInput
      label="名字"
      class="mb-5"
      :value="accountValues.firstName"
      @value-changed="value => accountValues.firstName = value"
    />

    <!--姓氏输入框-->
    <LabeledTextInput
      label="姓氏"
      class="mb-5"
      :value="accountValues.lastName"
      @value-changed="value => accountValues.lastName = value"
    />

    <!--头像上传-->
    <DropFileUpload
      label="头像"
      class="mb-7"
      accept="image/*"
      :value="accountValues.avatar"
      @value-changed="value => accountValues.avatar = value"
    />

    <!--保存按钮-->
    <Button
      class="contained-primary contained-text w-full py-4"
      :loading="loading"
      @click="handleSubmit"
    >
      保存设置
    </Button>
  </Collapse>
</template>
