# Material UI Table 组件

## 概述

本次为项目添加了两个基于 Material UI 的表格组件：

- **DataTable**: 功能完整的数据表格组件
- **SimpleTable**: 简化版表格组件

## 新增文件

### 组件文件

- `src/components/ui/DataTable.tsx` - 表格组件实现
- `src/components/ui/index.ts` - 组件导出入口

### 示例文件

- `src/features/mui-demo/MUIComponents.tsx` - 更新了示例页面，添加了表格使用示例

### 文档文件

- `docs/DataTable-Usage.md` - 详细的使用文档

## 配置更新

### vite.config.ts

添加了路径别名配置：

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### tsconfig.app.json

添加了 TypeScript 路径映射：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 组件特性

### DataTable

- 多选功能（复选框）
- 列排序功能
- 分页功能（可自定义每页数量）
- 固定表头
- 自定义列格式化
- 工具栏（显示选中数量和操作按钮）
- 行点击事件
- 选择变化回调

### SimpleTable

- 基础数据展示
- 固定表头支持
- 自定义列格式化
- 轻量级实现

## 快速开始

```typescript
import { DataTable, type Column } from '@/components/ui';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { id: 'name', label: '姓名' },
  { id: 'email', label: '邮箱' },
];

const data: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
];

<DataTable
  columns={columns}
  rows={data}
  title="用户列表"
  selectable
  sortable
/>
```

## 查看示例

运行开发服务器：

```bash
npm run dev
```

访问示例页面查看表格组件的实际效果。

## 详细文档

查看 `docs/DataTable-Usage.md` 获取完整的 API 文档和使用示例。
