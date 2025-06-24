<script setup>
import { computed, ref } from "vue";

import GroupInfo from "@src/components/shared/modals/ComposeModal/GroupTab/GroupInfo.vue";
import GroupMembers from "@src/components/shared/modals/ComposeModal/GroupTab/GroupMembers.vue";
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";

// 声明事件
defineEmits(["activePageChange"]);

// 当前动画方向
const animation = ref("slide-left");

// 当前页面名称
const activePageName = ref("group-info");

// 当前激活组件
const ActivePage = computed(() => {
  if (activePageName.value === "group-info") return GroupInfo;
  if (activePageName.value === "group-members") return GroupMembers;
  return null;
});

// 处理页面切换
const handleChangeActiveTab = (event) => {
  animation.value = event.animationName;
  activePageName.value = event.tabName;
};
</script>

<template>
  <div>
    <!--content-->
    <div class="overflow-x-hidden">
      <SlideTransition :animation="animation">
        <component
          :is="ActivePage"
          :key="activePageName"
          @active-page-change="handleChangeActiveTab"
        />
      </SlideTransition>
    </div>
  </div>
</template>
