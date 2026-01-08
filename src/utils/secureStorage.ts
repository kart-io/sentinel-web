/**
 * 安全存储模块
 * 提供加密的 localStorage 存储功能
 */

import { encrypt, safeDecrypt } from './crypto';

/**
 * 安全存储配置
 */
interface SecureStorageConfig {
  /** 是否启用加密 */
  enableEncryption: boolean;
  /** 存储键前缀 */
  prefix?: string;
  /** 是否在开发环境显示警告 */
  showWarnings?: boolean;
}

/**
 * 默认配置
 */
const defaultConfig: SecureStorageConfig = {
  enableEncryption: import.meta.env.VITE_ENABLE_STORAGE_ENCRYPTION === 'true',
  prefix: 'sentinel-x',
  showWarnings: import.meta.env.DEV,
};

/**
 * 获取完整的存储键
 */
function getFullKey(key: string, prefix?: string): string {
  return prefix ? `${prefix}:${key}` : key;
}

/**
 * 安全存储类
 */
class SecureStorage {
  private config: SecureStorageConfig;

  constructor(config: Partial<SecureStorageConfig> = {}) {
    this.config = { ...defaultConfig, ...config };

    if (this.config.showWarnings && !this.config.enableEncryption) {
      console.warn(
        '[SecureStorage] Encryption is disabled. Set VITE_ENABLE_STORAGE_ENCRYPTION=true to enable.'
      );
    }
  }

  /**
   * 存储数据
   * @param key - 存储键
   * @param value - 要存储的值（会被 JSON 序列化）
   */
  setItem<T>(key: string, value: T): void {
    try {
      const fullKey = getFullKey(key, this.config.prefix);
      const serialized = JSON.stringify(value);

      const dataToStore = this.config.enableEncryption
        ? encrypt(serialized)
        : serialized;

      localStorage.setItem(fullKey, dataToStore);
    } catch (error) {
      console.error('[SecureStorage] Failed to set item:', key, error);
      throw new Error(`Failed to store data for key: ${key}`);
    }
  }

  /**
   * 读取数据
   * @param key - 存储键
   * @returns 存储的值，不存在时返回 null
   */
  getItem<T>(key: string): T | null {
    try {
      const fullKey = getFullKey(key, this.config.prefix);
      const data = localStorage.getItem(fullKey);

      if (!data) {
        return null;
      }

      // 如果启用加密，尝试解密
      const decrypted = this.config.enableEncryption
        ? safeDecrypt(data)
        : data;

      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('[SecureStorage] Failed to get item:', key, error);
      // 数据损坏时返回 null 而不是抛出错误
      return null;
    }
  }

  /**
   * 删除数据
   * @param key - 存储键
   */
  removeItem(key: string): void {
    try {
      const fullKey = getFullKey(key, this.config.prefix);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('[SecureStorage] Failed to remove item:', key, error);
    }
  }

  /**
   * 清空所有数据（仅清空带前缀的键）
   */
  clear(): void {
    try {
      if (this.config.prefix) {
        // 仅清空带前缀的键
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(`${this.config.prefix}:`)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      } else {
        // 如果没有前缀，清空所有
        localStorage.clear();
      }
    } catch (error) {
      console.error('[SecureStorage] Failed to clear storage:', error);
    }
  }

  /**
   * 获取所有存储的键（不包括前缀）
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    const prefixLength = this.config.prefix ? `${this.config.prefix}:`.length : 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          if (this.config.prefix) {
            if (key.startsWith(`${this.config.prefix}:`)) {
              keys.push(key.substring(prefixLength));
            }
          } else {
            keys.push(key);
          }
        }
      }
    } catch (error) {
      console.error('[SecureStorage] Failed to get all keys:', error);
    }

    return keys;
  }

  /**
   * 检查键是否存在
   */
  hasItem(key: string): boolean {
    const fullKey = getFullKey(key, this.config.prefix);
    return localStorage.getItem(fullKey) !== null;
  }

  /**
   * 迁移未加密的数据到加密存储
   * @param key - 存储键
   */
  migrateToEncrypted(key: string): void {
    if (!this.config.enableEncryption) {
      console.warn('[SecureStorage] Encryption is disabled, migration skipped');
      return;
    }

    try {
      const fullKey = getFullKey(key, this.config.prefix);
      const data = localStorage.getItem(fullKey);

      if (!data) {
        return;
      }

      // 尝试解析未加密的数据
      try {
        const parsed = JSON.parse(data);
        // 重新加密存储
        this.setItem(key, parsed);
        console.log(`[SecureStorage] Migrated key to encrypted storage: ${key}`);
      } catch {
        // 数据已经加密或格式错误，跳过
      }
    } catch (error) {
      console.error('[SecureStorage] Migration failed for key:', key, error);
    }
  }

  /**
   * 批量迁移所有数据到加密存储
   */
  migrateAllToEncrypted(): void {
    const keys = this.getAllKeys();
    keys.forEach((key) => this.migrateToEncrypted(key));
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<SecureStorageConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取当前配置
   */
  getConfig(): Readonly<SecureStorageConfig> {
    return { ...this.config };
  }
}

/**
 * 默认安全存储实例
 */
export const secureStorage = new SecureStorage();

/**
 * 创建自定义配置的安全存储实例
 */
export function createSecureStorage(config: Partial<SecureStorageConfig>): SecureStorage {
  return new SecureStorage(config);
}

/**
 * 用于 Zustand persist 中间件的存储适配器
 */
export const createZustandSecureStorage = (config?: Partial<SecureStorageConfig>) => {
  const storage = new SecureStorage(config);

  return {
    getItem: (name: string) => {
      const value = storage.getItem<unknown>(name);
      return value !== null ? JSON.stringify(value) : null;
    },
    setItem: (name: string, value: string) => {
      try {
        const parsed = JSON.parse(value);
        storage.setItem(name, parsed);
      } catch (error) {
        console.error('[ZustandSecureStorage] Failed to set item:', error);
      }
    },
    removeItem: (name: string) => {
      storage.removeItem(name);
    },
  } as const;
};

export default secureStorage;
