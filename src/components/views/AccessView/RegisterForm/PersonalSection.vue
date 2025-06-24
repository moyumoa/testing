<script setup>
// 引入组件
import Button from "@src/components/ui/inputs/Button.vue";
import LabeledTextInput from "@src/components/ui/inputs/LabeledTextInput.vue";

// 声明可以向上传递的事件（配合 defineEmits 使用）
const emit = defineEmits(["active-section-change"]);
</script>

<template>
  <div>
    <!-- 表单输入区域 -->
    <div class="mb-5">
      <LabeledTextInput
        label="Email"
        placeholder="Enter your email"
        class="mb-5"
      />
      <LabeledTextInput
        label="First Name"
        placeholder="Enter your first name"
        class="mb-5"
      />
      <LabeledTextInput
        label="Last Name"
        placeholder="Enter your last name"
        class="mb-5"
      />
    </div>

    <!-- 下一步按钮 -->
    <div class="mb-6">
      <Button
        class="contained-primary contained-text w-full mb-4"
        @click="
          emit('active-section-change', {
            sectionName: 'password-section',
            animationName: 'slide-left',
          })
        "
      >
        Next
      </Button>
    </div>

    <!-- 分割线 -->
    <div class="mb-6 flex items-center">
      <span
        class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"
      />
      <p class="body-3 text-black/75 dark:text-white/70 px-4 font-light">
        or
      </p>
      <span
        class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"
      />
    </div>

    <!-- 第三方登录按钮 -->
    <Button class="outlined-primary outlined-text w-full mb-5">
      <img
        src="@src/assets/vectors/google-logo.svg"
        class="mr-3"
        alt="google-logo"
      >
      Sign in with google
    </Button>
  </div>
</template>
