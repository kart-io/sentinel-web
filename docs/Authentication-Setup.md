# 登录认证功能实施总结

## 概述

已完成登录认证和路由守卫功能，实现了完整的用户认证流程。

## 新增文件

### 状态管理

- `src/store/authStore.ts` - 认证状态管理（基于 Zustand）

### 路由守卫

- `src/components/common/ProtectedRoute.tsx` - 受保护路由和公开路由组件

## 修改文件

### 路由配置

- `src/router/index.tsx` - 添加路由守卫，保护所有需要认证的页面

### 登录页面

- `src/features/auth/Login.tsx` - 集成认证状态管理，实现真实的登录流程

### 主布局

- `src/layouts/MainLayout.tsx` - 添加退出登录功能，显示用户信息

## 功能说明

### 认证状态管理

使用 Zustand 管理认证状态，支持数据持久化到 LocalStorage。

```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}
```

**存储的数据：**
- `token` - JWT 令牌
- `user` - 用户信息（id, username, email, avatar, role）
- `isAuthenticated` - 认证状态标识

**持久化：**
- 使用 `zustand/middleware` 的 `persist` 中间件
- 存储键名：`auth-storage`
- 刷新页面后自动恢复登录状态

### 路由守卫

#### ProtectedRoute（受保护路由）

- 检查用户是否已登录
- 未登录自动跳转到登录页
- 保存用户原本要访问的页面（登录后自动跳转回去）

#### PublicRoute（公开路由）

- 用于登录页等公开页面
- 已登录用户访问登录页时自动跳转到首页

### 登录流程

1. 用户访问需要认证的页面（如 `/dashboard`）
2. `ProtectedRoute` 检测未登录，重定向到 `/login`
3. 用户输入用户名和密码
4. 表单验证通过后，调用登录接口（当前为模拟）
5. 登录成功后，保存 token 和用户信息到 Store
6. 自动跳转到原本要访问的页面或默认首页

### 退出登录流程

1. 用户点击头像下拉菜单中的"退出登录"
2. 弹出确认对话框
3. 确认后清除认证状态
4. 跳转到登录页

## 使用说明

### 当前模拟登录

**测试账号：**
- 用户名：任意（建议使用 `admin`）
- 密码：任意

登录后会生成模拟的用户信息：
- ID: 固定为 1
- Email: `{username}@example.com`
- Avatar: 自动生成的头像
- Role: admin

### 集成真实 API

将来需要替换为真实 API 时，只需修改 `Login.tsx` 中的登录逻辑：

```typescript
// 当前模拟代码
const mockToken = 'mock-jwt-token-' + Date.now();
const mockUser = {
  id: '1',
  username: values.username,
  // ...
};

// 替换为真实 API
const response = await authApi.login(values);
const { token, user } = response.data;

login(token, user);
```

## 在其他组件中使用

### 获取认证状态

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return (
    <div>
      {isAuthenticated && <p>欢迎, {user?.username}</p>}
    </div>
  );
}
```

### 退出登录

```typescript
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>退出登录</button>;
}
```

### 更新用户信息

```typescript
import { useAuthStore } from '@/store/authStore';

function UpdateProfile() {
  const updateUser = useAuthStore((state) => state.updateUser);

  const handleUpdate = () => {
    updateUser({
      avatar: 'new-avatar-url',
      email: 'new-email@example.com',
    });
  };

  return <button onClick={handleUpdate}>更新资料</button>;
}
```

## 路由配置

### 公开路由（无需登录）

```typescript
{
  path: '/login',
  element: (
    <PublicRoute>
      <Login />
    </PublicRoute>
  ),
}
```

### 受保护路由（需要登录）

```typescript
{
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    // 子路由自动继承保护
  ]
}
```

## 安全注意事项

### Token 管理

- Token 存储在 LocalStorage 中
- 刷新页面不会丢失登录状态
- 生产环境建议添加 Token 过期检测
- 建议实现 Token 自动刷新机制

### XSS 防护

- Zustand persist 自动处理序列化/反序列化
- 避免在 LocalStorage 中存储敏感信息
- 使用 Content Security Policy (CSP)

### API 请求拦截

建议在 Axios 中添加请求拦截器，自动携带 Token：

```typescript
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: envConfig.apiBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 下一步建议

1. **实现注册功能**
   - 创建注册页面
   - 实现注册 API 调用
   - 添加表单验证

2. **忘记密码功能**
   - 密码重置流程
   - 邮箱验证

3. **Token 刷新机制**
   - 实现 Refresh Token
   - 自动刷新过期 Token

4. **权限管理**
   - 基于角色的访问控制（RBAC）
   - 页面级权限控制
   - 按钮级权限控制

5. **第三方登录**
   - OAuth 2.0 集成
   - 社交账号登录（GitHub, Google 等）

## 验证结果

- ✅ 未登录访问受保护页面自动跳转到登录页
- ✅ 登录成功后跳转到原本要访问的页面
- ✅ 已登录访问登录页自动跳转到首页
- ✅ 退出登录清除状态并跳转到登录页
- ✅ 刷新页面保持登录状态
- ✅ 用户信息正确显示在头部
- ✅ TypeScript 类型检查通过
- ✅ 构建成功

## 测试步骤

1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:5173`
3. 应该自动跳转到 `/login`
4. 输入任意用户名和密码登录
5. 登录成功后自动跳转到 `/dashboard`
6. 点击右上角用户头像 → 退出登录
7. 确认退出后跳转到登录页
8. 刷新页面验证未登录状态
