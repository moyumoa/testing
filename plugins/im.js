// plugins/im.js
import Vue from 'vue';
import { WKIM, WKIMChannelType, WKIMEvent } from 'easyjssdk';
import pushmp from './audio/pushmp.mp3';

const im = Vue.observable({
  sdk: null,
  ready: false,
  conversations: []
});

const imPlugin = {
  install (Vue) {
    const inner = uni.createInnerAudioContext();
    inner.src = pushmp;
    inner.onError(res => console.error('🔊 播放失败:', res));

    let audioUnlocked = false;
    document.addEventListener('touchend', () => {
      if (!audioUnlocked) {
        inner.play().then(() => {
          inner.pause();
          inner.seek(0);
          audioUnlocked = true;
          console.log('🔓 已解锁音频播放权限');
        }).catch(e => console.warn('🔓 解锁失败:', e));
      }
    }, { once: true, passive: true });

    im.init = async (userInfo) => {
      if (!userInfo?.uid || !userInfo?.token) return;

      // 初始化 SDK
      im.sdk = WKIM.init('ws://192.168.9.99:5200', {
        uid: userInfo.uid,
        token: userInfo.token,
        deviceFlag: 2,
      });

      // 监听连接状态
      im.sdk.on(WKIMEvent.Connect, () => {
        console.log('✅ IM 已连接');
        im.ready = true;
        loadConversations();
      });
      im.sdk.on(WKIMEvent.Disconnect, () => {
        console.warn('⚠️ IM 断开');
        im.ready = false;
      });

      // 监听新消息
      im.sdk.on(WKIMEvent.Message, (msg) => {
        console.log('📥 收到消息:', msg);
        if (audioUnlocked && msg.fromUid !== im.sdk.uid) {
          inner.stop();
          inner.seek(0);
          inner.play().catch(err => console.warn('🔊 播放失败:', err));
        }
        // 若在当前会话页面，可更新 UI；否则更新会话列表
        updateConversationList(msg);
      });

      await im.sdk.connect();
    };

    async function loadConversations () {
      // EasyJSSDK 默认不支持历史会话接口，需要自己实现缓存或接口
      // 这里假设 uni.$api.conversation 存在
      const resp = await uni.$api.conversation({ msg_count: 1 });
      const list = resp.conversations.map(Convert.toConversation);
      im.conversations.splice(0, im.conversations.length, ...list);
    }

    function updateConversationList (msg) {
      const idx = im.conversations.findIndex(c =>
        c.channelID === msg.channelID && c.channelType === msg.channelType
      );
      const conv = {
        channelID: msg.channelID,
        channelType: msg.channelType,
        lastMessage: msg,
        // unread 处理：如果 UI 不在对应界面，则 ++
        unread: idx > -1 ? im.conversations[idx].unread + 1 : 1,
      };
      if (idx > -1) {
        Vue.set(im.conversations, idx, conv);
        const tmp = im.conversations.splice(idx, 1)[0];
        im.conversations.unshift(tmp);
      } else {
        uni.$api.getImUser(msg.channelID).then(user => {
          // 可补充 user 信息
          im.conversations.unshift(conv);
        });
      }
    }

    im.clearUnread = (channelID, channelType) => {
      const idx = im.conversations.findIndex(c =>
        c.channelID === channelID && c.channelType === channelType
      );
      if (idx > -1) {
        const c = { ...im.conversations[idx], unread: 0 };
        Vue.set(im.conversations, idx, c);
      }
    };

    Vue.prototype.$im = im;
  }
};

export default imPlugin;