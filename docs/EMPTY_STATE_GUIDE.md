# 页面空状态统一处理指南

## 概述

为了确保应用中所有页面的空状态显示一致，我们创建了一套统一的组件来处理空状态展示。空状态会自动显示在页面底部居中位置，并支持主题切换。

## 核心组件

### 1. EmptyState（空状态组件）

位置：`src/components/ui/EmptyState.tsx`

**功能**：
- 显示友好的空状态提示
- 支持自定义图标、标题、描述
- 支持操作按钮
- 自动适配亮色/暗色主题
- 居中显示，最小高度 400px

**Props**：
```typescript
interface EmptyStateProps {
  title: string;              // 标题（必填）
  description?: string;        // 描述文本
  icon?: LucideIcon;          // 图标组件
  iconColor?: string;         // 图标颜色类名
  actionText?: string;        // 操作按钮文本
  onAction?: () => void;      // 操作按钮回调
  action?: ReactNode;         // 自定义操作按钮
  image?: string;             // 自定义图片
  centered?: boolean;         // 是否居中（默认 true）
  className?: string;         // 自定义类名
  style?: CSSProperties;      // 自定义样式
  extra?: ReactNode;          // 额外内容
}
```

### 2. PageContainer（页面容器）

位置：`src/components/common/PageContainer.tsx`

**功能**：
- 确保页面内容至少占满可视高度
- 提供统一的布局结构
- 支持 Flexbox 布局

**使用场景**：包装所有页面的根元素

### 3. EmptyContainer（空状态容器）

位置：`src/components/common/PageContainer.tsx`

**功能**：
- 专门用于包装空状态内容
- 自动居中对齐（垂直和水平）
- 确保空状态显示在页面底部

### 4. PageContent（页面内容容器）

位置：`src/components/common/PageContainer.tsx`

**功能**：
- 包装实际的页面内容（非空状态）
- 提供统一的内边距
- 自动占据剩余空间

## 使用场景

### 场景 1：功能开发中页面（UnderConstruction）

```tsx
import { UnderConstruction } from '@/components/common/UnderConstruction';

export default function MyPage() {
  return (
    <UnderConstruction
      title="功能开发中"
      description="该功能正在开发中，敬请期待..."
    />
  );
}
```

**效果**：
- ✅ 显示施工图标
- ✅ 居中显示在页面底部
- ✅ 提供"返回首页"按钮
- ✅ 自动适配主题

### 场景 2：数据为空的列表页

```tsx
import { PageContainer, EmptyContainer, PageContent } from '@/components/common/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Database } from 'lucide-react';

export default function DataListPage() {
  const [data, setData] = useState([]);

  if (data.length === 0) {
    return (
      <PageContainer>
        <EmptyContainer>
          <EmptyState
            title="暂无数据"
            description="还没有任何记录，点击下方按钮创建第一条数据"
            icon={Database}
            actionText="创建数据"
            onAction={() => console.log('创建')}
          />
        </EmptyContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageContent>
        {/* 实际的数据列表 */}
        <DataTable data={data} />
      </PageContent>
    </PageContainer>
  );
}
```

### 场景 3：搜索无结果

```tsx
import { EmptyState } from '@/components/ui/EmptyState';
import { EmptyContainer } from '@/components/common/PageContainer';
import { SearchX } from 'lucide-react';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  if (searchTerm && results.length === 0) {
    return (
      <EmptyContainer>
        <EmptyState
          title="未找到相关结果"
          description={`没有找到与 "${searchTerm}" 相关的内容，请尝试其他关键词`}
          icon={SearchX}
          actionText="清空搜索"
          onAction={() => setSearchTerm('')}
        />
      </EmptyContainer>
    );
  }

  return (
    <div>
      {/* 搜索结果 */}
    </div>
  );
}
```

### 场景 4：网络错误

```tsx
import { EmptyState } from '@/components/ui/EmptyState';
import { EmptyContainer } from '@/components/common/PageContainer';
import { WifiOff } from 'lucide-react';

export default function ErrorPage() {
  const handleRetry = () => {
    // 重试逻辑
  };

  return (
    <EmptyContainer>
      <EmptyState
        title="网络连接失败"
        description="无法连接到服务器，请检查您的网络设置"
        icon={WifiOff}
        iconColor="text-red-500"
        actionText="重试"
        onAction={handleRetry}
      />
    </EmptyContainer>
  );
}
```

### 场景 5：权限不足

```tsx
import { EmptyState } from '@/components/ui/EmptyState';
import { EmptyContainer } from '@/components/common/PageContainer';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <EmptyContainer>
      <EmptyState
        title="权限不足"
        description="您没有访问此页面的权限，请联系管理员"
        icon={Lock}
        iconColor="text-yellow-500"
        actionText="返回首页"
        onAction={() => navigate('/dashboard')}
      />
    </EmptyContainer>
  );
}
```

## 统一布局模式

### 完整页面结构

```tsx
import { PageContainer, EmptyContainer, PageContent } from '@/components/common/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MyPage() {
  const [hasContent, setHasContent] = useState(false);

  return (
    <PageContainer>
      {hasContent ? (
        <PageContent>
          {/* 实际内容 */}
          <YourContent />
        </PageContent>
      ) : (
        <EmptyContainer>
          <EmptyState
            title="暂无内容"
            description="这里还没有任何内容"
            icon={YourIcon}
          />
        </EmptyContainer>
      )}
    </PageContainer>
  );
}
```

## 主题支持

所有空状态组件都自动支持亮色/暗色主题：

### 自动适配的样式
- 背景色：`var(--color-bg-container)`
- 主要文字：`var(--color-text-primary)`
- 次要文字：`var(--color-text-secondary)`
- 边框：`var(--color-border-secondary)`

### 自定义图标颜色
```tsx
<EmptyState
  icon={Database}
  iconColor="text-primary"      // 使用主题色
  // 或
  iconColor="text-red-500"      // 使用固定颜色
  // 或
  iconColor="text-muted-foreground"  // 使用语义化颜色
/>
```

## 常用图标推荐

从 `lucide-react` 导入：

| 场景 | 推荐图标 | 导入 |
|------|---------|------|
| 数据为空 | `Database` | `import { Database } from 'lucide-react'` |
| 搜索无结果 | `SearchX` | `import { SearchX } from 'lucide-react'` |
| 功能开发中 | `Construction` | `import { Construction } from 'lucide-react'` |
| 网络错误 | `WifiOff` | `import { WifiOff } from 'lucide-react'` |
| 权限不足 | `Lock` | `import { Lock } from 'lucide-react'` |
| 404 未找到 | `FileQuestion` | `import { FileQuestion } from 'lucide-react'` |
| 文件为空 | `FileX` | `import { FileX } from 'lucide-react'` |
| 消息为空 | `MessageSquareOff` | `import { MessageSquareOff } from 'lucide-react'` |
| 购物车为空 | `ShoppingCart` | `import { ShoppingCart } from 'lucide-react'` |
| 通知为空 | `BellOff` | `import { BellOff } from 'lucide-react'` |

## 最佳实践

### ✅ 推荐做法

1. **统一使用容器组件**
   ```tsx
   <PageContainer>
     <EmptyContainer>
       <EmptyState {...props} />
     </EmptyContainer>
   </PageContainer>
   ```

2. **提供清晰的描述**
   ```tsx
   <EmptyState
     title="暂无数据"
     description="还没有任何记录，点击下方按钮创建第一条数据"
   />
   ```

3. **提供操作按钮**
   ```tsx
   <EmptyState
     title="购物车为空"
     description="快去挑选商品吧"
     actionText="去购物"
     onAction={goToShop}
   />
   ```

### ❌ 避免的做法

1. **不要硬编码颜色**
   ```tsx
   // ❌ 错误
   <div style={{ backgroundColor: '#fff' }}>

   // ✅ 正确
   <div style={{ backgroundColor: 'var(--color-bg-container)' }}>
   ```

2. **不要使用固定高度**
   ```tsx
   // ❌ 错误
   <div style={{ height: '500px' }}>

   // ✅ 正确 - 使用 minHeight 和 flex
   <EmptyContainer>
   ```

3. **不要省略容器组件**
   ```tsx
   // ❌ 错误 - 空状态可能不在底部
   <EmptyState {...props} />

   // ✅ 正确
   <EmptyContainer>
     <EmptyState {...props} />
   </EmptyContainer>
   ```

## 迁移指南

### 更新现有页面

1. **找到空状态渲染逻辑**
2. **包装 PageContainer**
3. **使用 EmptyContainer + EmptyState**

**迁移前**：
```tsx
export default function OldPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>暂无数据</h1>
        <p>还没有任何内容</p>
      </div>
    </div>
  );
}
```

**迁移后**：
```tsx
import { PageContainer, EmptyContainer } from '@/components/common/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Database } from 'lucide-react';

export default function NewPage() {
  return (
    <PageContainer>
      <EmptyContainer>
        <EmptyState
          title="暂无数据"
          description="还没有任何内容"
          icon={Database}
        />
      </EmptyContainer>
    </PageContainer>
  );
}
```

## 响应式设计

所有空状态组件都支持响应式布局：

- **桌面端**：大图标（64px），宽松间距
- **移动端**：自动适配，保持可读性
- **最小高度**：400px，确保视觉平衡

## CSS 变量

可以通过 CSS 变量自定义空状态样式：

```css
:root {
  --color-bg-container: #ffffff;
  --color-text-primary: rgba(0, 0, 0, 0.88);
  --color-text-secondary: rgba(0, 0, 0, 0.65);
  --color-border-secondary: #f0f0f0;
}

.dark {
  --color-bg-container: #141414;
  --color-text-primary: rgba(255, 255, 255, 0.85);
  --color-text-secondary: rgba(255, 255, 255, 0.65);
  --color-border-secondary: #303030;
}
```

## 总结

通过使用这套统一的空状态组件体系，我们可以：

- ✅ **一致性**：所有页面的空状态展示风格统一
- ✅ **易维护**：集中管理空状态样式和行为
- ✅ **主题支持**：自动适配亮色/暗色主题
- ✅ **响应式**：自动适配不同屏幕尺寸
- ✅ **易用性**：简单的 API，开发者友好
- ✅ **可扩展**：支持自定义图标、操作按钮等

所有新页面都应该使用这套组件来处理空状态！
