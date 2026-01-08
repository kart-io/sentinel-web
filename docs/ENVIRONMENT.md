# 环境配置指南

本文档详细说明 Sentinel-X Web 项目的环境变量配置。

---

## 📋 目录

- [配置文件说明](#配置文件说明)
- [环境变量详解](#环境变量详解)
- [不同环境配置](#不同环境配置)
- [安全最佳实践](#安全最佳实践)
- [常见问题](#常见问题)

---

## 配置文件说明

### 配置文件优先级

Vite 按以下优先级加载环境变量（从高到低）：

```
.env.local          # 本地覆盖配置（不提交到 Git）
.env.[mode]         # 特定模式配置（development/production）
.env                # 基础配置（所有环境共享）
```

### 项目配置文件

```
sentinel-web/
├── .env.local.example  # 本地配置模板（示例文件）
├── .env.development    # 开发环境配置
├── .env.production     # 生产环境配置
└── .gitignore          # 排除 .env.local 不提交
```

**重要**: `.env.local` 文件包含敏感信息，已在 `.gitignore` 中排除，不会提交到版本控制。

---

## 环境变量详解

### 应用基本信息

#### `VITE_APP_TITLE`
- **类型**: `string`
- **说明**: 应用标题，显示在浏览器标签页
- **示例**: `Sentinel-X Web`
- **默认值**:
  - 开发环境: `Sentinel-X Web (开发)`
  - 生产环境: `Sentinel-X Web`

#### `VITE_APP_VERSION`
- **类型**: `string`
- **说明**: 应用版本号
- **示例**: `0.0.0`
- **默认值**: `0.0.0`

#### `VITE_APP_ENV`
- **类型**: `'local' | 'development' | 'production'`
- **说明**: 环境标识
- **示例**: `development`
- **默认值**: 根据构建模式自动设置

---

### API 配置

#### `VITE_API_BASE_URL`
- **类型**: `string (URL)`
- **说明**: 后端 API 基础地址
- **示例**:
  - 开发: `http://localhost:3000/api`
  - 生产: `https://api.sentinel-x.com/api`
- **必填**: ✅

#### `VITE_API_TIMEOUT`
- **类型**: `number (毫秒)`
- **说明**: API 请求超时时间
- **示例**: `30000` (30秒)
- **默认值**: `30000`
- **推荐值**:
  - 开发: `30000`
  - 生产: `10000` - `30000`

---

### 调试配置

#### `VITE_ENABLE_MOCK`
- **类型**: `boolean`
- **说明**: 是否启用 Mock 数据
- **示例**: `true`
- **默认值**:
  - 开发: `true`
  - 生产: `false`

#### `VITE_ENABLE_DEBUG`
- **类型**: `boolean`
- **说明**: 是否启用调试模式
- **示例**: `true`
- **默认值**:
  - 开发: `true`
  - 生产: `false`

#### `VITE_LOG_LEVEL`
- **类型**: `'debug' | 'info' | 'warn' | 'error'`
- **说明**: 日志级别
- **示例**: `debug`
- **默认值**:
  - 开发: `debug`
  - 生产: `error`

---

### Sentry 配置

#### `VITE_SENTRY_DSN`
- **类型**: `string (URL)`
- **说明**: Sentry 数据源名称（DSN）
- **示例**: `https://<key>@<organization>.ingest.sentry.io/<project>`
- **获取方式**:
  1. 访问 [sentry.io](https://sentry.io/)
  2. 创建项目
  3. 在项目设置中获取 DSN
- **必填**: 生产环境推荐

#### `VITE_SENTRY_ENABLED`
- **类型**: `boolean`
- **说明**: 是否启用 Sentry
- **示例**: `true`
- **默认值**:
  - 开发: `false`
  - 生产: `true`
- **建议**:
  - 开发环境禁用，避免干扰调试
  - 生产环境启用，监控错误

---

### 加密存储配置

#### `VITE_ENABLE_STORAGE_ENCRYPTION`
- **类型**: `boolean`
- **说明**: 是否启用 localStorage 加密
- **示例**: `true`
- **默认值**:
  - 开发: `false`
  - 生产: `true`
- **安全建议**:
  - ✅ 生产环境必须启用
  - ⚠️ 开发环境可选禁用（方便调试）

#### `VITE_ENCRYPTION_KEY`
- **类型**: `string`
- **说明**: AES 加密密钥
- **最小长度**: 16 字符
- **推荐长度**: 32 字符以上
- **生成方式**:
  ```bash
  # 使用 OpenSSL
  openssl rand -base64 32

  # 使用 Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **示例**: `K3zVx8Nf2Qw9Rm4Yp1Lj6Hg5Dc7Bs0At`
- **必填**: 生产环境启用加密时必填
- **安全要求**:
  - ✅ 至少 32 位
  - ✅ 包含大小写字母、数字、特殊字符
  - ✅ 使用随机生成工具
  - ❌ 不要使用弱密钥（如 `123456`）
  - ❌ 不要提交到 Git

---

## 不同环境配置

### 开发环境 (`.env.development`)

```bash
# 应用基本信息
VITE_APP_TITLE=Sentinel-X Web (开发)
VITE_APP_VERSION=0.0.0
VITE_APP_ENV=development

# API 配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# 调试配置
VITE_ENABLE_MOCK=true
VITE_ENABLE_DEBUG=true
VITE_LOG_LEVEL=debug

# Sentry 配置（可选）
VITE_SENTRY_DSN=
VITE_SENTRY_ENABLED=false

# 加密存储配置（可选）
VITE_ENABLE_STORAGE_ENCRYPTION=false
VITE_ENCRYPTION_KEY=
```

**特点**:
- ✅ 启用 Mock 数据，方便前端独立开发
- ✅ 启用调试模式，详细日志输出
- ✅ 禁用 Sentry，避免干扰
- ✅ 可选禁用加密，方便查看存储数据

---

### 生产环境 (`.env.production`)

```bash
# 应用基本信息
VITE_APP_TITLE=Sentinel-X Web
VITE_APP_VERSION=0.0.0
VITE_APP_ENV=production

# API 配置
VITE_API_BASE_URL=https://api.sentinel-x.com/api
VITE_API_TIMEOUT=30000

# 调试配置
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=error

# Sentry 配置（强烈建议配置）
VITE_SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project>
VITE_SENTRY_ENABLED=true

# 加密存储配置（必须配置）
VITE_ENABLE_STORAGE_ENCRYPTION=true
VITE_ENCRYPTION_KEY=<生成的强密钥>
```

**特点**:
- ✅ 禁用 Mock 数据，使用真实 API
- ✅ 禁用调试模式，仅记录错误日志
- ✅ 启用 Sentry，监控生产错误
- ✅ 启用加密存储，保护敏感数据

---

### 本地环境 (`.env.local`)

用于个人本地开发，覆盖默认配置：

```bash
# 复制示例文件
cp .env.local.example .env.local

# 编辑本地配置
# 例如：使用本地后端服务
VITE_API_BASE_URL=http://localhost:8080/api

# 或者测试 Sentry 集成
VITE_SENTRY_DSN=<你的测试 DSN>
VITE_SENTRY_ENABLED=true

# 测试加密功能
VITE_ENABLE_STORAGE_ENCRYPTION=true
VITE_ENCRYPTION_KEY=test-encryption-key-for-local
```

**注意**: `.env.local` 不会提交到 Git，可以放心添加敏感信息。

---

## 安全最佳实践

### 1. 敏感信息保护

❌ **不要** 将以下信息提交到 Git:
- Sentry DSN
- 加密密钥
- API 密钥
- 数据库连接字符串

✅ **正确做法**:
```bash
# .env.local （不提交）
VITE_SENTRY_DSN=https://real-dsn@sentry.io/123
VITE_ENCRYPTION_KEY=real-encryption-key

# .env.local.example （提交示例）
VITE_SENTRY_DSN=
VITE_ENCRYPTION_KEY=
```

### 2. 密钥强度

❌ **弱密钥示例**:
```bash
VITE_ENCRYPTION_KEY=123456
VITE_ENCRYPTION_KEY=password
```

✅ **强密钥示例**:
```bash
VITE_ENCRYPTION_KEY=K3zVx8Nf2Qw9Rm4Yp1Lj6Hg5Dc7Bs0At8Cv9Dw
```

### 3. 环境隔离

不同环境使用不同的密钥和配置：

```bash
# 开发环境
VITE_ENCRYPTION_KEY=dev-key-123

# 测试环境
VITE_ENCRYPTION_KEY=test-key-456

# 生产环境
VITE_ENCRYPTION_KEY=prod-key-789
```

### 4. 定期轮换

- 🔄 每 3-6 个月更换加密密钥
- 🔄 重大安全事件后立即更换
- 🔄 保留旧密钥用于解密历史数据

---

## 环境变量访问

### 在代码中访问

```typescript
// ✅ 正确：使用 import.meta.env
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const sentryEnabled = import.meta.env.VITE_SENTRY_ENABLED === 'true';

// ❌ 错误：Node.js 风格（Vite 不支持）
const apiUrl = process.env.VITE_API_BASE_URL; // undefined
```

### 类型安全访问

创建配置模块（推荐）:

```typescript
// src/config/env.ts
export function getEnvConfig() {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT),
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    sentryEnabled: import.meta.env.VITE_SENTRY_ENABLED === 'true',
    encryptionEnabled: import.meta.env.VITE_ENABLE_STORAGE_ENCRYPTION === 'true',
    encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY,
  };
}

// 使用
import { getEnvConfig } from '@/config/env';
const config = getEnvConfig();
console.log(config.apiBaseUrl);
```

---

## 常见问题

### Q1: 为什么环境变量必须以 `VITE_` 开头？

**A**: Vite 出于安全考虑，只暴露以 `VITE_` 前缀的环境变量到客户端代码。这防止意外泄露服务器端敏感信息。

```bash
# ✅ 会暴露到客户端
VITE_API_BASE_URL=http://localhost:3000

# ❌ 不会暴露到客户端
API_BASE_URL=http://localhost:3000
SECRET_KEY=my-secret
```

### Q2: 修改环境变量后需要重启开发服务器吗？

**A**: 是的。Vite 在启动时读取环境变量，修改后需要重启 `npm run dev`。

### Q3: 如何在不同环境使用不同配置？

**A**: 使用 Vite 的 `--mode` 参数：

```bash
# 使用开发环境配置
npm run dev           # 自动使用 .env.development

# 使用生产环境配置构建
npm run build         # 自动使用 .env.production

# 使用自定义模式
vite build --mode staging  # 使用 .env.staging
```

### Q4: 如何验证环境变量是否正确加载？

**A**: 在浏览器控制台检查：

```javascript
// 查看所有 VITE_ 环境变量
console.log(import.meta.env);

// 查看特定变量
console.log(import.meta.env.VITE_API_BASE_URL);
```

### Q5: 生产环境如何配置环境变量？

**A**: 根据部署平台不同：

#### Vercel / Netlify
在项目设置中配置环境变量（Web UI）

#### Docker
通过 `.env` 文件或 docker-compose.yml:

```yaml
services:
  web:
    environment:
      - VITE_API_BASE_URL=https://api.example.com
      - VITE_SENTRY_DSN=https://...
```

#### CI/CD
在 GitHub Actions / GitLab CI 中配置密钥:

```yaml
# .github/workflows/deploy.yml
env:
  VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
  VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
  VITE_ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
```

### Q6: 忘记加密密钥怎么办？

**A**: 如果忘记密钥，已加密的数据将无法解密：

1. **开发/测试环境**: 清除 localStorage，重新登录
   ```javascript
   localStorage.clear();
   ```

2. **生产环境**:
   - 如果有备份密钥，使用备份密钥
   - 否则，用户需要重新登录
   - 考虑实现密钥找回机制

---

## 快速配置检查清单

### 开发环境 ✅

- [ ] 复制 `.env.local.example` 到 `.env.local`
- [ ] 配置 `VITE_API_BASE_URL` 指向本地后端
- [ ] 启用 `VITE_ENABLE_MOCK=true`（如果后端未就绪）
- [ ] 禁用 `VITE_SENTRY_ENABLED=false`
- [ ] 可选禁用加密 `VITE_ENABLE_STORAGE_ENCRYPTION=false`

### 生产环境 ✅

- [ ] 配置正确的 `VITE_API_BASE_URL`
- [ ] 禁用 Mock: `VITE_ENABLE_MOCK=false`
- [ ] 配置 Sentry DSN 并启用
- [ ] 启用加密: `VITE_ENABLE_STORAGE_ENCRYPTION=true`
- [ ] 生成并配置强加密密钥
- [ ] 验证所有环境变量已正确设置
- [ ] 确保敏感信息未提交到 Git

---

## 相关文档

- [开发指南](./DEVELOPMENT.md)
- [Sentry 集成](./SENTRY.md)
- [加密存储](./ENCRYPTED_STORAGE.md)

---

**安全提示**: 环境变量可能包含敏感信息，请妥善保管，不要泄露或提交到版本控制系统。
