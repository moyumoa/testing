<script setup>
// 引入响应式工具
import { ref } from "vue";

// 引入自定义组件
import Button from "@src/components/ui/inputs/Button.vue";
import PasswordInput from "@src/components/ui/inputs/PasswordInput.vue";

// 定义响应式密码字段
const oldPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
</script>

<template>
  <div class="w-full p-5 flex flex-col justify-center items-center">
    <div class="mb-6 w-87.5">
      <!--顶部标题区域-->
      <div class="mb-6 flex flex-col">
        <img
          src="@src/assets/vectors/logo-gradient.svg"
          class="w-5.5 h-4.5 mb-4 opacity-70"
          alt="bird logo"
        >
        <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
          重置你的密码
        </p>
        <p class="body-3 text-black/75 dark:text-white/70 font-light">
          请输入旧密码和新密码以重置账户密码
        </p>
      </div>

      <!--表单输入区-->
      <div class="mb-6">
        <PasswordInput
          :value="oldPassword"
          bordered
          label="旧密码"
          placeholder="请输入旧密码"
          class="mb-5"
          @value-changed="value => oldPassword = value"
        />

        <PasswordInput
          :value="newPassword"
          bordered
          label="新密码"
          placeholder="请输入新密码"
          class="mb-5"
          @value-changed="value => newPassword = value"
        />

        <PasswordInput
          :value="confirmNewPassword"
          bordered
          label="确认新密码"
          placeholder="请再次输入新密码"
          @value-changed="value => confirmNewPassword = value"
        />
      </div>

      <!--操作按钮-->
      <div>
        <Button
          class="contained-primary contained-text w-full"
          link
          to="/"
        >
          重置密码
        </Button>
      </div>
    </div>
  </div>
</template>
