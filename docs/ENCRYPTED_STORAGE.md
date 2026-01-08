# Token 加密存储指南

## 📋 概述

为了提高应用的安全性，Sentinel-X Web 实现了 **Token 加密存储**功能。所有存储在 `localStorage` 中的敏感数据（如认证 Token、用户信息）都会使用 **AES 加密算法**进行加密，防止本地存储数据泄露。

---

## 🔐 核心功能

### 1. **AES 加密算法**
- 使用 AES (Advanced Encryption Standard) 对称加密
- 支持自定义加密密钥
- 自动加密/解密存储数据

### 2. **透明集成**
- 无需修改业务代码
- 自动应用于 Zustand Store
- 兼容现有 localStorage 接口

### 3. **向后兼容**
- 自动迁移未加密的旧数据
- 平滑升级，无需手动干预
- 支持加密开关（开发/生产环境）

### 4. **安全存储包装器**
- 提供类型安全的存储接口
- 支持自定义存储前缀
- 错误处理和日志记录

---

## 🚀 快速开始

### 1. 配置环境变量

#### 开发环境 (`.env.development`)

```bash
# 开发环境可以禁用加密，方便调试
VITE_ENABLE_STORAGE_ENCRYPTION=false
VITE_ENCRYPTION_KEY=
```

#### 生产环境 (`.env.production`)

```bash
# 生产环境强烈建议启用加密
VITE_ENABLE_STORAGE_ENCRYPTION=true

# 设置强加密密钥（建议至少 32 位）
# 使用以下命令生成随机密钥：
# openssl rand -base64 32
VITE_ENCRYPTION_KEY=your-strong-encryption-key-here
```

### 2. 生成强加密密钥

使用 OpenSSL 生成随机密钥：

```bash
# Linux/Mac
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

输出示例：
```
K3zVx8Nf2Qw9Rm4Yp1Lj6Hg5Dc7Bs0At
```

将生成的密钥配置到 `.env.production` 文件中。

---

## 📦 使用方法

### 1. Zustand Store 集成（自动）

authStore 已自动集成加密存储，无需额外配置：

```typescript
// src/store/authStore.ts
import { createZustandSecureStorage } from '@/utils/secureStorage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ... store 实现
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createZustandSecureStorage() as StateStorage),
    }
  )
);
```

### 2. 手动使用加密存储

如果需要在其他地方使用加密存储：

```typescript
import { secureStorage } from '@/utils/secureStorage';

// 存储数据
secureStorage.setItem('user-preferences', {
  theme: 'dark',
  language: 'zh-CN',
});

// 读取数据
const preferences = secureStorage.getItem<UserPreferences>('user-preferences');

// 删除数据
secureStorage.removeItem('user-preferences');

// 清空所有数据（仅清空带前缀的键）
secureStorage.clear();
```

### 3. 创建自定义存储实例

```typescript
import { createSecureStorage } from '@/utils/secureStorage';

const customStorage = createSecureStorage({
  enableEncryption: true,
  prefix: 'my-app',
  showWarnings: true,
});

customStorage.setItem('data', { foo: 'bar' });
```

---

## 🔧 核心 API

### `secureStorage`

默认的加密存储实例。

#### 方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `setItem<T>(key, value)` | 存储数据 | `key: string, value: T` | `void` |
| `getItem<T>(key)` | 读取数据 | `key: string` | `T \| null` |
| `removeItem(key)` | 删除数据 | `key: string` | `void` |
| `clear()` | 清空所有数据 | - | `void` |
| `hasItem(key)` | 检查键是否存在 | `key: string` | `boolean` |
| `getAllKeys()` | 获取所有键 | - | `string[]` |

### 加密工具函数

#### `encrypt(data: string): string`
加密字符串数据。

```typescript
import { encrypt } from '@/utils/crypto';

const encrypted = encrypt('sensitive-data');
```

#### `decrypt(encryptedData: string): string`
解密数据。

```typescript
import { decrypt } from '@/utils/crypto';

const original = decrypt(encrypted);
```

#### `safeDecrypt(data: string): string`
安全解密，失败时返回原数据（用于向后兼容）。

```typescript
import { safeDecrypt } from '@/utils/crypto';

const data = safeDecrypt(maybeEncryptedData);
```

#### `generateKey(length?: number): string`
生成随机加密密钥。

```typescript
import { generateKey } from '@/utils/crypto';

const key = generateKey(32); // 生成 32 位密钥
console.log(key);
```

---

## 🔄 数据迁移

### 自动迁移

应用启动时会自动执行迁移，将未加密的旧数据迁移到加密存储：

```typescript
// src/main.tsx
import { migrateStorage } from './utils/storageMigration';

// 执行迁移
migrateStorage();
```

### 手动迁移（开发环境）

在开发环境，可以通过浏览器控制台手动控制迁移：

```javascript
// 查看迁移状态
window.__storageMigration.status();

// 手动执行迁移
window.__storageMigration.migrate();

// 重置迁移状态（重新迁移）
window.__storageMigration.reset();
```

---

## 🛡️ 安全建议

### 1. **生产环境必须使用强密钥**

❌ 错误示例：
```bash
VITE_ENCRYPTION_KEY=123456
```

✅ 正确示例：
```bash
VITE_ENCRYPTION_KEY=K3zVx8Nf2Qw9Rm4Yp1Lj6Hg5Dc7Bs0At8Cv9Dw
```

### 2. **密钥管理**

- 🔐 **不要**将密钥提交到 Git 仓库
- 🔐 使用环境变量或密钥管理服务
- 🔐 定期轮换加密密钥
- 🔐 不同环境使用不同密钥

### 3. **密钥强度验证**

使用内置的密钥强度验证：

```typescript
import { validateKeyStrength } from '@/utils/crypto';

const strength = validateKeyStrength('your-key');
// 返回: 'weak' | 'medium' | 'strong'

if (strength === 'weak') {
  console.warn('密钥强度不足，建议更换！');
}
```

### 4. **开发环境配置**

开发环境可以禁用加密以方便调试：

```bash
# .env.development
VITE_ENABLE_STORAGE_ENCRYPTION=false
```

但生产环境**必须启用**：

```bash
# .env.production
VITE_ENABLE_STORAGE_ENCRYPTION=true
```

---

## 📊 加密前后对比

### 未加密存储（不安全）

```javascript
// localStorage 中的内容（明文）
{
  "sentinel-x:auth-storage": {
    "state": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "123",
        "username": "admin",
        "email": "admin@example.com"
      }
    }
  }
}
```

### 加密存储（安全）

```javascript
// localStorage 中的内容（加密后）
{
  "sentinel-x:auth-storage": "U2FsdGVkX1+xK8yF4vZh3Q9w..."
}
```

---

## 🔍 调试和测试

### 1. 查看存储内容

```javascript
// 开发环境查看加密前的数据
import { secureStorage } from '@/utils/secureStorage';

const data = secureStorage.getItem('auth-storage');
console.log(data);
```

### 2. 测试加密功能

```javascript
import { encrypt, decrypt } from '@/utils/crypto';

// 测试加密/解密
const original = 'Hello, World!';
const encrypted = encrypt(original);
const decrypted = decrypt(encrypted);

console.log(original === decrypted); // true
```

### 3. 清除加密数据

```javascript
// 清空所有加密存储
import { secureStorage } from '@/utils/secureStorage';
secureStorage.clear();
```

---

## ⚡ 性能影响

### 加密开销

- **加密速度**: ~1ms per operation
- **存储增加**: 约增加 20-30% 存储空间（Base64 编码）
- **内存开销**: 可忽略不计

### 优化建议

1. **仅加密敏感数据**: 不需要加密的数据使用普通 localStorage
2. **批量操作**: 减少频繁的加密/解密操作
3. **缓存策略**: 对于频繁读取的数据，考虑内存缓存

---

## 🐛 故障排查

### 问题 1: 解密失败

**原因**: 密钥不匹配或数据损坏

**解决方案**:
1. 检查 `VITE_ENCRYPTION_KEY` 是否正确
2. 清除 localStorage 重新登录
3. 检查迁移日志

### 问题 2: 旧数据无法读取

**原因**: 未执行迁移或迁移失败

**解决方案**:
```javascript
// 手动触发迁移
window.__storageMigration.migrate();
```

### 问题 3: 开发环境看不到加密效果

**原因**: 开发环境禁用了加密

**解决方案**:
```bash
# .env.development
VITE_ENABLE_STORAGE_ENCRYPTION=true
```

---

## 📖 技术实现

### 加密算法

- **算法**: AES (Advanced Encryption Standard)
- **模式**: CBC (Cipher Block Chaining)
- **库**: crypto-js

### 存储架构

```
┌─────────────────┐
│   Application   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Zustand Store  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SecureStorage   │
│   (Wrapper)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Encrypt │
    └────┬────┘
         ▼
┌─────────────────┐
│  localStorage   │
│  (Encrypted)    │
└─────────────────┘
```

---

## 📝 更新日志

### v1.0.0 (2026-01-08)

- ✅ 实现 AES 加密存储
- ✅ 集成 Zustand Store
- ✅ 自动数据迁移
- ✅ 支持开发/生产环境配置
- ✅ 完整的类型支持
- ✅ 密钥强度验证

---

## 🔗 相关资源

- [crypto-js 文档](https://github.com/brix/crypto-js)
- [Zustand 文档](https://docs.pmnd.rs/zustand)
- [AES 加密原理](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

## 📞 技术支持

如有问题，请参考：

- 项目文档：`docs/`
- Issue 追踪：GitHub Issues
- 开发团队：Sentinel-X Dev Team

---

**安全提示**: 加密存储可以提高安全性，但不能完全防止所有攻击。请结合其他安全措施（HTTPS、Token 过期、CSP 等）使用。
