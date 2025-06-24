import useStore from "@src/store/store";
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// 👉 拼接联系人全名（firstName + lastName）
export const getFullName = (contact, hyphen) => {
  return hyphen
    ? contact.firstName + "-" + contact.lastName
    : contact.firstName + " " + contact.lastName;
};

// 👉 获取会话中除了自己以外的联系人
export const getOddContact = (conversation) => {
  const store = useStore();
  let oddContact;
  for (let contact of conversation.contacts) {
    if (store.user && contact.id !== store.user.id) {
      oddContact = contact;
    }
  }
  return oddContact;
};

// 👉 获取会话头像（群聊或单聊）
export const getAvatar = (conversation) => {
  if (["group", "broadcast"].includes(conversation.type)) {
    return conversation?.avatar;
  } else {
    let oddContact = getOddContact(conversation);
    return oddContact?.avatar;
  }
};

// 👉 获取会话名称（群聊名或联系人名）
export const getName = (conversation, hyphen) => {
  if (["group", "broadcast"].includes(conversation.type)) {
    return hyphen ? conversation.name.split(" ").join("-") : conversation.name;
  } else {
    const oddContact = getOddContact(conversation);
    if (oddContact) return getFullName(oddContact, hyphen);
  }
};

// 👉 截断字符串并添加省略号
export const shorten = (message, maxLength = 23) => {
  let text;

  if (typeof message === "string") {
    text = message;
  } else {
    text = message.content;
  }

  if (text && typeof text === "string") {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }

  return "";
};

// 👉 判断消息是否包含附件
export const hasAttachments = (message) => {
  return message.attachments && message.attachments.length > 0;
};

// 👉 从路由中提取当前激活的会话 ID
// export const getActiveConversationId = () => {
//   const route = useRoute();
//   return route.params.id ? Number(route.params.id) : undefined;
// };

export const getActiveConversationId = (route) => {
  return route?.params?.id ? Number(route.params.id) : undefined;
};

// 👉 根据 ID 查找会话在数组中的索引
export const getConversationIndex = (conversationId) => {
  const store = useStore();
  let conversationIndex;
  store.conversations.forEach((conversation, index) => {
    if (conversation.id === conversationId) {
      conversationIndex = index;
    }
  });
  return conversationIndex;
};

// 👉 获取通话中除自己以外的成员
export const getOtherMembers = (call) => {
  const store = useStore();
  let members = [];

  if (call) {
    for (let member of call.members) {
      if (store.user && member.id !== store.user.id) {
        members.push(member);
      }
    }
  }

  return members;
};

// 👉 获取通话展示名称（多个成员拼接）
export const getCallName = (call, full, maxLength = 20) => {
  let members = getOtherMembers(call);
  let callName = "";

  for (let i = 0; i < members.length; i++) {
    callName += getFullName(members[i]);
    if (i < members.length - 1) {
      callName += ", ";
    }
  }

  return full ? callName : shorten(callName, maxLength);
};

// 👉 从会话中按 ID 查找消息
export const getMessageById = (conversation, messageId) => {
  if (messageId) {
    return conversation.messages.find((message) => message.id === messageId);
  }
};

// 👉 将 emoji 的 unicode 编码转换为实际表情符号
export const unicodeToEmoji = (unicode) => {
  return unicode
    .split("-")
    .map((hex) => parseInt(hex, 16))
    .map((hex) => String.fromCodePoint(hex))
    .join("");
};
