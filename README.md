# Sentinel Web

Sentinel-X 项目的前端应用程序,基于 React + TypeScript + Vite 构建的现代化企业级 Web 应用。

## 技术栈

### 核心框架

- **React 18+** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具

### UI 组件库

- **Ant Design 5** - 企业级 UI 组件库,用于复杂的管理表格、表单和后台布局
- **Tailwind CSS** - 实用优先的 CSS 框架,用于高度定制化的响应式组件
- **Lucide React** - 简洁美观的图标库

### 状态管理

- **Zustand** - 轻量级全局状态管理(用于会话、主题、当前聊天上下文)
- **TanStack Query (React Query)** - 异步服务器状态管理、缓存和自动重新获取

### 路由和网络

- **React Router v6+** - 客户端路由
- **Axios** - HTTP 客户端,包含 JWT Bearer Token 拦截器

## 快速开始

### 环境要求

- Node.js >= 22.12.0 或 20.19.0
- npm >= 10.0.0

### 安装依赖

```bash
cd sentinel-web
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```text
sentinel-web/
├── src/
│   ├── api/              # 自动生成的 API 客户端
│   ├── components/       # 共享 UI 组件
│   ├── features/         # 功能模块
│   │   ├── auth/        # 认证模块
│   │   ├── user-center/ # 用户中心模块
│   │   ├── rag/         # RAG 模块
│   │   └── scheduler/   # 调度器模块
│   ├── layouts/          # 布局组件
│   │   ├── MainLayout   # 主布局
│   │   └── AuthLayout   # 认证布局
│   ├── hooks/            # 自定义 React Hooks
│   ├── stores/           # Zustand 状态存储
│   ├── utils/            # 工具函数
│   │   ├── request.ts   # Axios 请求封装
│   │   └── storage.ts   # 本地存储封装
│   ├── types/            # TypeScript 类型定义
│   ├── App.tsx           # 根组件
│   └── main.tsx          # 应用入口
├── scripts/
│   └── gen-api.js        # API 客户端生成脚本
├── public/               # 静态资源
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind CSS 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖
```

## 文档

- [架构设计](./docs/architecture.md) - 应用架构和设计原则
- [开发指南](./docs/development.md) - 开发规范和最佳实践
- [API 集成](./docs/api-integration.md) - 后端 API 集成说明

## 功能模块

### 认证模块 (Auth)

- 用户登录/注册
- JWT Token 管理
- 权限验证

### 用户中心 (User Center)

- 用户信息管理
- RBAC 权限管理
- 组织架构管理

### RAG 模块

- AI 聊天/对话界面
- 知识库管理
- 文档上传和处理

### 调度器 (Scheduler)

- 任务调度管理
- 任务执行监控
- 调度规则配置

## 开发规范

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 React Hooks 规则
- 组件采用函数式组件 + Hooks

### Git 提交规范

遵循 Conventional Commits 规范:

```text
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具配置
```

## 后端集成

本项目与 [sentinel-x](https://github.com/kart-io/sentinel-x) 后端项目集成。

OpenAPI 规范文件位于后端项目的 `api/openapi/pkg/api/` 目录。

使用 `scripts/gen-api.js` 脚本自动生成类型化的 API 客户端。

## Tool

- playwright-mcp

## 许可证

请参考后端项目 [sentinel-x](https://github.com/kart-io/sentinel-x) 的许可证。
