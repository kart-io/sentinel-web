import { message } from 'antd';
import { captureException, addBreadcrumb } from '@/lib/sentry';
import type { SeverityLevel } from '@sentry/react';

/**
 * 错误级别
 */
export type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal';

/**
 * 错误类型
 */
export type ErrorType = 'network' | 'api' | 'validation' | 'business' | 'system' | 'unknown';

// 常量定义
export const ErrorLevel = {
  INFO: 'info' as const,
  WARNING: 'warning' as const,
  ERROR: 'error' as const,
  FATAL: 'fatal' as const,
};

export const ErrorType = {
  NETWORK: 'network' as const,
  API: 'api' as const,
  VALIDATION: 'validation' as const,
  BUSINESS: 'business' as const,
  SYSTEM: 'system' as const,
  UNKNOWN: 'unknown' as const,
};

/**
 * 错误上下文
 */
export interface ErrorContext {
  type?: ErrorType;
  level?: ErrorLevel;
  userId?: string;
  action?: string;
  component?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 处理错误
 */
export function handleError(error: Error | unknown, context?: ErrorContext) {
  const actualError = error instanceof Error ? error : new Error(String(error));
  const errorType = context?.type || ErrorType.UNKNOWN;
  const errorLevel = context?.level || ErrorLevel.ERROR;

  // 添加面包屑
  addBreadcrumb({
    message: actualError.message,
    category: errorType,
    level: errorLevel as SeverityLevel,
    data: {
      ...context?.metadata,
      action: context?.action,
      component: context?.component,
    },
  });

  // 根据错误级别决定是否显示用户提示
  if (errorLevel === ErrorLevel.ERROR || errorLevel === ErrorLevel.FATAL) {
    message.error(getUserFriendlyMessage(actualError, errorType));
  } else if (errorLevel === ErrorLevel.WARNING) {
    message.warning(getUserFriendlyMessage(actualError, errorType));
  }

  // 上报到 Sentry
  captureException(actualError, {
    errorType,
    errorLevel,
    ...context,
  });

  // 开发环境打印详细错误信息
  if (import.meta.env.DEV) {
    console.error('❌ Error Details:', {
      error: actualError,
      context,
      stack: actualError.stack,
    });
  }
}

/**
 * 获取用户友好的错误消息
 */
function getUserFriendlyMessage(error: Error, type: ErrorType): string {
  // 如果错误消息是中文，直接返回
  if (/[\u4e00-\u9fa5]/.test(error.message)) {
    return error.message;
  }

  // 根据错误类型返回友好消息
  const messageMap: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: '网络连接失败，请检查网络设置',
    [ErrorType.API]: '服务请求失败，请稍后重试',
    [ErrorType.VALIDATION]: '输入数据验证失败',
    [ErrorType.BUSINESS]: '操作失败，请重试',
    [ErrorType.SYSTEM]: '系统错误，请联系管理员',
    [ErrorType.UNKNOWN]: '发生未知错误，请重试',
  };

  return messageMap[type] || error.message;
}

/**
 * 处理 API 错误
 */
export function handleApiError(error: unknown, action?: string) {
  handleError(error, {
    type: ErrorType.API,
    level: ErrorLevel.ERROR,
    action,
  });
}

/**
 * 处理网络错误
 */
export function handleNetworkError(error: unknown) {
  handleError(error, {
    type: ErrorType.NETWORK,
    level: ErrorLevel.ERROR,
  });
}

/**
 * 处理业务逻辑错误
 */
export function handleBusinessError(error: unknown, action?: string) {
  handleError(error, {
    type: ErrorType.BUSINESS,
    level: ErrorLevel.WARNING,
    action,
  });
}

/**
 * 处理表单验证错误
 */
export function handleValidationError(error: unknown, component?: string) {
  handleError(error, {
    type: ErrorType.VALIDATION,
    level: ErrorLevel.WARNING,
    component,
  });
}

/**
 * 异步函数错误包装器
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      throw error; // 重新抛出错误，让调用者可以处理
    }
  }) as T;
}

/**
 * 性能监控包装器
 */
export function withPerformanceMonitoring<T extends (...args: unknown[]) => unknown>(
  fn: T,
  operationName: string
): T {
  return ((...args: unknown[]) => {
    const startTime = performance.now();

    try {
      const result = fn(...args);

      // 如果返回 Promise，等待完成后再计算时间
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          logPerformance(operationName, duration);
        });
      }

      const duration = performance.now() - startTime;
      logPerformance(operationName, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logPerformance(operationName, duration, true);
      throw error;
    }
  }) as T;
}

/**
 * 记录性能指标
 */
function logPerformance(operation: string, duration: number, hasError = false) {
  // 添加性能面包屑
  addBreadcrumb({
    message: `Performance: ${operation}`,
    category: 'performance',
    level: 'info',
    data: {
      duration: `${duration.toFixed(2)}ms`,
      hasError,
    },
  });

  // 开发环境输出性能日志
  if (import.meta.env.DEV) {
    const emoji = hasError ? '❌' : duration > 1000 ? '⚠️' : '✅';
    console.log(`${emoji} Performance [${operation}]: ${duration.toFixed(2)}ms`);
  }
}

/**
 * 创建错误实例
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly level: ErrorLevel;
  public readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    level: ErrorLevel = ErrorLevel.ERROR,
    metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.level = level;
    this.metadata = metadata;
  }
}
