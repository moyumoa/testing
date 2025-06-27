import { useEffect } from 'react';
import { pubsub } from '@/utils/pubsub';

/**
 * 在组件中使用主题订阅（自动清理）
 * @param {string} topic - 订阅的事件名
 * @param {Function} handler - 收到消息时的处理函数
 */
export function usePubsub(topic, handler) {
  useEffect(() => {
    const unsubscribe = pubsub.subscribe(topic, handler);
    return () => unsubscribe(); // 卸载时自动取消订阅
  }, [topic, handler]);
}
