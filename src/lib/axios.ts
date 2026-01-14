/**
 * Axios 实例配置
 * 统一处理 API 请求和响应
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { globalMessage } from '@/utils/messageHolder';
import { getEnvConfig } from '@/config/env';
import { useAuthStore } from '@/store/authStore';
import { addBreadcrumb } from './sentry';

const config = getEnvConfig();

/**
 * 创建 axios 实例
 */
export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 * 在发送请求前添加认证 token
 */
apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    // 添加面包屑记录 API 请求
    addBreadcrumb({
      message: `API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
      category: 'http',
      level: 'info',
      data: {
        method: requestConfig.method,
        url: requestConfig.url,
        params: requestConfig.params,
      },
    });

    // 开发环境打印请求信息
    if (config.enableDebug) {
      console.log('🚀 API Request:', {
        url: requestConfig.url,
        method: requestConfig.method,
        params: requestConfig.params,
        data: requestConfig.data,
      });
    }

    return requestConfig;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);

    addBreadcrumb({
      message: 'API Request Error',
      category: 'http',
      level: 'error',
      data: {
        error: error.message,
      },
    });

    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 统一处理响应和错误
 */
apiClient.interceptors.response.use(
  (response) => {
    // 添加成功响应面包屑
    addBreadcrumb({
      message: `API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      category: 'http',
      level: 'info',
      data: {
        status: response.status,
        statusText: response.statusText,
      },
    });

    // 开发环境打印响应信息
    if (config.enableDebug) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    // 直接返回响应数据
    return response.data;
  },
  (error: AxiosError) => {
    // 添加错误响应面包屑
    addBreadcrumb({
      message: `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      category: 'http',
      level: 'error',
      data: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
      },
    });
    // 处理不同的错误状态码
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401: {
          // 未授权，清除认证信息并跳转到登录页
          globalMessage.error('登录已过期，请重新登录');
          useAuthStore.getState().logout();

          // 避免在登录页重复跳转
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        }

        case 403: {
          globalMessage.error('没有权限访问该资源');
          break;
        }

        case 404: {
          globalMessage.error('请求的资源不存在');
          break;
        }

        case 500: {
          globalMessage.error('服务器错误，请稍后重试');
          break;
        }

        case 502:
        case 503: {
          globalMessage.error('服务暂时不可用，请稍后重试');
          break;
        }

        default: {
          // 尝试从响应中获取错误消息
          const errorMessage = (data as { message?: string })?.message || '请求失败';
          globalMessage.error(errorMessage);
        }
      }

      console.error('❌ API Error:', {
        url: error.config?.url,
        status,
        data,
      });
    } else if (error.request) {
      // 请求已发出但没有收到响应
      globalMessage.error('网络连接失败，请检查网络设置');
      console.error('❌ Network Error:', error.request);
    } else {
      // 请求配置出错
      globalMessage.error('请求配置错误');
      console.error('❌ Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * 导出封装的请求方法
 */
export const request = {
  get: <T = unknown>(url: string, params?: unknown) =>
    apiClient.get<unknown, T>(url, { params }),

  post: <T = unknown>(url: string, data?: unknown) =>
    apiClient.post<unknown, T>(url, data),

  put: <T = unknown>(url: string, data?: unknown) =>
    apiClient.put<unknown, T>(url, data),

  delete: <T = unknown>(url: string, params?: unknown) =>
    apiClient.delete<unknown, T>(url, { params }),

  patch: <T = unknown>(url: string, data?: unknown) =>
    apiClient.patch<unknown, T>(url, data),
};
