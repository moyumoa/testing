// 🔒 请求异常处理锁：只允许一个错误处理弹窗，同时提供自动解锁机制

let hasHandledLock = false;
let unlockTimer = null;

/**
 * 是否处于锁定状态
 * @returns {boolean}
 */
export function isLocked() {
  return hasHandledLock;
}

/**
 * 手动设置锁状态（带可选的自动解锁超时）
 * @param {boolean} val - true=上锁，false=解锁
 * @param {number} timeout - 自动解锁时间（毫秒），默认 5000ms
 */
export function setLock(val = true, timeout = 5000) {
  clearTimeout(unlockTimer); // 💡 清除旧定时器

  if (val) {
    if (!hasHandledLock) {
      hasHandledLock = true;
      if (timeout > 0) {
        unlockTimer = setTimeout(() => {
          hasHandledLock = false;
          console.warn('[lockManager] ⏱️ 请求异常锁已自动解锁');
        }, timeout);
      }
    }
  } else {
    hasHandledLock = false;
  }
}

/**
 * 仅在未锁状态下执行 handler，并自动加锁（防止重复处理）
 * @param {Function} handler - 要执行的函数
 * @param {number} timeout - 自动解锁时间（毫秒），默认 5000ms
 */
export function lockOnce(handler, timeout = 5000) {
  if (hasHandledLock) return;
  hasHandledLock = true;

  try {
    handler?.();
  } finally {
    clearTimeout(unlockTimer);
    if (timeout > 0) {
      unlockTimer = setTimeout(() => {
        hasHandledLock = false;
        console.warn('[lockManager] ⏱️ lockOnce 自动解锁');
      }, timeout);
    }
  }
}
