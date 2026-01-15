# Z-Index 层级问题修复 - Mixed-Nav 模式

## 🐛 问题描述

在 **mixed-nav** (混合导航) 布局模式下，侧边栏遮盖了顶部的一级菜单。

**截图显示的问题**:
- 顶部有一排图标菜单（一级菜单）
- 左侧的侧边栏（二级菜单）遮盖了顶部菜单的一部分
- 用户无法点击被遮盖的顶部菜单项

## 🔍 问题原因

### Z-Index 层级错误

**修复前的 z-index 设置**:
```typescript
// ❌ 错误: mixed-nav 模式下侧边栏 z-index 为 201
const sidebarZIndex = app.isMobile ? 1001 : isMixedNav ? 201 : 200;
```

**实际的层级关系** (修复前):
```
z-index: 200  ← Header
z-index: 190  ← 顶部一级菜单
z-index: 201  ← 侧边栏 ❌ 太高了，遮盖了顶部菜单！
```

**问题**:
- 侧边栏的 z-index (201) > 顶部菜单的 z-index (190)
- 导致侧边栏显示在顶部菜单之上
- 即使 `marginTop` 设置正确（96px），仍然会有视觉上的遮盖

## ✅ 解决方案

### 修复 Z-Index 层级

```typescript
// ✅ 正确: mixed-nav 模式下侧边栏 z-index 为 100
const sidebarZIndex = app.isMobile ? 1001 : isMixedNav ? 100 : 200;
```

**修复后的层级关系**:
```
z-index: 200  ← Header (最上层)
z-index: 190  ← 顶部一级菜单
z-index: 100  ← 侧边栏 ✅ 在顶部菜单下方
z-index: 50   ← Tabbar
z-index: 10   ← Footer (如果 fixed)
z-index: 0    ← 主内容区域
```

## 📊 完整的 Z-Index 层级系统

### 所有元素的 Z-Index

| 元素 | 条件 | Z-Index | 说明 |
|------|------|---------|------|
| **Header** | 全局 | 200 | 始终在最上层 |
| **顶部菜单** | mixed-nav, header-nav, header-mixed-nav | 190 | 在 Header 下方 |
| **侧边栏** | 桌面端 (非 mixed-nav) | 200 | 与 Header 同级 |
| **侧边栏** | **mixed-nav** | **100** ✅ | 在顶部菜单下方 |
| **侧边栏** | 移动端 | 1001 | 遮罩层，覆盖所有内容 |
| **双列侧边栏 - 左列** | sidebar-mixed-nav | 100 | 图标列 |
| **双列侧边栏 - 右列** | sidebar-mixed-nav | 90 | 菜单列 |
| **Tabbar** | 启用时 | 50 | 在侧边栏下方 |
| **Footer** | fixed 模式 | 10 | 在底部 |
| **浮动按钮** | full-content | 9999 | 始终可见 |

### 代码位置

#### MainLayout.tsx
```typescript
// Header
z-[200]

// Mixed-Nav 顶部菜单
z-[190]

// Header-Nav 顶部菜单
z-[190]

// Header-Mixed-Nav 顶部菜单
z-[190]

// Sidebar-Mixed-Nav 左列
z-[100]

// Sidebar-Mixed-Nav 右列
z-[90]

// Tabbar
z-[50]

// Footer (fixed)
z-[10]

// Full-Content 浮动按钮
z-[9999]
```

#### LayoutSidebar.tsx
```typescript
// 标准侧边栏
const sidebarZIndex = app.isMobile
  ? 1001           // 移动端: 遮罩层
  : isMixedNav
    ? 100          // Mixed-nav: 在顶部菜单下方 ✅
    : 200;         // 其他模式: 与 Header 同级
```

## 🎨 视觉层级关系

### Mixed-Nav 模式的正确层级

```
┌─────────────────────────────────┐
│   Header (z:200)                │ ← 最上层
├─────────────────────────────────┤
│   顶部一级菜单 (z:190)           │ ← 第二层
├──────┬──────────────────────────┤
│      │                          │
│ 侧边 │   Main Content           │
│ 栏   │   (z:0)                  │
│(z:100)                          │ ← 第三层
│      │                          │
└──────┴──────────────────────────┘
```

**层次说明**:
1. **Header (z:200)**: 全局顶部，包含 Logo、面包屑、用户信息等
2. **顶部菜单 (z:190)**: 一级模块导航（仪表板、RAG、用户、调度等）
3. **侧边栏 (z:100)**: 二级功能菜单，根据选中的一级菜单动态变化
4. **内容区 (z:0)**: 主要内容展示区域

## 🔧 为什么要降低 mixed-nav 的侧边栏 z-index？

### 设计逻辑

**mixed-nav 的特点**:
1. 顶部显示一级菜单（模块级导航）
2. 侧边显示二级菜单（功能级导航）
3. 一级菜单应该始终可见和可点击
4. 二级菜单是一级菜单的补充

**层级关系**:
```
一级菜单 (更重要) → z-index 更高 (190)
    ↓
二级菜单 (从属) → z-index 更低 (100)
```

### 为什么不是 190 或更高？

如果侧边栏 z-index ≥ 190:
- ❌ 会遮盖顶部一级菜单
- ❌ 用户无法点击顶部菜单
- ❌ 违反了层级关系
- ❌ 影响用户体验

如果侧边栏 z-index = 100:
- ✅ 不会遮盖顶部菜单
- ✅ 层级关系正确
- ✅ 即使有重叠，顶部菜单仍然在上方
- ✅ 用户体验良好

## 🧪 测试步骤

### 1. 切换到 mixed-nav 模式
- 访问 `/layout-test`
- 点击 "混合导航布局" 卡片

### 2. 检查顶部菜单
**修复前**:
- ❌ 左侧被侧边栏遮盖
- ❌ 无法点击部分图标
- ❌ 视觉上有重叠

**修复后**:
- ✅ 顶部菜单完全可见
- ✅ 所有图标都可以点击
- ✅ 没有视觉遮盖

### 3. 检查侧边栏
- ✅ 侧边栏在顶部菜单下方
- ✅ 从 96px 的位置开始
- ✅ 不会向上延伸遮盖顶部

### 4. 检查交互
- ✅ 点击顶部菜单，侧边栏内容切换
- ✅ 所有菜单项都可以点击
- ✅ 没有点击死角

## 📋 其他布局模式的 Z-Index

### Sidebar-Nav (默认)
```
Header (z:200) + Sidebar (z:200) 并列
```
- 侧边栏和 Header 同级
- 侧边栏从顶部开始（marginTop: 0）

### Header-Nav
```
Header (z:200) > 顶部菜单 (z:190)
```
- 无侧边栏
- 顶部菜单占据整行

### Sidebar-Mixed-Nav
```
Header (z:200) > 左列 (z:100) > 右列 (z:90)
```
- 双列侧边栏
- 左列图标在上，右列菜单在下

### Header-Mixed-Nav
```
Header (z:200) > 第一行菜单 (z:190) = 第二行菜单 (z:190)
```
- 双行顶部菜单
- 无侧边栏

## ✅ 修复状态

- ✅ Z-Index 已修复
- ✅ 层级关系正确
- ✅ 不再有遮盖问题
- ⏳ 等待用户验证

## 📝 相关文件

| 文件 | 修改内容 |
|------|---------|
| `/src/components/layout/LayoutSidebar.tsx` | 修复 mixed-nav 的 z-index (201 → 100) |

## 🎯 影响范围

**只影响**: mixed-nav 模式的侧边栏层级
**不影响**: 其他布局模式的 z-index

## 💡 未来优化建议

### 统一管理 Z-Index

创建 z-index 常量文件:

```typescript
// src/constants/zIndex.ts
export const Z_INDEX = {
  HEADER: 200,
  TOP_MENU: 190,
  SIDEBAR_MIXED_NAV: 100,
  SIDEBAR_NORMAL: 200,
  SIDEBAR_MOBILE: 1001,
  SIDEBAR_MIXED_LEFT: 100,
  SIDEBAR_MIXED_RIGHT: 90,
  TABBAR: 50,
  FOOTER: 10,
  FLOAT_BUTTON: 9999,
} as const;
```

**好处**:
- 集中管理
- 易于维护
- 避免冲突
- 清晰明了

---

**测试地址**: http://localhost:5174/layout-test
**测试布局**: 混合导航布局 (mixed-nav)
**预期效果**: 顶部菜单不被遮盖，所有元素层级正确
