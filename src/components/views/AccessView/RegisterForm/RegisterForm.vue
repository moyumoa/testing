<script setup>
// 引入 Vue 工具函数
import { computed, ref } from "vue";

// 引入组件
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";
import PasswordSection from "@src/components/views/AccessView/RegisterForm/PasswordSection.vue";
import PersonalSection from "@src/components/views/AccessView/RegisterForm/PersonalSection.vue";
import { RouterLink } from "vue-router";

// 声明父组件可以监听的事件
defineEmits(["activeSectionChange"]);

// 当前激活的表单部分（用于判断展示哪个组件）
const activeSectionName = ref("personal-section");

// 当前使用的滑动动画方向
const animation = ref("slide-left");

// 根据当前激活部分的名字，动态返回对应的组件
const ActiveSection = computed(() => {
  if (activeSectionName.value === "personal-section") {
    return PersonalSection;
  } else if (activeSectionName.value === "password-section") {
    return PasswordSection;
  }
  return null;
});

// 切换激活的表单部分，并设置动画方向
const changeActiveSection = (event) => {
  animation.value = event.animationName;
  activeSectionName.value = event.sectionName;
};
</script>

<template>
  <div class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center">
    <div class="w-full md:px-[26%] xs:px-[10%]">
      <!-- 顶部 logo 和标题 -->
      <div class="mb-6 flex flex-col">
        <img
          src="@src/assets/vectors/logo-gradient.svg"
          class="w-5.5 h-4.5 mb-5 opacity-70"
        >
        <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
          Get started with Avian
        </p>
        <p class="body-3 text-black/75 dark:text-white/70 font-light">
          Sign in to start using messaging!
        </p>
      </div>

      <!-- 表单动态区域（带滑动动画） -->
      <SlideTransition :animation="animation">
        <component
          :is="ActiveSection"
          @active-section-change="changeActiveSection"
        />
      </SlideTransition>

      <!-- 底部提示文字 -->
      <div class="flex justify-center">
        <p class="body-2 text-black/70 dark:text-white/70">
          Already have an account?
          <RouterLink
            to="/access/sign-in/"
            class="text-indigo-400 opacity-100"
          >
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
