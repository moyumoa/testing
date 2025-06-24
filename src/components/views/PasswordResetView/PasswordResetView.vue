<script setup>
// 📦 引入密码重置表单组件
import ResetForm from "@src/components/views/PasswordResetView/PasswordResetForm.vue";
</script>

<template>
  <div>
    <!-- 页面容器：撑满整个视口，垂直水平居中 -->
    <div class="w-full h-screen flex">
      <!-- 引入表单组件 -->
      <ResetForm />
    </div>
  </div>
</template>
