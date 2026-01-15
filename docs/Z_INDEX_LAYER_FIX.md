# Z-Index 层级修复文档

## 问题描述

左侧侧边栏菜单覆盖了顶部的面包屑导航区域，导致用户无法看到完整的页面导航信息。

## 原因分析

### Z-Index 冲突

1. **Header 外层容器**（MainLayout.tsx）：`z-index: 200`
2. **LayoutHeader 组件内部**：`z-index: 200`（冗余）
3. **Sidebar 组件**：`z-index: 200`（冲突）

由于 Sidebar 和 Header 的 z-index 相同，且 Sidebar 在 DOM 树中的位置或渲染顺序导致它覆盖了 Header。

## 解决方案

### 1. 调整 Sidebar 的 Z-Index

**文件**：`src/components/layout/LayoutSidebar.tsx`

**修改前**：
```typescript
const sidebarZIndex = app.isMobile ? 1001 : isMixedNav ? 100 : 200;
```

**修改后**：
```typescript
const sidebarZIndex = app.isMobile ? 1001 : isMixedNav ? 100 : 150;
```

**说明**：
- 将非 mixed-nav 模式下的 Sidebar z-index 从 `200` 降低到 `150`
- 确保 Sidebar 始终在 Header 下方
- 保持 mobile 和 mixed-nav 模式的原有逻辑不变

### 2. 移除 LayoutHeader 内部的 Z-Index

**文件**：`src/components/layout/LayoutHeader.tsx`

**修改前**：
```tsx
className={`
  bg-header px-0 flex items-center justify-between
  ${header.mode === 'fixed' || header.mode === 'auto-scroll' ? 'sticky top-0' : ''}
  z-[200] shadow-sm border-b border-border
  transition-colors duration-200
`}
```

**修改后**：
```tsx
className={`
  bg-header px-0 flex items-center justify-between
  ${header.mode === 'fixed' || header.mode === 'auto-scroll' ? 'sticky top-0' : ''}
  shadow-sm border-b border-border
  transition-colors duration-200
`}
```

**说明**：
- 移除 `z-[200]`，因为外层容器已经设置了 z-index
- 避免重复设置导致的样式冲突
- 让外层容器完全控制 z-index

## Z-Index 层级结构

修复后的完整 z-index 层级（从高到低）：

| 元素 | Z-Index | 说明 | 文件位置 |
|------|---------|------|----------|
| 全屏内容浮动按钮 | 9999 | 最高优先级 | MainLayout.tsx:282 |
| 移动端 Sidebar 遮罩 | 1000 | 遮罩层 | LayoutSidebar.tsx:211 |
| 移动端 Sidebar | 1001 | 移动端侧边栏 | LayoutSidebar.tsx:109 |
| **Header 容器** | **200** | **顶部导航栏** | **MainLayout.tsx:342** |
| Mixed-Nav 顶部菜单 | 190 | 混合导航顶部菜单 | MainLayout.tsx:358 |
| **Sidebar（普通模式）** | **150** | **侧边栏菜单** | **LayoutSidebar.tsx:109** |
| Sidebar（mixed-nav） | 100 | 混合导航侧边栏 | LayoutSidebar.tsx:109 |
| Sidebar-Mixed-Nav 第二列 | 90 | 双列侧边栏第二列 | MainLayout.tsx:473 |
| TabsView | 50 | 标签页视图 | MainLayout.tsx:517 |
| Footer | 10 | 页脚 | MainLayout.tsx:548 |

## 层级设计原则

### 1. 优先级规则
- **Header** > **Sidebar**：导航栏应该始终在侧边栏上方
- **Mobile Sidebar** > **Header**：移动端侧边栏需要覆盖所有内容
- **Overlay** > **Sidebar**：遮罩层要覆盖侧边栏

### 2. 间隔规则
- 相邻元素的 z-index 差值应该足够大（建议 ≥ 10）
- 避免使用连续的数值，预留扩展空间

### 3. 特殊情况
- **Mixed-Nav**：顶部菜单 (190) > 侧边栏 (100)
- **Mobile**：侧边栏 (1001) > 遮罩 (1000) > 所有桌面元素

## 验证方法

### 1. 桌面端验证
```bash
# 访问应用
http://localhost:5174

# 检查项
1. 面包屑导航是否可见
2. 鼠标悬停在面包屑上是否有正确的交互
3. 侧边栏是否在 Header 下方
```

### 2. Mixed-Nav 模式验证
```bash
# 切换到 Mixed-Nav 布局
设置 -> 布局模式 -> 混合导航

# 检查项
1. 顶部一级菜单是否在最上方
2. 侧边栏二级菜单是否在顶部菜单下方
3. Header 是否不被遮挡
```

### 3. 移动端验证
```bash
# 使用浏览器开发者工具
F12 -> 切换设备模拟器 -> 选择移动设备

# 检查项
1. 侧边栏是否覆盖所有内容（包括 Header）
2. 点击遮罩是否正确关闭侧边栏
```

## 相关文件

- `src/components/layout/LayoutSidebar.tsx` - 侧边栏 z-index 调整
- `src/components/layout/LayoutHeader.tsx` - 移除冗余 z-index
- `src/layouts/MainLayout.tsx` - z-index 层级定义

## 注意事项

1. **不要随意修改 z-index**：修改 z-index 可能影响多个布局模式
2. **保持层级一致性**：新增元素时参考现有层级结构
3. **移动端特殊处理**：移动端的 z-index 策略与桌面端不同
4. **测试所有布局模式**：修改后需要测试 7 种布局模式

## 后续优化建议

### 1. 统一 Z-Index 管理
创建一个 z-index 配置文件：

```typescript
// src/constants/zIndex.ts
export const Z_INDEX = {
  MODAL: 9999,
  MOBILE_SIDEBAR: 1001,
  MOBILE_OVERLAY: 1000,
  HEADER: 200,
  MIXED_NAV_TOP: 190,
  SIDEBAR: 150,
  MIXED_NAV_SIDEBAR: 100,
  SIDEBAR_SECONDARY: 90,
  TABS: 50,
  FOOTER: 10,
} as const;
```

### 2. CSS 变量化
在 `src/index.css` 中定义：

```css
:root {
  --z-modal: 9999;
  --z-mobile-sidebar: 1001;
  --z-mobile-overlay: 1000;
  --z-header: 200;
  --z-mixed-nav-top: 190;
  --z-sidebar: 150;
  --z-mixed-nav-sidebar: 100;
  --z-sidebar-secondary: 90;
  --z-tabs: 50;
  --z-footer: 10;
}
```

### 3. 文档化
在组件中添加注释说明 z-index 的选择原因。

## 修复时间线

- **2026-01-15**：发现问题 - Sidebar 覆盖 Header
- **2026-01-15**：调整 Sidebar z-index 从 200 降到 150
- **2026-01-15**：移除 LayoutHeader 内部冗余的 z-index 设置
- **2026-01-15**：验证修复效果，所有布局模式正常

## 测试结果

- ✅ Sidebar-Nav 模式：Header 正常显示，不被遮挡
- ✅ Mixed-Nav 模式：层级正确，顶部菜单 > 侧边栏
- ✅ Header-Nav 模式：无侧边栏，Header 正常
- ✅ 移动端：侧边栏正确覆盖所有内容
- ✅ 面包屑导航：可见且可交互
- ✅ 主题切换：z-index 在所有主题下工作正常
