<script setup>
// ✅ 引入 Vue 工具函数
import { ref } from "vue"

// ✅ 引入状态管理
import useStore from "@src/store/store"

// ✅ 引入图标组件（Heroicons）
import {
  BellIcon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/vue/24/solid"

// ✅ 引入子组件
import AccountDropdown from "@src/components/views/HomeView/Navigation/AccountDropdown.vue"
import Logo from "@src/components/views/HomeView/Navigation/Logo.vue"
import NavLink from "@src/components/views/HomeView/Navigation/NavLink.vue"

// ✅ 获取全局状态
const store = useStore()

// 控制 dropdown 显示
const showDropdown = ref(false)

// 切换侧边栏的激活组件
const handleActiveSidebarComponentChange = (value) => {
  store.activeSidebarComponent = value
}
</script>

<template>
  <div
    class="xs:w-full md:w-11 md:h-full md:py-7 xs:py-5 px-5 flex xs:flex-row md:flex-col items-center transition-all duration-500"
  >
    <!-- 🧷 Logo 区域 -->
    <Logo />

    <!-- 🧭 主导航 -->
    <div class="grow">
      <nav aria-label="主导航">
        <ul class="xs:flex md:block xs:justify-between xs:items-center">
          <!-- 💬 消息按钮 -->
          <li>
            <NavLink
              :icon="ChatBubbleOvalLeftIcon"
              title="会话"
              :active="store.activeSidebarComponent === 'messages'"
              @click="() => handleActiveSidebarComponentChange('messages')"
            />
          </li>

          <!-- 👤 联系人按钮 -->
          <li>
            <NavLink
              :icon="UserIcon"
              title="联系人"
              :active="store.activeSidebarComponent === 'contacts'"
              @click="() => handleActiveSidebarComponentChange('contacts')"
            />
          </li>

          <!-- 📱 小屏下拉菜单 -->
          <li>
            <AccountDropdown
              id="small-profile-menu"
              class="xs:block md:hidden"
              aria-labelledby="small-profile-menu-button"
              :show-dropdown="showDropdown"
              :handle-show-dropdown="() => (showDropdown = true)"
              :handle-close-dropdown="() => (showDropdown = false)"
            />
          </li>

          <!-- 🔔 通知按钮 -->
          <li class="xs:hidden md:inline">
            <NavLink
              :icon="BellIcon"
              title="通知"
              :notifications="3"
              :active="store.activeSidebarComponent === 'notifications'"
              @click="() => handleActiveSidebarComponentChange('notifications')"
            />
          </li>

          <!-- 📞 通话记录 -->
          <li>
            <NavLink
              :icon="PhoneIcon"
              title="通话"
              :active="store.activeSidebarComponent === 'phone'"
              @click="() => handleActiveSidebarComponentChange('phone')"
            />
          </li>

          <!-- ⚙️ 小屏设置按钮 -->
          <li class="xs:inline md:hidden">
            <NavLink
              :icon="Cog6ToothIcon"
              title="设置"
              :active="store.activeSidebarComponent === 'settings'"
              @click="() => handleActiveSidebarComponentChange('settings')"
            />
          </li>
        </ul>
      </nav>
    </div>

    <!-- 🛠️ 侧边栏次级导航 -->
    <div>
      <nav
        aria-label="辅助导航"
        class="xs:hidden md:block"
      >
        <ul>
          <!-- 🌞 夜间模式切换 -->
          <li>
            <NavLink
              :icon="store.settings.darkMode ? SunIcon : MoonIcon"
              title="夜间模式"
              @click="store.settings.darkMode = !store.settings.darkMode"
            />
          </li>

          <!-- ⚙️ 设置按钮 -->
          <li>
            <NavLink
              :icon="Cog6ToothIcon"
              title="设置"
              :active="store.activeSidebarComponent === 'settings'"
              @click="() => handleActiveSidebarComponentChange('settings')"
            />
          </li>
        </ul>
      </nav>

      <!-- 分隔线 -->
      <hr
        class="xs:hidden md:block mb-6 border-gray-100 dark:border-gray-600"
      >

      <!-- 👤 用户头像（大屏） -->
      <AccountDropdown
        id="profile-menu"
        class="xs:hidden md:block"
        aria-labelledby="profile-menu-button"
        :show-dropdown="showDropdown"
        :handle-show-dropdown="() => (showDropdown = true)"
        :handle-close-dropdown="() => (showDropdown = false)"
      />
    </div>
  </div>
</template>
