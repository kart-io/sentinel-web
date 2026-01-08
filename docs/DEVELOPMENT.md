# Sentinel-X Web 开发指南

本文档提供 Sentinel-X Web 项目的完整开发规范、最佳实践和工作流程指南。

---

## 📋 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [代码风格](#代码风格)
- [组件开发](#组件开发)
- [状态管理](#状态管理)
- [API 集成](#api-集成)
- [测试规范](#测试规范)
- [性能优化](#性能优化)
- [安全最佳实践](#安全最佳实践)
- [Git 工作流](#git-工作流)
- [常见问题](#常见问题)

---

## 技术栈

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | UI 框架 |
| TypeScript | 5.8.0 | 类型系统 |
| Vite | 7.3.0 | 构建工具 |
| React Router | 7.11.0 | 路由管理 |

### UI 组件库

| 库 | 版本 | 用途 |
|------|------|------|
| Ant Design | 6.1.4 | 企业级组件（表格、表单） |
| Material-UI | 7.3.6 | 现代化组件 |
| Tailwind CSS | 4.1.0 | 样式工具类 |
| Lucide React | 0.469.0 | 图标库 |

### 状态管理

| 库 | 版本 | 用途 |
|------|------|------|
| Zustand | 5.0.9 | 全局状态 |
| React Query | 5.90.16 | 服务器状态 |

### 工具库

| 库 | 版本 | 用途 |
|------|------|------|
| Axios | 1.13.2 | HTTP 客户端 |
| crypto-js | 4.2.0 | 加密工具 |
| Sentry | 8.x | 错误监控 |

---

## 项目结构

### 目录结构

```
sentinel-web/
├── src/
│   ├── api/                    # API 客户端
│   │   └── generated/         # 自动生成的 API 类型
│   ├── components/            # 共享组件
│   │   ├── common/           # 通用组件
│   │   └── layout/           # 布局组件
│   ├── features/             # 功能模块（按业务）
│   │   ├── auth/            # 认证模块
│   │   ├── rag/             # RAG 功能
│   │   ├── user-center/     # 用户中心
│   │   └── scheduler/       # 调度器
│   ├── hooks/                # 自定义 Hooks
│   ├── lib/                  # 第三方库配置
│   │   ├── axios.ts         # Axios 配置
│   │   └── sentry.ts        # Sentry 配置
│   ├── store/                # Zustand Store
│   │   └── authStore.ts     # 认证状态
│   ├── utils/                # 工具函数
│   │   ├── crypto.ts        # 加密工具
│   │   ├── secureStorage.ts # 安全存储
│   │   └── errorHandler.ts  # 错误处理
│   ├── styles/               # 样式文件
│   │   └── constants.ts     # 样式常量
│   ├── types/                # TypeScript 类型
│   ├── config/               # 配置文件
│   │   └── env.ts           # 环境配置
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 入口文件
│   └── index.css             # 全局样式
├── public/                    # 静态资源
├── docs/                      # 文档
├── .env.*                     # 环境配置
├── vite.config.ts            # Vite 配置
├── tailwind.config.js        # Tailwind 配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 项目依赖
```

### 模块组织原则

#### 1. 功能模块化（Feature-based）

按业务功能组织代码，而非技术层次：

```
✅ 推荐（按功能）:
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
└── rag/
    ├── components/
    ├── hooks/
    └── services/

❌ 不推荐（按技术）:
src/
├── components/
│   ├── AuthForm/
│   └── RAGChat/
├── hooks/
│   ├── useAuth.ts
│   └── useRAG.ts
└── services/
    ├── authService.ts
    └── ragService.ts
```

#### 2. 共享组件独立

通用组件放在 `components/common/`:

```typescript
// components/common/Button.tsx
export const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

// features/auth/components/LoginButton.tsx
import { Button } from '@/components/common/Button';
```

---

## 开发规范

### 命名规范

#### 文件命名

- **组件文件**: PascalCase
  ```
  ✅ LoginForm.tsx
  ✅ UserProfile.tsx
  ❌ loginForm.tsx
  ❌ user-profile.tsx
  ```

- **工具函数**: camelCase
  ```
  ✅ formatDate.ts
  ✅ validateEmail.ts
  ❌ FormatDate.ts
  ```

- **类型文件**: PascalCase
  ```
  ✅ UserTypes.ts
  ✅ ApiResponse.ts
  ```

- **常量文件**: camelCase 或 UPPER_CASE
  ```
  ✅ constants.ts
  ✅ API_ENDPOINTS.ts
  ```

#### 变量命名

```typescript
// ✅ 推荐
const userName = 'John';
const isLoading = false;
const handleClick = () => {};

// 组件命名
const UserProfile = () => {};
const LoginButton = () => {};

// 常量命名
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 类型命名
interface User {
  id: string;
  name: string;
}

type UserRole = 'admin' | 'user';
```

---

## 代码风格

### TypeScript 规范

#### 1. 类型优先

```typescript
// ✅ 使用 interface 定义对象类型
interface User {
  id: string;
  name: string;
  email?: string;
}

// ✅ 使用 type 定义联合类型
type Status = 'pending' | 'success' | 'error';

// ✅ 明确函数返回类型
function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

// ❌ 避免使用 any
const data: any = {};  // 不推荐

// ✅ 使用 unknown 或具体类型
const data: unknown = {};
const user: User = {};
```

#### 2. 类型导入

```typescript
// ✅ 使用 type 关键字导入类型
import { type User, type Product } from './types';
import { useState } from 'react';

// ❌ 避免混合导入
import { User, Product, useState } from './mixed';
```

#### 3. 泛型使用

```typescript
// ✅ 使用泛型提高复用性
function fetchData<T>(url: string): Promise<T> {
  return api.get<T>(url);
}

// 使用
const user = await fetchData<User>('/users/1');
const products = await fetchData<Product[]>('/products');
```

### React 规范

#### 1. 函数组件 + Hooks

```typescript
// ✅ 推荐：函数组件
import { type FC, useState } from 'react';

interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const LoginForm: FC<Props> = ({ title, onSubmit }) => {
  const [email, setEmail] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>
      {/* ... */}
    </form>
  );
};

// ❌ 不推荐：类组件
class LoginForm extends React.Component {
  // ...
}
```

#### 2. Props 类型定义

```typescript
// ✅ 推荐：独立定义 Props 接口
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  label,
  variant = 'primary',
  disabled = false,
  onClick
}) => {
  return <button onClick={onClick}>{label}</button>;
};

// ❌ 不推荐：内联 Props
export const Button = ({ label }: { label: string }) => {};
```

#### 3. Hooks 规则

```typescript
// ✅ 自定义 Hook 以 use 开头
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);

  return user;
}

// ✅ 依赖数组完整
useEffect(() => {
  fetchData(userId);
}, [userId]); // 包含所有依赖

// ❌ 缺少依赖
useEffect(() => {
  fetchData(userId);
}, []); // ESLint 会警告
```

### ESLint 配置

项目使用严格的 ESLint 规则：

```json
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

运行检查：

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint -- --fix
```

---

## 组件开发

### 组件分类

#### 1. 展示组件（Presentational）

纯 UI 组件，不包含业务逻辑：

```typescript
// components/common/Card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
};
```

#### 2. 容器组件（Container）

包含业务逻辑和状态管理：

```typescript
// features/user/components/UserProfileContainer.tsx
export const UserProfileContainer = () => {
  const { user, loading } = useUser();
  const { updateProfile } = useUserActions();

  if (loading) return <Spinner />;
  if (!user) return <ErrorMessage />;

  return <UserProfile user={user} onUpdate={updateProfile} />;
};
```

### 组件最佳实践

#### 1. 单一职责

```typescript
// ✅ 职责清晰
const UserAvatar = ({ src, alt }) => <img src={src} alt={alt} />;
const UserName = ({ name }) => <span>{name}</span>;

// ❌ 职责混乱
const UserInfo = ({ user, onUpdate, onDelete }) => {
  // 太多职责：展示、更新、删除
};
```

#### 2. Props 解构

```typescript
// ✅ 推荐：解构 Props
export const Button: FC<ButtonProps> = ({
  label,
  variant = 'primary',
  onClick
}) => {
  return <button onClick={onClick}>{label}</button>;
};

// ❌ 不推荐：直接使用 props
export const Button: FC<ButtonProps> = (props) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

#### 3. 条件渲染

```typescript
// ✅ 推荐：提前返回
if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <DataList data={data} />;

// ❌ 不推荐：嵌套三元
return (
  <div>
    {loading ? (
      <Spinner />
    ) : error ? (
      <ErrorMessage />
    ) : data ? (
      <DataList data={data} />
    ) : (
      <EmptyState />
    )}
  </div>
);
```

#### 4. 事件处理

```typescript
// ✅ 使用 useCallback 避免重复创建
const handleSubmit = useCallback((e: FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
}, [formData, onSubmit]);

// ✅ 事件命名以 handle 开头
const handleClick = () => {};
const handleChange = () => {};
const handleKeyDown = () => {};
```

---

## 状态管理

### Zustand Store

用于全局状态（认证、主题等）：

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { createZustandSecureStorage } from '@/utils/secureStorage';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createZustandSecureStorage() as StateStorage),
    }
  )
);

// 使用
const { user, login, logout } = useAuthStore();
```

### React Query

用于服务器状态（数据获取、缓存）：

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => api.put('/users', data),
    onSuccess: () => {
      // 刷新用户列表
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// 使用
const { data: users, loading } = useUsers();
const { mutate: updateUser } = useUpdateUser();
```

---

## API 集成

### Axios 配置

```typescript
// lib/axios.ts
import axios from 'axios';
import { getEnvConfig } from '@/config/env';
import { useAuthStore } from '@/store/authStore';

const config = getEnvConfig();

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加 Token
apiClient.interceptors.request.use((requestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && requestConfig.headers) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// 响应拦截器：错误处理
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API 服务

```typescript
// services/userService.ts
import { apiClient } from '@/lib/axios';

export const userService = {
  async getUsers(): Promise<User[]> {
    return apiClient.get('/users');
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get(`/users/${id}`);
  },

  async createUser(data: CreateUserData): Promise<User> {
    return apiClient.post('/users', data);
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return apiClient.put(`/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },
};
```

---

## 性能优化

### 1. 代码分割

```typescript
// ✅ 路由级别懒加载
import { lazy, Suspense } from 'react';

const RAGPage = lazy(() => import('@/features/rag/RAGPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/rag" element={<RAGPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. 使用 memo

```typescript
// ✅ 避免不必要的重渲染
import { memo } from 'react';

export const UserCard = memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>;
});
```

### 3. useCallback 和 useMemo

```typescript
// ✅ 缓存回调函数
const handleClick = useCallback(() => {
  onClick(id);
}, [id, onClick]);

// ✅ 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 4. 虚拟列表

对于长列表，使用虚拟滚动：

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

---

## 安全最佳实践

### 1. XSS 防护

```typescript
// ✅ React 自动转义
<div>{userInput}</div>

// ❌ 危险的 HTML 注入
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 必须使用时，先清理
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### 2. Token 安全

```typescript
// ✅ 使用加密存储
import { secureStorage } from '@/utils/secureStorage';

// 存储 Token（自动加密）
secureStorage.setItem('auth-token', token);

// ❌ 不要明文存储
localStorage.setItem('token', token);
```

### 3. 敏感信息

```typescript
// ✅ 环境变量
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ 硬编码
const apiKey = 'sk-1234567890abcdef';
```

---

## Git 工作流

### 分支命名

```bash
# 功能分支
feat/user-profile
feat/rag-chat

# 修复分支
fix/login-bug
fix/memory-leak

# 文档分支
docs/update-readme
docs/api-integration
```

### 提交规范（Conventional Commits）

```bash
# 格式
<type>(<scope>): <subject>

# 类型
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
test:     测试相关
chore:    构建/工具配置

# 示例
feat(auth): 实现 Token 加密存储
fix(rag): 修复文档上传失败问题
docs(readme): 更新环境配置说明
refactor(api): 重构 API 请求拦截器
```

### 工作流程

```bash
# 1. 创建功能分支
git checkout -b feat/user-profile

# 2. 开发并提交
git add .
git commit -m "feat(user): 添加用户资料编辑功能"

# 3. 推送到远程
git push origin feat/user-profile

# 4. 创建 Pull Request
# 在 GitHub 上创建 PR，等待 Code Review

# 5. 合并到主分支
# Review 通过后，合并 PR
```

---

## 常见问题

### Q1: 如何调试组件？

```typescript
// 使用 React DevTools
// 或在组件中添加日志
useEffect(() => {
  console.log('Component mounted', props);
}, []);
```

### Q2: 如何处理全局错误？

使用 ErrorBoundary：

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Q3: 如何优化打包体积？

1. 使用代码分割
2. 按需导入组件库
3. 分析 bundle: `npm run build -- --analyze`

---

## 相关文档

- [环境配置](./ENVIRONMENT.md)
- [Sentry 集成](./SENTRY.md)
- [加密存储](./ENCRYPTED_STORAGE.md)

---

**Happy Coding! 🎉**
