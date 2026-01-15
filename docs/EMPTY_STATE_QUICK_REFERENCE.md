# 空状态组件 - 快速参考

## 基本用法

### 1. 功能开发中
```tsx
import { UnderConstruction } from '@/components/common/UnderConstruction';

<UnderConstruction title="功能开发中" />
```

### 2. 数据为空
```tsx
import { PageContainer, EmptyContainer } from '@/components/common/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Database } from 'lucide-react';

<PageContainer>
  <EmptyContainer>
    <EmptyState
      title="暂无数据"
      description="还没有任何记录"
      icon={Database}
      actionText="创建"
      onAction={handleCreate}
    />
  </EmptyContainer>
</PageContainer>
```

### 3. 搜索无结果
```tsx
import { SearchX } from 'lucide-react';

<EmptyState
  title="未找到相关结果"
  description="请尝试其他关键词"
  icon={SearchX}
/>
```

## 组件列表

| 组件 | 用途 | 位置 |
|------|------|------|
| `EmptyState` | 空状态展示 | `@/components/ui/EmptyState` |
| `PageContainer` | 页面根容器 | `@/components/common/PageContainer` |
| `EmptyContainer` | 空状态容器 | `@/components/common/PageContainer` |
| `PageContent` | 内容容器 | `@/components/common/PageContainer` |
| `UnderConstruction` | 开发中页面 | `@/components/common/UnderConstruction` |

## 常用图标

```tsx
import {
  Database,        // 数据为空
  SearchX,         // 搜索无结果
  Construction,    // 功能开发中
  WifiOff,         // 网络错误
  Lock,            // 权限不足
  FileQuestion,    // 404
  FileX,           // 文件为空
  MessageSquareOff,// 消息为空
  ShoppingCart,    // 购物车为空
  BellOff,         // 通知为空
} from 'lucide-react';
```

## Props

```typescript
// EmptyState
{
  title: string;           // 必填
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actionText?: string;
  onAction?: () => void;
  action?: ReactNode;
}

// UnderConstruction
{
  title: string;           // 必填
  description?: string;
}
```

## 布局模式

### 完整页面
```tsx
<PageContainer>
  {hasData ? (
    <PageContent>
      <YourContent />
    </PageContent>
  ) : (
    <EmptyContainer>
      <EmptyState {...props} />
    </EmptyContainer>
  )}
</PageContainer>
```

### 仅空状态
```tsx
<EmptyContainer>
  <EmptyState {...props} />
</EmptyContainer>
```

## 主题变量

```css
var(--color-bg-container)      /* 背景色 */
var(--color-text-primary)      /* 主文字 */
var(--color-text-secondary)    /* 次要文字 */
var(--color-border-secondary)  /* 边框 */
```

## 特性

- ✅ 自动适配主题（亮色/暗色）
- ✅ 响应式布局
- ✅ 垂直居中对齐
- ✅ 最小高度 400px
- ✅ 统一的视觉风格

## 注意事项

1. 所有空状态都应使用 `EmptyContainer` 包装
2. 图标颜色使用 CSS 变量或语义化类名
3. 不要硬编码颜色值
4. 提供清晰的描述和操作按钮
