let notificationApi = null;
let messageApi = null;
const GLOBAL_MSG_KEY = 'global-msg';

function generateUniqueKey () {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function setNotificationApi (api) {
  notificationApi = api;
}

export function setMessageApi (api) {
  messageApi = api;
}

export const notify = {
  // ===== notification 消息（右上角） =====
  success (msg, description = '', duration = 3) {
    notificationApi?.success({ message: msg, description, duration });
  },
  error (msg, description = '', duration = 3) {
    notificationApi?.error({ message: msg, description, duration });
  },
  warning (msg, description = '', duration = 3) {
    notificationApi?.warning({ message: msg, description, duration });
  },
  info (msg, description = '', duration = 3) {
    notificationApi?.info({ message: msg, description, duration });
  },
  open (options) {
    notificationApi?.open(options);
  },

  // ===== 动态 message 实例调用 =====
  msg: {
    success: (content, duration = 2, key) =>
      messageApi?.open({ type: 'success', content, duration, key }),
    error: (content, duration = 2, key) =>
      messageApi?.open({ type: 'error', content, duration, key }),
    warning: (content, duration = 2, key) =>
      messageApi?.open({ type: 'warning', content, duration, key }),
    info: (content, duration = 2, key) =>
      messageApi?.open({ type: 'info', content, duration, key }),
    loading: (content, duration = 0, key) =>
      messageApi?.open({ type: 'loading', content, duration, key }),
    close: (key) => messageApi?.destroy?.(key),
  },


  // task({ text = '加载中...', final: taskFn, duration = 0 }) {
  //   const hide = messageApi?.loading(text, duration);
  //   const exec = async () => {
  //     try {
  //       await taskFn?.();
  //     } finally {
  //       hide?.();
  //     }
  //   };
  //   return exec();
  // },


  // task ({ text = '加载中...', final, key = GLOBAL_MSG_KEY }) {
  //   // 显示持久的 loading 提示，不设置 duration，防止意外销毁
  //   messageApi?.open({ type: 'loading', content: text, duration: 0, key });

  //   // 把 final 原样返回，不 catch，不影响原始流程
  //   return final?.();
  // }

  /**
   * task - 用于执行异步任务并自动管理 loading 提示
   * @param {string} text 提示内容
   * @param {Function} final 实际要执行的异步任务函数
   * @param {string} key 唯一标识符，用于区分不同的任务
   * @param {string} successText 成功提示文本
   * @param {string} errorText 失败提示文本
   * @returns {Function} 返回一个函数，执行该函数会关闭 loading 提示
   * @example
   */

  task ({
    text = '加载中...',
    final,
    key,
    successText = '操作成功',
    errorText,
  }) {
    const loadingKey = key || generateUniqueKey()
    const resultKey = loadingKey + '_result' // 用于 success / error /info 的提示

    // const actualKey = key || generateUniqueKey()

    messageApi?.open({
      type: 'loading',
      content: text,
      duration: 0,
      // key: actualKey,
      key: loadingKey,
    })

    const exec = async () => {
      try {
        const result = await final?.()

        // 先关闭 loading
        messageApi?.destroy(loadingKey)

        messageApi?.open({
          type: 'success',
          content: typeof result === 'string' ? result : successText,
          duration: 2,
          // key: actualKey,
          key: resultKey,
        })

        return result
      } catch (err) {
        messageApi?.destroy(loadingKey) // 失败也要关闭 loading

        // 只在你手动传入 errorText 时再提示一次错误
        if (errorText) {
          const errorMsg = typeof err === 'string'
            ? err
            : (err?.message || errorText)

          messageApi?.open({
            type: 'error',
            content: errorMsg,
            duration: 2.5,
            key: resultKey,
          })
        }
      }
    }

    exec.key = loadingKey
    // exec.close = () => messageApi?.destroy(actualKey)
    exec.close = () => {
      messageApi?.destroy(loadingKey)
      messageApi?.destroy(resultKey)
    }
    return exec()
  }

};
