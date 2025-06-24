// 📌 由妍妍自动转换为 JavaScript，已去除类型定义并添加中文注释
import { defineStore } from "pinia";

import { computed, ref } from "vue";

import defaults from "@src/store/defaults";


const useStore = defineStore("chat", () => {
  // local storage
  const storage = JSON.parse(localStorage.getItem("chat") || "{}");

  // app status refs
  const status = ref("idle");

  // app data refs
  // data refs
  const user<IUser | undefined> = ref(defaults.user);
  const conversations<IConversation[]> = ref(defaults.conversations || []);
  const notifications<INotification[]> = ref(defaults.notifications || []);
  const archivedConversations<IConversation[]> = ref(
    defaults.archive || []
  );
  const calls<ICall[]> = ref(defaults.calls || []);
  const settings<ISettings> = ref(
    storage.settings || defaults.defaultSettings
  );
  const activeCall<ICall | undefined> = ref(defaults.activeCall);
  const recentEmoji<IEmoji[]> = ref(storage.recentEmoji || []);
  const emojiSkinTone<string> = ref(storage.emojiSkinTone || "neutral");

  // ui refs
  const activeSidebarComponent<string> = ref(
    storage.activeSidebarComponent || "messages"
  );
  const delayLoading = ref(true);
  const conversationOpen<string | undefined> = ref(
    storage.conversationOpen
  );
  const callMinimized = ref(false);
  const openVoiceCall = ref(false);

  // contacts grouped alphabetically.
  const contactGroups<IContactGroup[] | undefined> = computed(() => {
    if (user.value) {
      let sortedContacts = [...user.value.contacts];

      sortedContacts.sort();

      let groups[] = [];
      let currentLetter = "";
      let groupNames[] = [];

      // create an array of letter for every different sort level.
      for (let contact of sortedContacts) {
        // if the first letter is different create a new group.
        if (contact.firstName[0].toUpperCase() !== currentLetter) {
          currentLetter = contact.firstName[0].toUpperCase();
          groupNames.push(currentLetter);
        }
      }

      // create an array that groups contact names based on the first letter;
      for (let groupName of groupNames) {
        let group = { letter, contacts: [] };
        for (let contact of sortedContacts) {
          if (contact.firstName[0].toUpperCase() === groupName) {
            group.contacts.push(contact);
          }
        }
        groups.push(group);
      }

      return groups;
    }
  });

  const getStatus = computed(() => status);

  return {
    // status refs
    status,
    getStatus,

    // data refs
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

    // ui refs
    activeSidebarComponent,
    delayLoading,
    conversationOpen,
    callMinimized,
    openVoiceCall,
  };
});

export default useStore;
