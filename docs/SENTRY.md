# Sentry 性能监控和错误追踪集成指南

本项目已集成 Sentry 进行错误追踪和性能监控。本文档提供了配置和使用说明。

## 目录

- [快速开始](#快速开始)
- [配置 Sentry](#配置-sentry)
- [错误追踪](#错误追踪)
- [性能监控](#性能监控)
- [用户反馈](#用户反馈)
- [最佳实践](#最佳实践)

---

## 快速开始

### 1. 创建 Sentry 项目

1. 访问 [Sentry.io](https://sentry.io/)
2. 注册/登录账号
3. 创建新项目，选择 **React** 平台
4. 复制项目的 **DSN** (Data Source Name)

### 2. 配置环境变量

将 DSN 添加到环境变量文件：

```bash
# .env.local 或 .env.production
VITE_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
VITE_SENTRY_ENABLED=true
```

### 3. 启动应用

```bash
npm run dev
```

Sentry 将自动初始化并开始收集错误和性能数据。

---

## 配置 Sentry

### 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_SENTRY_DSN` | Sentry 项目的 DSN | `https://xxx@xxx.ingest.sentry.io/xxx` |
| `VITE_SENTRY_ENABLED` | 是否启用 Sentry | `true` / `false` |

### 采样率配置

在 `src/lib/sentry.ts` 中可以调整采样率：

```typescript
// 性能追踪采样率
tracesSampleRate: config.isProduction ? 0.1 : 1.0,  // 生产环境 10%，开发环境 100%

// Session Replay 采样率
replaysSessionSampleRate: config.isProduction ? 0.1 : 0.5,
replaysOnErrorSampleRate: 1.0,  // 发生错误时 100% 记录
```

---

## 错误追踪

### 自动错误捕获

React 组件中的错误会被自动捕获：

```tsx
function MyComponent() {
  // 这个错误会自动上报到 Sentry
  throw new Error('Something went wrong!');
}
```

### 手动捕获错误

使用错误处理工具函数：

```typescript
import { handleError, handleApiError, ErrorType, ErrorLevel } from '@/utils/errorHandler';

try {
  // 业务逻辑
  await someApiCall();
} catch (error) {
  // 方式 1：使用通用错误处理
  handleError(error, {
    type: ErrorType.API,
    level: ErrorLevel.ERROR,
    action: 'fetchUserData',
    component: 'UserProfile',
  });

  // 方式 2：使用专门的 API 错误处理
  handleApiError(error, 'fetchUserData');
}
```

### 直接使用 Sentry API

```typescript
import { captureException, captureMessage } from '@/lib/sentry';

// 捕获异常
try {
  // ...
} catch (error) {
  captureException(error, {
    extra: { userId: '123', action: 'checkout' }
  });
}

// 捕获消息
captureMessage('User checkout completed', 'info');
```

### 添加面包屑（Breadcrumbs）

面包屑帮助追踪用户操作路径：

```typescript
import { addBreadcrumb } from '@/lib/sentry';

addBreadcrumb({
  message: 'User clicked submit button',
  category: 'user-action',
  level: 'info',
  data: {
    formId: 'checkout-form',
    timestamp: Date.now(),
  },
});
```

---

## 性能监控

### 自动性能监控

页面导航和 API 请求会自动被监控：

- **页面加载时间**
- **路由切换时间**
- **API 请求时间**

### 自定义性能追踪

使用性能监控包装器：

```typescript
import { withPerformanceMonitoring } from '@/utils/errorHandler';

// 包装函数
const fetchData = withPerformanceMonitoring(
  async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  'fetchUserData'
);

// 使用
await fetchData('123');
```

### 手动创建事务

```typescript
import { startTransaction } from '@/lib/sentry';

const transaction = startTransaction('processCheckout', 'task');

try {
  // 业务逻辑
  await processPayment();
  await updateInventory();

  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

### 性能指标示例

监控数据加载性能：

```typescript
import { addBreadcrumb } from '@/lib/sentry';

const startTime = performance.now();

try {
  const data = await ragService.getKnowledgeBases();
  const duration = performance.now() - startTime;

  addBreadcrumb({
    message: 'Knowledge bases loaded',
    category: 'performance',
    level: 'info',
    data: {
      duration: `${duration.toFixed(2)}ms`,
      count: data.length,
    },
  });
} catch (error) {
  handleError(error);
}
```

---

## 用户反馈

### 手动触发反馈对话框

```typescript
import * as Sentry from '@sentry/react';

Sentry.showReportDialog({
  eventId: 'error-event-id',  // 从错误事件中获取
  lang: 'zh-CN',
  title: '发生了一个错误',
});
```

### 在 ErrorBoundary 中触发

错误边界组件已集成用户反馈功能，用户可以在错误页面点击"反馈问题"按钮。

---

## 最佳实践

### 1. 设置用户上下文

在用户登录后设置用户信息：

```typescript
import { setSentryUser, clearSentryUser } from '@/lib/sentry';

// 登录时
const handleLogin = (user) => {
  setSentryUser({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};

// 登出时
const handleLogout = () => {
  clearSentryUser();
};
```

### 2. 添加标签和上下文

```typescript
import { setTag, setContext } from '@/lib/sentry';

// 添加标签
setTag('page', 'checkout');
setTag('environment', 'production');

// 添加上下文
setContext('checkout', {
  cartValue: 299.99,
  itemCount: 3,
  couponCode: 'SUMMER2024',
});
```

### 3. 过滤敏感信息

在 `src/lib/sentry.ts` 的 `beforeSend` 中过滤敏感数据：

```typescript
beforeSend(event, hint) {
  // 移除敏感请求头
  if (event.request?.headers) {
    delete event.request.headers['Authorization'];
    delete event.request.headers['Cookie'];
  }

  // 过滤 URL 中的敏感参数
  if (event.request?.url) {
    event.request.url = event.request.url.replace(/token=[^&]+/, 'token=[FILTERED]');
  }

  return event;
}
```

### 4. 错误分组

使用 fingerprint 控制错误分组：

```typescript
Sentry.captureException(error, {
  fingerprint: ['database-error', 'connection-timeout'],
});
```

### 5. 性能预算

监控关键指标并设置阈值：

```typescript
const checkPerformance = (duration: number, operation: string) => {
  const threshold = 3000; // 3秒阈值

  if (duration > threshold) {
    captureMessage(`Slow operation: ${operation}`, {
      level: 'warning',
      extra: {
        duration,
        threshold,
      },
    });
  }
};
```

---

## 使用示例

### 示例 1：API 调用错误处理

```typescript
// src/services/ragService.ts
import { handleApiError } from '@/utils/errorHandler';
import { addBreadcrumb } from '@/lib/sentry';

async getKnowledgeBases(): Promise<KnowledgeBase[]> {
  addBreadcrumb({
    message: 'Fetching knowledge bases',
    category: 'api',
    level: 'info',
  });

  try {
    const data = await request.get<KnowledgeBase[]>('/rag/knowledge-bases');
    return data;
  } catch (error) {
    handleApiError(error, 'getKnowledgeBases');
    throw error;
  }
}
```

### 示例 2：表单提交监控

```typescript
// src/components/CheckoutForm.tsx
import { withPerformanceMonitoring } from '@/utils/errorHandler';
import { addBreadcrumb } from '@/lib/sentry';

const handleSubmit = withPerformanceMonitoring(
  async (formData) => {
    addBreadcrumb({
      message: 'Checkout form submitted',
      category: 'user-action',
      data: { itemCount: formData.items.length },
    });

    await processCheckout(formData);
  },
  'checkoutFormSubmit'
);
```

### 示例 3：组件加载监控

```typescript
// src/features/Dashboard.tsx
import { useEffect } from 'react';
import { addBreadcrumb } from '@/lib/sentry';

const Dashboard = () => {
  useEffect(() => {
    const startTime = performance.now();

    loadDashboardData().then(() => {
      const duration = performance.now() - startTime;

      addBreadcrumb({
        message: 'Dashboard loaded',
        category: 'navigation',
        level: 'info',
        data: { loadTime: `${duration.toFixed(2)}ms` },
      });
    });
  }, []);

  return <div>Dashboard Content</div>;
};
```

---

## 相关链接

- [Sentry React 文档](https://docs.sentry.io/platforms/javascript/guides/react/)
- [性能监控](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [错误追踪最佳实践](https://docs.sentry.io/platforms/javascript/best-practices/)

---

## 故障排查

### Sentry 未初始化

检查：
1. 环境变量是否正确配置
2. `VITE_SENTRY_ENABLED` 是否设置为 `true`
3. DSN 是否有效

### 错误未上报

检查：
1. 采样率是否太低
2. 错误是否被忽略（查看 `ignoreErrors` 配置）
3. 网络是否可以访问 Sentry 服务器

### 性能数据缺失

检查：
1. `tracesSampleRate` 是否设置正确
2. 是否启用了浏览器追踪集成

---

**注意**: 生产环境建议将采样率设置为 10%-30%，以平衡监控覆盖率和成本。
