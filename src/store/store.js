import { defineStore } from "pinia";
import { computed, ref } from "vue";
import defaults from "@src/store/defaults";

// 📦 创建 pinia 状态管理 store
const useStore = defineStore("chat", () => {
  // 📌 从 localStorage 获取持久化数据（如果有的话）
  const storage = JSON.parse(localStorage.getItem("chat") || "{}");

  // 📍 全局状态：加载状态（idle, loading, success）
  const status = ref("idle");

  // 🧑‍💼 用户信息（当前登录用户）
  const user = ref(defaults.user);

  // 💬 会话列表
  const conversations = ref(defaults.conversations || []);

  // 🔔 通知列表
  const notifications = ref(defaults.notifications || []);

  // 📂 归档会话
  const archivedConversations = ref(defaults.archive || []);

  // 📞 通话记录
  const calls = ref(defaults.calls || []);

  // ⚙️ 设置项（暗黑模式、语言等）
  const settings = ref(storage.settings || defaults.defaultSettings);

  // 🎧 当前正在通话对象
  const activeCall = ref(defaults.activeCall);

  // 😄 最近使用的 emoji
  const recentEmoji = ref(storage.recentEmoji || []);

  // 🏽 emoji 默认肤色
  const emojiSkinTone = ref(storage.emojiSkinTone || "neutral");

  // 🔀 当前侧边栏激活模块（如 messages、contacts）
  const activeSidebarComponent = ref(storage.activeSidebarComponent || "messages");

  // ⏳ 延迟加载状态，用于 fake loading 动画
  const delayLoading = ref(true);

  // 📂 当前打开的会话 ID
  const conversationOpen = ref(storage.conversationOpen);

  // 📞 通话窗口是否最小化
  const callMinimized = ref(false);

  // 📞 是否打开语音通话面板
  const openVoiceCall = ref(false);

  // 📇 按首字母分组联系人
  const contactGroups = computed(() => {
    if (user.value) {
      const sortedContacts = [...user.value.contacts].sort();
      const groups = [];
      const groupNames = [];
      let currentLetter = "";

      for (const contact of sortedContacts) {
        const firstLetter = contact.firstName[0].toUpperCase();
        if (firstLetter !== currentLetter) {
          currentLetter = firstLetter;
          groupNames.push(currentLetter);
        }
      }

      for (const groupName of groupNames) {
        const group = { letter: groupName, contacts: [] };
        for (const contact of sortedContacts) {
          if (contact.firstName[0].toUpperCase() === groupName) {
            group.contacts.push(contact);
          }
        }
        groups.push(group);
      }

      return groups || [];
    }
    return [];
  });

  // 🔄 获取状态的计算属性
  const getStatus = computed(() => status);

  // 🪄 返回状态和数据
  return {
    status,
    getStatus,

    user,
    conversations,
    contactGroups,
    notifications,
    archivedConversations,
    calls,
    settings,
    activeCall,
    recentEmoji,
    emojiSkinTone,

    activeSidebarComponent,
    delayLoading,
    conversationOpen,
    callMinimized,
    openVoiceCall,
  };
});

export default useStore;
