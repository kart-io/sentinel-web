# 多环境配置指南

## 概述

本项目支持多环境配置，包括开发（development）、测试（test）、预发布（staging）和生产（production）环境。

## 环境配置文件

### 配置文件说明

- `.env` - 所有环境的默认配置
- `.env.development` - 开发环境配置
- `.env.test` - 测试环境配置
- `.env.staging` - 预发布环境配置
- `.env.production` - 生产环境配置
- `.env.local` - 本地环境配置（不提交到 Git）
- `.env.local.example` - 本地配置示例

### 配置优先级

Vite 会按以下优先级加载环境变量（优先级从高到低）：

1. `.env.[mode].local` - 特定模式的本地配置
2. `.env.[mode]` - 特定模式的配置
3. `.env.local` - 本地配置
4. `.env` - 默认配置

## 环境变量

### 变量命名规则

所有环境变量必须以 `VITE_` 前缀开头才能在客户端代码中访问。

### 可用变量

#### 应用基本信息

```bash
VITE_APP_TITLE=Sentinel-X Web
VITE_APP_VERSION=0.0.0
```

#### API 配置

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

#### 环境标识

```bash
VITE_APP_ENV=development
```

#### 调试配置

```bash
VITE_ENABLE_MOCK=true
VITE_ENABLE_DEBUG=true
VITE_LOG_LEVEL=debug
```

## npm 脚本

### 开发环境

```bash
# 启动开发服务器（development 模式）
npm run dev

# 启动测试环境开发服务器
npm run dev:test

# 启动预发布环境开发服务器
npm run dev:staging
```

### 构建

```bash
# 构建生产环境
npm run build

# 构建开发环境
npm run build:dev

# 构建测试环境
npm run build:test

# 构建预发布环境
npm run build:staging
```

### 预览

```bash
# 预览生产构建
npm run preview

# 预览测试环境构建
npm run preview:test

# 预览预发布环境构建
npm run preview:staging
```

## 在代码中使用环境变量

### 方式一：直接访问（不推荐）

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### 方式二：使用配置模块（推荐）

```typescript
import envConfig from '@/config';

console.log(envConfig.apiBaseUrl);
console.log(envConfig.isDevelopment);
console.log(envConfig.isProduction);
```

### 配置模块 API

```typescript
interface EnvConfig {
  appTitle: string;
  appVersion: string;
  apiBaseUrl: string;
  apiTimeout: number;
  env: Environment;
  enableMock: boolean;
  enableDebug: boolean;
  logLevel: LogLevel;
  isDevelopment: boolean;
  isTest: boolean;
  isStaging: boolean;
  isProduction: boolean;
}
```

## 使用示例

### Axios 配置示例

```typescript
import axios from 'axios';
import envConfig from '@/config';

const apiClient = axios.create({
  baseURL: envConfig.apiBaseUrl,
  timeout: envConfig.apiTimeout,
});

if (envConfig.enableDebug) {
  apiClient.interceptors.request.use((config) => {
    console.log('Request:', config);
    return config;
  });
}
```

### 条件渲染示例

```typescript
import envConfig from '@/config';

function App() {
  return (
    <div>
      <h1>{envConfig.appTitle}</h1>
      {envConfig.enableDebug && (
        <div>
          当前环境: {envConfig.env}
          版本: {envConfig.appVersion}
        </div>
      )}
    </div>
  );
}
```

### 日志封装示例

```typescript
import envConfig from '@/config';

const logLevels = ['debug', 'info', 'warn', 'error'];

class Logger {
  private shouldLog(level: string): boolean {
    const currentLevel = logLevels.indexOf(envConfig.logLevel);
    const messageLevel = logLevels.indexOf(level);
    return messageLevel >= currentLevel;
  }

  debug(...args: unknown[]) {
    if (this.shouldLog('debug')) {
      console.log('[DEBUG]', ...args);
    }
  }

  info(...args: unknown[]) {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: unknown[]) {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]) {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  }
}

export default new Logger();
```

## 本地开发配置

### 创建本地配置文件

```bash
cp .env.local.example .env.local
```

### 编辑本地配置

在 `.env.local` 中覆盖需要的配置：

```bash
VITE_API_BASE_URL=http://192.168.1.100:3000/api
VITE_ENABLE_MOCK=false
```

## 安全注意事项

- 不要在环境变量中存放敏感信息（如密钥、密码等）
- `.env.local` 和 `.env.*.local` 已添加到 `.gitignore`，不会被提交
- 生产环境的敏感配置应该通过 CI/CD 系统注入
- 所有以 `VITE_` 开头的变量都会暴露到客户端代码中

## 环境变量加载顺序示例

假设执行 `npm run dev`（development 模式）：

1. 加载 `.env`
2. 加载 `.env.local`（如果存在）
3. 加载 `.env.development`
4. 加载 `.env.development.local`（如果存在）

后加载的文件会覆盖之前的同名变量。

## TypeScript 支持

环境变量类型定义在 `src/vite-env.d.ts` 中：

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  // ...
}
```

修改环境变量时记得同步更新类型定义。

## 故障排查

### 环境变量未生效

1. 确认变量名以 `VITE_` 开头
2. 重启开发服务器（环境变量修改后需要重启）
3. 检查配置文件加载顺序
4. 使用 `console.log(import.meta.env)` 查看所有可用变量

### 构建环境不正确

确保使用正确的构建命令：

```bash
npm run build:test      # 测试环境
npm run build:staging   # 预发布环境
npm run build           # 生产环境
```

## 参考资料

- [Vite 环境变量文档](https://vitejs.dev/guide/env-and-mode.html)
- 项目配置模块: `src/config/env.ts`
