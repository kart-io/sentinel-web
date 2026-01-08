/**
 * Sentry 配置与初始化
 * 提供错误追踪和性能监控功能
 */

import * as Sentry from '@sentry/react';
import { getEnvConfig } from '@/config/env';

const config = getEnvConfig();

/**
 * Sentry 配置接口
 */
interface SentryConfig {
  dsn: string;
  environment: string;
  enabled: boolean;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
}

/**
 * 获取 Sentry 配置
 */
function getSentryConfig(): SentryConfig {
  return {
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    environment: config.env,
    enabled: import.meta.env.VITE_SENTRY_ENABLED === 'true',
    // 性能追踪采样率 (0.0 - 1.0)
    // 生产环境建议 0.1 (10%)，开发环境可以设置 1.0 (100%)
    tracesSampleRate: config.isProduction ? 0.1 : 1.0,
    // Session Replay 采样率
    replaysSessionSampleRate: config.isProduction ? 0.1 : 0.5,
    // 错误时的 Replay 采样率
    replaysOnErrorSampleRate: 1.0,
  };
}

/**
 * 初始化 Sentry
 */
export function initSentry() {
  const sentryConfig = getSentryConfig();

  // 如果 Sentry 未启用或没有配置 DSN，则不初始化
  if (!sentryConfig.enabled || !sentryConfig.dsn) {
    if (config.enableDebug) {
      console.log('📊 Sentry is disabled or DSN not configured');
    }
    return;
  }

  try {
    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: sentryConfig.environment,

      // 集成配置
      integrations: [
        // 浏览器追踪
        Sentry.browserTracingIntegration({
          // 可以添加额外的配置
        }),

        // Session Replay - 记录用户会话
        Sentry.replayIntegration({
          maskAllText: true, // 隐藏所有文本
          blockAllMedia: true, // 阻止所有媒体
        }),
      ],

      // 性能监控采样率
      tracesSampleRate: sentryConfig.tracesSampleRate,

      // Session Replay 采样率
      replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate,
      replaysOnErrorSampleRate: sentryConfig.replaysOnErrorSampleRate,

      // 发布版本
      release: `${import.meta.env.VITE_APP_TITLE}@${import.meta.env.VITE_APP_VERSION}`,

      // 忽略特定错误
      ignoreErrors: [
        // 浏览器扩展错误
        'top.GLOBALS',
        'chrome-extension://',
        'moz-extension://',
        // 网络错误
        'NetworkError',
        'Network request failed',
        'Failed to fetch',
        // 取消的请求
        'AbortError',
        'Request aborted',
      ],

      // 在发送前处理事件
      beforeSend(event, hint) {
        // 开发环境打印错误信息
        if (config.isDevelopment) {
          console.error('🚨 Sentry Event:', event);
          console.error('🚨 Original Error:', hint.originalException);
        }

        // 在生产环境中过滤敏感信息
        if (config.isProduction) {
          // 移除可能包含敏感信息的请求头
          if (event.request?.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['Cookie'];
          }
        }

        return event;
      },

      // 在发送性能追踪前处理
      beforeSendTransaction(event) {
        // 开发环境打印性能信息
        if (config.isDevelopment) {
          console.log('📊 Sentry Transaction:', event);
        }
        return event;
      },
    });

    // 设置用户上下文（如果已登录）
    // 这将在应用启动后由 auth store 更新

    if (config.enableDebug) {
      console.log('✅ Sentry initialized successfully', {
        environment: sentryConfig.environment,
        tracesSampleRate: sentryConfig.tracesSampleRate,
      });
    }
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
}

/**
 * 设置 Sentry 用户信息
 */
export function setSentryUser(user: {
  id: string;
  username?: string;
  email?: string;
}) {
  Sentry.setUser({
    id: user.id,
    username: user.username,
    email: user.email,
  });
}

/**
 * 清除 Sentry 用户信息
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * 手动捕获异常
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  if (context) {
    Sentry.setContext('additional_context', context);
  }
  Sentry.captureException(error);
}

/**
 * 手动捕获消息
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * 添加面包屑（用于追踪用户操作）
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, unknown>;
}) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * 设置标签
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * 设置上下文
 */
export function setContext(name: string, context: Record<string, unknown>) {
  Sentry.setContext(name, context);
}

/**
 * 启动性能监控事务
 * 注意：Sentry v8 使用 startSpan 替代 startTransaction
 */
export function startPerformanceSpan(name: string, op: string, callback: () => void | Promise<void>) {
  return Sentry.startSpan({ name, op }, callback);
}

// 导出 Sentry 实例以便高级使用
export { Sentry };
