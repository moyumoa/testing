<template>
  <view>
    <view class="chat-page" :style="{ height: `calc(var(--real-height) - ${inputHeight}px)` }">
      <!-- <view class="page-bg" :style="{ backgroundImage: `url('/static/bgs/bg_chat.jpeg')` }" /> -->
      <view class="message-wrap">
        <scroll-view scroll-y enable-flex class="scroll-list" @scrolltolower="loadHistory" :scroll-top="scrollTop">
          <view class="message-item-wrap">
            <view v-for="(item, index) in messageList" :key="item.key" @click="onClick(index)">
              <MessageItem :detail="item.payload"></MessageItem>
            </view>
          </view>
          <view class="loading-wrap" v-show="more" :style="{ display: loadingStatus ? '' : 'none' }">
            <uni-load-more :iconSize="18" :status="loadingStatus" />
          </view>
        </scroll-view>
      </view>
      <!-- <view :style="{ height: inputBottomValue }"></view> -->
    </view>
    <view id="chat-input-wrap" class="input-wrap" :style="{ bottom: inputBottomValue }">
      <input id="robotInput" class="input" v-model="inputValue" :adjust-position="false" type="text"
        @confirm="sendMessage" :confirm-hold="true" confirm-type="send" />
      <view class="send-btn" @tap="sendMessage">
        <image src="@/static/enter_n.png" mode=""></image>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import MessageItem from '@/components/messageItem/messageItem.vue';
import {
  Channel,
  ChannelTypePerson,
  MessageText,
} from "wukongimjssdk"
export default {
  components: {
    MessageItem
  },
  data: () => ({
    inputValue: '', // 输入框内容
    scrollTop: undefined, // 滚动位置
    messageList: [], // 消息列表
    loadingStatus: 'more', // 加载状态
    inputBottomValue: '0', // 输入框底部位置
    inputHeight: 44, // 输入框高度
    originWindowHeight: 0, // 初始窗口高度
    options: {}, // 页面参数
    start_message_seq: 0, // 开始消息序列号
    end_message_seq: 0, // 结束消息序列号
    more: true // // 是否有更多
  }),
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  onReady () {
    // 页面准备就绪时获取inputRef高度
    this.$nextTick(() => {
      // 记录初始窗口高度
      this.originWindowHeight = window.innerHeight
      // 计算 input 高度
      const query = uni.createSelectorQuery().in(this)
      query.select('#chat-input-wrap').boundingClientRect(data => {
        this.inputHeight = data?.height || 44;
      }).exec()

      // ⚠️ 使用resize事件兼容H5键盘显示/隐藏
      this.handleWindowResize()
      window.addEventListener('resize', this.handleWindowResize)

    })
  },
  onLoad (options) {
    this.options = options;
    this.getMessages()
    // 注册消息监听
    this.$im.sdk.chatManager.addMessageListener(this.handleNewMessage)
  },
  // 组件卸载取消监听
  onUnload () {
    this.$im.sdk.chatManager.removeMessageListener(this.handleNewMessage)
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleNewMessage (message) {
      const { channelID, channelType } = this.options
      // 判断消息是否属于当前会话
      if (
        message.channel.channelID === channelID &&
        message.channel.channelType === Number(channelType)
      ) {
        console.log('新消息:', message)
        this.messageList.push({
          key: message.messageID || new Date().getTime(),
          status: message.status,
          payload: {
            ...message.content.contentObj || { content: message.content.text } || {},
            opposite: this.getUserInfo.uid !== message.fromUID, // 是否是对方消息
          },
          timestamp: message.timestamp
        })
        this.resetChat();
      }
    },
    // 拉取消息
    async getMessages (callback) {
      const params = {
        "login_uid": this.getUserInfo.uid, // 当前登录用户uid
        "channel_id": this.options.channelID, //  频道ID
        "channel_type": Number(this.options.channelType), // 频道类型
        "start_message_seq": this.start_message_seq, // 开始消息列号（结果包含start_message_seq的消息）
        "end_message_seq": this.end_message_seq, // 结束消息列号（结果不包含end_message_seq的消息）
        "limit": 20, // 消息数量限制
        "pull_mode": 0 // 拉取模式 0:向下拉取 1:向上拉取
      }
      const { start_message_seq, end_message_seq, more, messages } = await uni.$api.getMessages(params)
      this.start_message_seq = messages[0]?.message_seq - 1 || -1
      this.end_message_seq = 0
      this.more = messages.length >= 20

      const list = messages.map(item => {
        return {
          key: item.message_idstr || item.messageID,
          message_id: item.message_id,
          message_idstr: item.message_idstr,
          payload: {
            ...item.payload,
            opposite: this.getUserInfo.uid !== item.from_uid,
          },
          timestamp: item.timestamp
        }
      });
      if (callback) return callback(list);
      this.messageList = list;
    },

    sendMessage () {
      if (!this.inputValue) return;
      const channel = new Channel(this.options.channelID, ChannelTypePerson)
      const content = new MessageText(this.inputValue)
      this.$im.sdk.chatManager.send(content, channel)
    },

    resetChat () {
      this.inputValue = '';
      this.scrollTop = 0;
      this.$nextTick(() => {
        this.scrollTop = undefined;
      });
    },

    loadHistory () {
      console.log('加载更多历史消息', this.loadingStatus, this.start_message_seq, this.more);
      if (!this.more || !this.start_message_seq || this.loadingStatus !== 'more') return;
      this.loadingStatus = 'loading';

      this.getMessages(list => {
        console.log('加载更多历史消息', list);
        this.messageList = [...list, ...this.messageList];
        this.loadingStatus = 'more';
      })
    },

    handleWindowResize () {
      const diff = this.originWindowHeight - window.innerHeight
      this.inputBottomValue = diff > 0 ? diff + 'px' : '0'
    },

    onClick (index) {
      // 可根据需要补充点击事件
    }
  }
};
</script>

<style lang="scss" scoped>
.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  // background-image: url('@/static/bg_chat.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2); // 添加一个半透明的白色遮罩
  }
}

.chat-page {
  // padding-top: 12px;
  // height: calc(100vh - 100px - env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  // background-color: rgb(240, 242, 247);
  // 渐变背景
  background: linear-gradient(75deg, rgba(224, 233, 255, 0.3) 0%, rgba(224, 233, 255, 0.5) 100%);

  .message-wrap {
    height: 0;
    flex: 1;

    .scroll-list {
      height: 100%;
      transform: scaleY(-1);
    }

    .message-item-wrap {
      padding-top: 12px;
      min-height: 100%;
      transform: scaleY(-1);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .loading-wrap {
      transform: scaleY(-1);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10rpx;
    }
  }
}

.input-wrap {
  // background-color: #fff;
  background-color: rgba(224, 233, 255, 0.5);
  // height: calc(env(safe-area-inset-bottom) + 60px);
  width: 100%;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;

  .input {
    flex: 1;
    height: 40px;
    border-radius: 5px;
    // background-color: #F1F7FB;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 0 12px;
    font-size: 15px;
  }

  .send-btn {
    height: 40px;
    width: 40px;
    padding: 10px;
    border-radius: 50%;
    // background-color: #f152cc;
    background: linear-gradient(45deg, #080808 0%, #b6eaff 100%);
    margin-left: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      height: 100%;
      width: 100%;
    }
  }
}

.input-area {
  flex: 1;
  max-height: 120px; // 约5行高度
  padding: 10px 12px;
  font-size: 15px;
  line-height: 20px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
<style>
view {
  box-sizing: border-box;
}
</style>