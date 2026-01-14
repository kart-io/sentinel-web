/**
 * 全局消息工具
 * 解决 Ant Design 静态 message 方法无法使用动态主题的问题
 *
 * 使用方法：
 * 1. 在 App 组件中渲染 <MessageHolder />
 * 2. 在任意位置使用 globalMessage.success/error/warning/info/loading
 */

import React from 'react';
import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

// 全局消息实例
let messageInstance: MessageInstance | null = null;

/**
 * 消息 Holder 组件
 * 必须在 AntdApp 组件内部渲染
 */
export function MessageHolder() {
  const { message } = App.useApp();

  React.useEffect(() => {
    messageInstance = message;
  }, [message]);

  return null;
}

/**
 * 全局消息工具
 * 可在任意位置（包括非组件代码）使用
 */
export const globalMessage = {
  success(content: string, duration?: number) {
    if (messageInstance) {
      messageInstance.success(content, duration);
    } else {
      console.warn('[globalMessage] Message instance not initialized');
    }
  },

  error(content: string, duration?: number) {
    if (messageInstance) {
      messageInstance.error(content, duration);
    } else {
      console.warn('[globalMessage] Message instance not initialized');
    }
  },

  warning(content: string, duration?: number) {
    if (messageInstance) {
      messageInstance.warning(content, duration);
    } else {
      console.warn('[globalMessage] Message instance not initialized');
    }
  },

  info(content: string, duration?: number) {
    if (messageInstance) {
      messageInstance.info(content, duration);
    } else {
      console.warn('[globalMessage] Message instance not initialized');
    }
  },

  loading(content: string, duration?: number) {
    if (messageInstance) {
      return messageInstance.loading(content, duration);
    } else {
      console.warn('[globalMessage] Message instance not initialized');
      return () => {};
    }
  },

  destroy(key?: string) {
    if (messageInstance) {
      messageInstance.destroy(key);
    }
  },
};

export default globalMessage;
