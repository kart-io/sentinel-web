/**
 * 加密工具模块
 * 提供 AES 加密/解密功能用于保护敏感数据
 */

import CryptoJS from 'crypto-js';

/**
 * 从环境变量或默认值获取加密密钥
 * 生产环境应该使用强密钥并通过环境变量配置
 */
function getEncryptionKey(): string {
  // 优先使用环境变量中的密钥
  const envKey = import.meta.env.VITE_ENCRYPTION_KEY;

  if (envKey) {
    return envKey;
  }

  // 开发环境使用默认密钥（生产环境必须配置环境变量）
  if (import.meta.env.DEV) {
    console.warn(
      '[Security Warning] Using default encryption key in development mode. ' +
      'Please set VITE_ENCRYPTION_KEY in production!'
    );
  }

  // 默认密钥（不要在生产环境使用）
  return 'sentinel-x-default-encryption-key-change-me';
}

/**
 * 使用 AES 加密数据
 * @param data - 需要加密的数据（字符串）
 * @returns 加密后的字符串
 */
export function encrypt(data: string): string {
  try {
    const key = getEncryptionKey();
    const encrypted = CryptoJS.AES.encrypt(data, key);
    return encrypted.toString();
  } catch (error) {
    console.error('[Crypto] Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * 使用 AES 解密数据
 * @param encryptedData - 加密的数据字符串
 * @returns 解密后的原始字符串
 */
export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const originalData = decrypted.toString(CryptoJS.enc.Utf8);

    if (!originalData) {
      throw new Error('Decryption result is empty');
    }

    return originalData;
  } catch (error) {
    console.error('[Crypto] Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * 检查字符串是否为加密数据
 * AES 加密后的数据通常以 "U2FsdGVkX1" 开头（Base64 编码）
 */
export function isEncrypted(data: string): boolean {
  // 简单的启发式检查：AES 加密数据的特征
  return data.startsWith('U2FsdGVk') || /^[A-Za-z0-9+/]+=*$/.test(data);
}

/**
 * 安全地尝试解密数据，如果解密失败则返回原始数据
 * 用于向后兼容未加密的数据
 */
export function safeDecrypt(data: string): string {
  if (!data) {
    return data;
  }

  // 如果数据看起来不像加密数据，直接返回
  if (!isEncrypted(data)) {
    return data;
  }

  try {
    return decrypt(data);
  } catch (error) {
    // 解密失败，可能是未加密的数据，返回原始数据
    console.warn('[Crypto] Safe decrypt failed, returning original data');
    return data;
  }
}

/**
 * 生成随机密钥（用于初始化配置）
 * @param length - 密钥长度（字符数）
 */
export function generateKey(length = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    key += charset[array[i] % charset.length];
  }

  return key;
}

/**
 * 验证加密密钥强度
 * @param key - 要验证的密钥
 * @returns 密钥强度级别：weak, medium, strong
 */
export function validateKeyStrength(key: string): 'weak' | 'medium' | 'strong' {
  if (!key || key.length < 16) {
    return 'weak';
  }

  const hasUpperCase = /[A-Z]/.test(key);
  const hasLowerCase = /[a-z]/.test(key);
  const hasNumbers = /[0-9]/.test(key);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(key);

  const complexity = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;

  if (key.length >= 32 && complexity >= 3) {
    return 'strong';
  }

  if (key.length >= 24 && complexity >= 2) {
    return 'medium';
  }

  return 'weak';
}
