<script setup>
// 导入 Vue 组合式 API
import { ref } from "vue";

// 导入组件
import PasswordInput from "@src/components/ui/inputs/PasswordInput.vue";
import Button from "@src/components/ui/inputs/Button.vue";

// 绑定密码输入
const password = ref("");
const confirmPassword = ref("");

// 定义组件向上传递的事件
const emit = defineEmits(["active-section-change"]);
</script>

<template>
  <div>
    <div class="mb-5">
      <!-- 密码输入 -->
      <PasswordInput
        :value="password"
        label="Password"
        placeholder="Enter your password"
        class="mb-4"
        @value-changed="(value) => (password = value)"
      />

      <PasswordInput
        :value="confirmPassword"
        label="Confirm Password"
        placeholder="Enter your password"
        @value-changed="(value) => (confirmPassword = value)"
      />
    </div>

    <!-- 控制按钮 -->
    <div class="mb-5">
      <Button class="contained-primary contained-text w-full mb-4">
        Sign up
      </Button>

      <Button
        class="outlined-primary outlined-text w-full"
        @click="
          emit('active-section-change', {
            sectionName: 'personal-section',
            animationName: 'slide-right',
          })
        "
      >
        Back
      </Button>
    </div>
  </div>
</template>
