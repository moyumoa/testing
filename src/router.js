// 📌 由妍妍自动转换为 JavaScript，已去除类型定义并添加中文注释
import { createRouter, createWebHistory } from "vue-router";
import AccessView from "@src/components/views/AccessView/AccessView.vue";
import HomeView from "@src/components/views/HomeView/HomeView.vue";
import PasswordResetView from "@src/components/views/PasswordResetView/PasswordResetView.vue";
import Chat from "@src/components/views/HomeView/Chat/Chat.vue";

const routes = [
  {
    path: "/chat/",
    name: "Home",
    alias: "/",
    component,
    children: [
      {
        path: "/chat/",
        alias: "/",
        name: "No-Chat",
        component,
      },
      {
        path: "/chat//",
        name: "Chat",
        component,
      },
    ],
  },
  {
    path: "/access//",
    name: "Access",
    component,
  },
  {
    path: "/reset/",
    name: "Password Reset",
    component,
  },
];

// create the router
const router = createRouter({
  history(),
  routes,
});

// (router gaurd) when navigating in mobile screen from chat to chatlist,
// don't navigate to the previous chat navigate to the chatlist.
router.beforeEach((to, from, next) => {
  //console.log(window.innerWidth);
  if (from.name === "Chat" && to.name === "Chat" && window.innerWidth <= 967)
    next({ name: "No-Chat" });
  else next();
});

export default router;
