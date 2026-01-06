# Material UI DataTable 组件使用文档

## 简介

本项目提供了两个基于 Material UI 的表格组件：

- `DataTable`: 功能完整的数据表格，支持选择、排序、分页
- `SimpleTable`: 简化版表格，仅包含基本的显示功能

## 安装

组件依赖以下包（已在项目中安装）：

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## DataTable 组件

### 功能特性

- **多选支持**: 支持单行和全选操作
- **排序功能**: 点击列标题进行升序/降序排序
- **分页功能**: 可自定义每页显示数量
- **固定表头**: 支持滚动时固定表头
- **自定义格式化**: 支持自定义列数据格式化
- **工具栏**: 内置选择计数和操作按钮

### 基本用法

```typescript
import { DataTable, type Column } from '@/components/ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

const columns: Column<User>[] = [
  { id: 'name', label: '姓名', minWidth: 100 },
  { id: 'email', label: '邮箱', minWidth: 150 },
  { id: 'role', label: '角色', minWidth: 100 },
  { id: 'status', label: '状态', minWidth: 80 },
  { id: 'joinDate', label: '加入日期', minWidth: 120 },
];

const userData: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '激活',
    joinDate: '2024-01-15',
  },
];

function UserTable() {
  return (
    <DataTable
      columns={columns}
      rows={userData}
      title="用户管理表格"
      selectable
      sortable
      onSelectionChange={(selected) => {
        console.log('选中的用户:', selected);
      }}
      onRowClick={(row) => {
        console.log('点击的用户:', row);
      }}
    />
  );
}
```

### Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `Column<T>[]` | - | 表格列定义数组（必填） |
| `rows` | `T[]` | - | 表格数据数组（必填） |
| `title` | `string` | `'数据表格'` | 表格标题 |
| `selectable` | `boolean` | `false` | 是否启用行选择功能 |
| `sortable` | `boolean` | `false` | 是否启用排序功能 |
| `onSelectionChange` | `(selected: T[]) => void` | - | 选择变化回调函数 |
| `onRowClick` | `(row: T) => void` | - | 行点击回调函数 |
| `stickyHeader` | `boolean` | `true` | 是否启用固定表头 |
| `maxHeight` | `number \| string` | `440` | 表格最大高度 |

### Column 类型定义

```typescript
interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: unknown) => string | number;
}
```

### 自定义格式化示例

```typescript
const columns: Column<Product>[] = [
  { id: 'name', label: '产品名称', minWidth: 150 },
  {
    id: 'price',
    label: '价格',
    minWidth: 100,
    align: 'right',
    format: (value: unknown) => `¥${Number(value).toFixed(2)}`,
  },
  {
    id: 'stock',
    label: '库存',
    minWidth: 80,
    align: 'right',
    format: (value: unknown) => Number(value).toLocaleString(),
  },
];
```

## SimpleTable 组件

### 功能特性

- 简单的数据展示
- 支持固定表头
- 支持自定义列格式化
- 无分页和选择功能

### 基本用法

```typescript
import { SimpleTable, type Column } from '@/components/ui';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const productColumns: Column<Product>[] = [
  { id: 'name', label: '产品名称', minWidth: 150 },
  { id: 'category', label: '分类', minWidth: 100 },
  {
    id: 'price',
    label: '价格',
    minWidth: 100,
    align: 'right',
    format: (value: unknown) => `¥${Number(value).toFixed(2)}`,
  },
];

const productData: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', category: '手机', price: 7999, stock: 120 },
];

function ProductTable() {
  return (
    <SimpleTable
      columns={productColumns}
      rows={productData}
      stickyHeader
      maxHeight={400}
    />
  );
}
```

### Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `Column<T>[]` | - | 表格列定义数组（必填） |
| `rows` | `T[]` | - | 表格数据数组（必填） |
| `stickyHeader` | `boolean` | `false` | 是否启用固定表头 |
| `maxHeight` | `number \| string` | - | 表格最大高度 |

## 注意事项

- 数据类型 `T` 必须包含 `id` 字段（`string | number`）
- 使用 `@/` 路径别名需要在 `vite.config.ts` 和 `tsconfig.app.json` 中配置
- Material UI v7 使用新的 Grid 组件 API，不再使用 `item` 属性

## 路径别名配置

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### tsconfig.app.json

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

## 示例页面

完整的示例页面位于 `src/features/mui-demo/MUIComponents.tsx`，展示了：

- DataTable 用户管理表格（带选择和排序）
- SimpleTable 产品列表（简单展示）

运行项目即可查看效果：

```bash
npm run dev
```
