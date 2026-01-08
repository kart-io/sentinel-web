/**
 * 存储迁移工具
 * 用于将旧版本未加密的数据迁移到新的加密存储
 */

import { secureStorage } from './secureStorage';

/**
 * 需要迁移的存储键列表
 */
const MIGRATION_KEYS = [
  'sentinel-x:auth-storage', // authStore 的存储键
];

/**
 * 检查是否已完成迁移
 */
function isMigrationCompleted(): boolean {
  const flag = localStorage.getItem('sentinel-x:migration-completed');
  return flag === 'true';
}

/**
 * 标记迁移完成
 */
function markMigrationCompleted(): void {
  localStorage.setItem('sentinel-x:migration-completed', 'true');
}

/**
 * 检查数据是否看起来是加密的
 */
function looksEncrypted(data: string): boolean {
  // AES 加密后的数据通常以 "U2FsdGVkX1" 开头
  return data.startsWith('U2FsdGVk');
}

/**
 * 迁移单个存储项
 */
function migrateStorageItem(key: string): boolean {
  try {
    const data = localStorage.getItem(key);

    if (!data) {
      console.log(`[Migration] Key not found, skipping: ${key}`);
      return true;
    }

    // 如果数据已经是加密的，跳过
    if (looksEncrypted(data)) {
      console.log(`[Migration] Data already encrypted, skipping: ${key}`);
      return true;
    }

    // 尝试解析未加密的数据
    try {
      const parsed = JSON.parse(data);

      // 删除旧数据
      localStorage.removeItem(key);

      // 使用加密存储重新保存
      // 提取实际的存储键（去掉前缀）
      const storageKey = key.replace('sentinel-x:', '');
      secureStorage.setItem(storageKey, parsed);

      console.log(`[Migration] Successfully migrated key: ${key}`);
      return true;
    } catch (parseError) {
      console.warn(`[Migration] Failed to parse data for key: ${key}`, parseError);
      // 如果无法解析，保留原数据不做修改
      return false;
    }
  } catch (error) {
    console.error(`[Migration] Failed to migrate key: ${key}`, error);
    return false;
  }
}

/**
 * 执行存储迁移
 * @returns 是否成功完成迁移
 */
export function migrateStorage(): boolean {
  // 检查是否启用加密
  const encryptionEnabled = import.meta.env.VITE_ENABLE_STORAGE_ENCRYPTION === 'true';

  if (!encryptionEnabled) {
    console.log('[Migration] Encryption disabled, skipping migration');
    return true;
  }

  // 检查是否已完成迁移
  if (isMigrationCompleted()) {
    console.log('[Migration] Migration already completed, skipping');
    return true;
  }

  console.log('[Migration] Starting storage migration...');

  let allSuccess = true;

  // 迁移所有需要的键
  for (const key of MIGRATION_KEYS) {
    const success = migrateStorageItem(key);
    if (!success) {
      allSuccess = false;
    }
  }

  // 如果全部成功，标记迁移完成
  if (allSuccess) {
    markMigrationCompleted();
    console.log('[Migration] Storage migration completed successfully');
  } else {
    console.warn('[Migration] Storage migration completed with some errors');
  }

  return allSuccess;
}

/**
 * 重置迁移状态（用于测试或重新迁移）
 * ⚠️ 仅在开发环境使用
 */
export function resetMigration(): void {
  if (import.meta.env.DEV) {
    localStorage.removeItem('sentinel-x:migration-completed');
    console.log('[Migration] Migration status reset');
  } else {
    console.warn('[Migration] Cannot reset migration in production');
  }
}

/**
 * 获取迁移状态信息
 */
export function getMigrationStatus(): {
  completed: boolean;
  encryptionEnabled: boolean;
  keysToMigrate: string[];
} {
  return {
    completed: isMigrationCompleted(),
    encryptionEnabled: import.meta.env.VITE_ENABLE_STORAGE_ENCRYPTION === 'true',
    keysToMigrate: MIGRATION_KEYS,
  };
}

/**
 * 在开发环境暴露到 window 对象，方便调试
 */
if (import.meta.env.DEV) {
  (window as any).__storageMigration = {
    migrate: migrateStorage,
    reset: resetMigration,
    status: getMigrationStatus,
  };
}
