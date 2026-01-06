# 多环境配置实施总结

## 概述

本次为项目添加了完整的多环境配置支持，包括开发、测试、预发布和生产环境。

## 新增文件

### 环境配置文件

- `.env` - 默认环境配置
- `.env.development` - 开发环境配置
- `.env.test` - 测试环境配置
- `.env.staging` - 预发布环境配置
- `.env.production` - 生产环境配置
- `.env.local.example` - 本地配置示例

### 配置管理模块

- `src/config/env.ts` - 环境配置管理模块
- `src/config/index.ts` - 配置导出入口
- `src/vite-env.d.ts` - 环境变量 TypeScript 类型定义

### 示例页面

- `src/features/env-demo/EnvDemo.tsx` - 环境配置展示页面

### 文档

- `docs/Environment-Configuration.md` - 详细的环境配置使用文档

## 配置更新

### package.json

添加了多环境的构建和开发脚本：

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "dev:test": "vite --mode test",
    "dev:staging": "vite --mode staging",
    "build": "tsc -b && vite build --mode production",
    "build:dev": "tsc -b && vite build --mode development",
    "build:test": "tsc -b && vite build --mode test",
    "build:staging": "tsc -b && vite build --mode staging",
    "preview": "vite preview",
    "preview:test": "vite preview --mode test",
    "preview:staging": "vite preview --mode staging"
  }
}
```

### .gitignore

添加了环境配置文件的忽略规则：

```bash
.env.local
.env.*.local
```

### 路由配置

添加了环境配置展示页面路由：

```typescript
{
  path: 'env-demo',
  element: <EnvDemo />,
}
```

## 支持的环境

### 开发环境（development）

- API URL: `http://localhost:3000/api`
- Mock 数据: 启用
- 调试模式: 启用
- 日志级别: debug

### 测试环境（test）

- API URL: `https://test-api.sentinel-x.com/api`
- Mock 数据: 禁用
- 调试模式: 启用
- 日志级别: info

### 预发布环境（staging）

- API URL: `https://staging-api.sentinel-x.com/api`
- Mock 数据: 禁用
- 调试模式: 禁用
- 日志级别: warn

### 生产环境（production）

- API URL: `https://api.sentinel-x.com/api`
- Mock 数据: 禁用
- 调试模式: 禁用
- 日志级别: error

## 环境变量说明

### 应用基本信息

- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_VERSION` - 应用版本

### API 配置

- `VITE_API_BASE_URL` - API 基础 URL
- `VITE_API_TIMEOUT` - API 超时时间（毫秒）

### 环境标识

- `VITE_APP_ENV` - 环境标识（development/test/staging/production）

### 调试配置

- `VITE_ENABLE_MOCK` - 是否启用 Mock 数据
- `VITE_ENABLE_DEBUG` - 是否启用调试模式
- `VITE_LOG_LEVEL` - 日志级别（debug/info/warn/error）

## 使用方式

### 在代码中使用

```typescript
import envConfig from '@/config';

// 访问配置
console.log(envConfig.apiBaseUrl);
console.log(envConfig.isDevelopment);
console.log(envConfig.isProduction);

// 条件渲染
if (envConfig.enableDebug) {
  console.log('Debug mode enabled');
}

// 环境判断
if (envConfig.isDevelopment) {
  // 开发环境特定逻辑
}
```

### 运行不同环境

```bash
# 开发环境
npm run dev

# 测试环境
npm run dev:test

# 预发布环境
npm run dev:staging

# 构建生产环境
npm run build

# 构建测试环境
npm run build:test
```

### 本地配置

创建本地配置文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 覆盖需要的配置。

## 配置模块 API

```typescript
interface EnvConfig {
  appTitle: string;           // 应用标题
  appVersion: string;         // 应用版本
  apiBaseUrl: string;         // API 基础 URL
  apiTimeout: number;         // API 超时时间
  env: Environment;           // 环境标识
  enableMock: boolean;        // 是否启用 Mock
  enableDebug: boolean;       // 是否启用调试
  logLevel: LogLevel;         // 日志级别
  isDevelopment: boolean;     // 是否开发环境
  isTest: boolean;            // 是否测试环境
  isStaging: boolean;         // 是否预发布环境
  isProduction: boolean;      // 是否生产环境
}
```

## 查看环境配置

启动开发服务器后，访问 `/env-demo` 路由可以查看当前环境的完整配置信息。

## 安全注意事项

- 所有 `VITE_` 开头的变量都会暴露到客户端
- 不要在环境变量中存放敏感信息（密钥、密码等）
- `.env.local` 和 `.env.*.local` 不会被提交到 Git
- 生产环境的敏感配置应通过 CI/CD 系统注入

## 验证结果

- ✅ TypeScript 类型检查通过
- ✅ 开发环境构建成功
- ✅ 测试环境构建成功
- ✅ 预发布环境构建成功
- ✅ 生产环境构建成功
- ✅ 环境配置模块正常工作
- ✅ 环境展示页面正常显示

## 下一步建议

1. 根据实际 API 地址更新各环境的 `VITE_API_BASE_URL`
2. 在 CI/CD 流程中配置环境变量注入
3. 实现基于环境的日志系统
4. 实现基于环境的 Mock 数据切换
5. 添加环境特定的错误处理和监控

## 参考文档

- 详细使用文档: `docs/Environment-Configuration.md`
- Vite 环境变量: https://vitejs.dev/guide/env-and-mode.html
