class PubSub {
  constructor() {
    this.topics = new Map();
  }

  subscribe(topic, callback) {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, new Set());
    }
    this.topics.get(topic).add(callback);
    return () => this.unsubscribe(topic, callback); // 返回取消订阅函数
  }

  unsubscribe(topic, callback) {
    if (!this.topics.has(topic)) return;
    this.topics.get(topic).delete(callback);
    if (this.topics.get(topic).size === 0) {
      this.topics.delete(topic);
    }
  }

  publish(topic, data) {
    if (!this.topics.has(topic)) return;
    for (const cb of this.topics.get(topic)) {
      try {
        cb(data);
      } catch (err) {
        console.warn(`PubSub callback error on topic "${topic}"`, err);
      }
    }
  }

  clear(topic) {
    if (topic) {
      this.topics.delete(topic);
    } else {
      this.topics.clear();
    }
  }
}

export const pubsub = new PubSub();
