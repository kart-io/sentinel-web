# 混合布局模式内容覆盖问题修复

## 🐛 问题描述

在 **mixed-nav** (混合导航) 布局模式下，侧边栏覆盖了顶部菜单的一部分内容。

### 问题原因

**mixed-nav 布局结构**:
```
┌────────────────────────────────┐
│   Header (48px, fixed)         │ z-index: 200
├────────────────────────────────┤
│   顶部一级菜单 (48px, fixed)    │ z-index: 190
├──────┬─────────────────────────┤
│ 侧边 │                         │
│ 二级 │      Main Content       │
│ 菜单 │                         │
└──────┴─────────────────────────┘
```

**问题**:
- 侧边栏的 `marginTop` 只计算了 `header.height` (48px)
- 但实际上顶部还有一级菜单 (48px)
- 导致侧边栏从 48px 的位置开始，覆盖了顶部菜单

**错误代码** (在 `LayoutSidebar.tsx` 中):
```typescript
// ❌ 错误: 只考虑了 Header 高度
const sidebarMarginTop = isMixedNav && !app.isMobile ? header.height : 0;
// 结果: marginTop = 48px (侧边栏从48px开始，覆盖了顶部菜单)
```

**正确位置应该是**:
```
Header (0-48px)           ← Header
顶部菜单 (48-96px)        ← 一级菜单
侧边栏开始 (96px)         ← 侧边栏应该从这里开始
```

## ✅ 解决方案

### 修复代码

**文件**: `/src/components/layout/LayoutSidebar.tsx`

```typescript
// ✅ 正确: 考虑 Header + 顶部菜单的高度
const sidebarMarginTop = isMixedNav && !app.isMobile ? header.height + 48 : 0;
// 结果: marginTop = 48 + 48 = 96px (侧边栏在顶部菜单下方)
```

### 修复效果

**修复前**:
```
┌────────────────────────┐
│   Header (48px)        │
├────────────────────────┤
│   顶部菜单 (48px)      │ ← 被侧边栏覆盖
├──────┬─────────────────┤
│ 侧边 │                 │
│ 栏从 │   Main Content  │
│ 48px │                 │
│ 开始 │                 │
└──────┴─────────────────┘
     ↑ 覆盖了顶部菜单
```

**修复后**:
```
┌────────────────────────┐
│   Header (48px)        │
├────────────────────────┤
│   顶部菜单 (48px)      │ ✅ 完全可见
├──────┬─────────────────┤
│      │                 │
│ 侧边 │   Main Content  │
│ 栏从 │                 │
│ 96px │                 │
│ 开始 │                 │
└──────┴─────────────────┘
     ✅ 不再覆盖
```

## 📊 各布局模式的高度计算

| 布局模式 | Header | 额外菜单 | 侧边栏 marginTop | 内容区 marginTop |
|---------|--------|---------|-----------------|-----------------|
| sidebar-nav | 48px | - | 0 | 48px |
| header-nav | 48px | 48px (横向) | - | 96px |
| **mixed-nav** | 48px | 48px (一级) | **96px** ✅ | 96px |
| sidebar-mixed-nav | 48px | - | 0 | 48px |
| header-mixed-nav | 48px | 88px (双行) | - | 136px |
| header-sidebar-nav | 48px | - | 0 | 48px |
| full-content | - | - | - | 0 |

### 计算逻辑

**MainLayout.tsx** - 内容区域 marginTop:
```typescript
const getTopExtraHeight = () => {
  let extra = 0;
  if (isMixedNav || isHeaderNav) extra += 48;      // 单行菜单
  if (isHeaderMixedNav) extra += 88;               // 双行菜单 (44+44)
  return extra;
};

// 内容区域
marginTop: `${header.height + getTopExtraHeight()}px`
// mixed-nav: 48 + 48 = 96px ✅
// header-mixed-nav: 48 + 88 = 136px ✅
```

**LayoutSidebar.tsx** - 侧边栏 marginTop:
```typescript
// mixed-nav 模式下
const sidebarMarginTop = isMixedNav && !app.isMobile
  ? header.height + 48   // 48 (header) + 48 (顶部菜单) = 96px
  : 0;
```

## 🔍 为什么会有这个问题？

这是在完善布局功能时的一个遗漏：

1. **最初实现**: LayoutSidebar 只考虑了 header.height
2. **后来添加**: mixed-nav 的顶部一级菜单
3. **忘记更新**: LayoutSidebar 的 marginTop 计算

## 🧪 测试步骤

### 1. 切换到 mixed-nav 模式
- 访问 `/layout-test`
- 点击 "混合导航布局" 卡片

### 2. 检查覆盖问题
**修复前**:
- ❌ 侧边栏会覆盖顶部一级菜单的下半部分
- ❌ 顶部菜单的底部看不清

**修复后**:
- ✅ 侧边栏完全在顶部菜单下方
- ✅ 顶部菜单完全可见
- ✅ 没有任何覆盖

### 3. 测试其他功能
- ✅ 点击顶部一级菜单切换模块
- ✅ 侧边栏显示对应的二级菜单
- ✅ 侧边栏折叠/展开正常
- ✅ 悬停展开功能正常

## 📋 相关高度常量

在代码中使用的固定高度值：

```typescript
// 在 layoutStore.ts 中定义
header: {
  height: 48,        // Header 高度
}

// 在 MainLayout.tsx 中使用
lineHeight: '48px'   // 单行菜单高度 (mixed-nav, header-nav)
lineHeight: '44px'   // 双行菜单每行高度 (header-mixed-nav)
```

**为什么不统一为常量？**
- Header 高度是可配置的 (在 layoutStore 中)
- 菜单高度目前是固定的，未来可以考虑也做成可配置

## 💡 优化建议

### 短期 (已修复)
- ✅ 修复 mixed-nav 的侧边栏位置

### 中期 (可选)
- 将菜单高度也定义为常量或配置项
- 统一管理所有高度相关的值

### 长期 (未来)
- 考虑使用 CSS 变量统一管理
- 自动计算所有元素的位置，减少手动计算

## ✅ 修复状态

- ✅ 代码已修复
- ✅ 计算逻辑已验证
- ✅ 文档已更新
- ⏳ 等待用户测试验证

## 🎯 影响范围

**只影响**:
- mixed-nav 布局模式的侧边栏定位

**不影响**:
- 其他 6 种布局模式
- 内容区域的定位 (本来就是正确的)
- Header 和菜单的定位

## 📝 相关文件

| 文件 | 修改内容 |
|------|---------|
| `/src/components/layout/LayoutSidebar.tsx` | 修复 marginTop 计算 |
| `/src/layouts/MainLayout.tsx` | 无需修改 (逻辑已正确) |

---

**测试地址**: http://localhost:5174/layout-test

**测试步骤**: 切换到 "混合导航布局"，检查侧边栏是否在顶部菜单下方，无覆盖。
