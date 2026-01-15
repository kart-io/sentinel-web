# 布局模式显示逻辑修复

## 问题描述

用户报告：偏好设置中选择的布局模式与实际显示的布局不一致。

## 根本原因

`showSidebar` 的计算逻辑不正确，导致某些布局模式下侧边栏显示或隐藏不符合预期。

### 原有逻辑（错误）

```typescript
const showSidebar = !isFullContent && !isHeaderNav && !state.sidebar.hidden;
```

**问题**：
1. 使用**排除法**（什么时候不显示）而不是**包含法**（什么时候显示）
2. 没有排除 `header-mixed-nav` 模式
3. 逻辑不够明确，难以维护

**导致的问题**：
- `header-mixed-nav` 模式下可能错误地显示侧边栏
- 布局模式与实际显示不一致

## 解决方案

### 修复后的逻辑

```typescript
const showSidebar =
  !state.sidebar.hidden &&
  (isSidebarNav || isMixedNav || isSidebarMixedNav || isHeaderSidebarNav);
```

**改进**：
1. 使用**包含法**明确列出需要显示侧边栏的布局模式
2. 逻辑更清晰，易于理解和维护
3. 确保只有指定的4种布局模式显示侧边栏

## 布局模式与侧边栏显示关系

| 布局模式 | 侧边栏 | 顶部菜单 | 说明 |
|---------|--------|----------|------|
| sidebar-nav | ✅ | ❌ | 标准侧边栏导航 |
| header-nav | ❌ | ✅ | 纯顶部导航 |
| mixed-nav | ✅ | ✅ | 顶部一级 + 侧边二级 |
| sidebar-mixed-nav | ✅ | ❌ | 双列侧边栏 |
| header-mixed-nav | ❌ | ✅ | 顶部双行菜单 |
| header-sidebar-nav | ✅ | ❌ | 顶部通栏 + 侧边栏 |
| full-content | ❌ | ❌ | 全屏内容 |

### 显示侧边栏的布局模式

```typescript
// 这4种模式显示侧边栏
- sidebar-nav         // 标准侧边栏布局
- mixed-nav          // 混合导航（侧边显示二级菜单）
- sidebar-mixed-nav  // 双列侧边栏
- header-sidebar-nav // 顶部 + 侧边栏
```

### 不显示侧边栏的布局模式

```typescript
// 这3种模式不显示侧边栏
- header-nav        // 仅顶部菜单
- header-mixed-nav  // 顶部双行菜单
- full-content      // 纯内容
```

## 修复文件

### layoutStore.ts

**位置**: `src/store/layoutStore.ts:424-428`

**修改前**:
```typescript
const showSidebar = !isFullContent && !isHeaderNav && !state.sidebar.hidden;
const showHeaderMenu = isHeaderNav || isMixedNav || isHeaderMixedNav;
```

**修改后**:
```typescript
// 是否显示侧边栏
// 只有以下布局模式显示侧边栏：sidebar-nav, mixed-nav, sidebar-mixed-nav, header-sidebar-nav
const showSidebar =
  !state.sidebar.hidden &&
  (isSidebarNav || isMixedNav || isSidebarMixedNav || isHeaderSidebarNav);

// 是否显示顶部菜单
const showHeaderMenu = isHeaderNav || isMixedNav || isHeaderMixedNav;
```

## 验证修复

### 1. 使用调试信息验证

打开偏好设置，查看调试信息卡片：

```
当前布局状态：
Store: mixed-nav
计算标志: isMixedNav
showSidebar: ✅
showHeaderMenu: ✅
```

### 2. 测试每种布局模式

| 布局模式 | 预期 showSidebar | 预期 showHeaderMenu |
|---------|------------------|---------------------|
| sidebar-nav | ✅ | ❌ |
| header-nav | ❌ | ✅ |
| mixed-nav | ✅ | ✅ |
| sidebar-mixed-nav | ✅ | ❌ |
| header-mixed-nav | ❌ | ✅ |
| header-sidebar-nav | ✅ | ❌ |
| full-content | ❌ | ❌ |

### 3. 验证步骤

对于每种布局模式：

1. **打开偏好设置** → 选择布局模式
2. **查看调试信息** → 确认 Store 值正确
3. **检查页面布局** → 确认侧边栏和顶部菜单显示符合预期
4. **刷新页面** → 确认布局保持不变

### 4. 测试脚本

可以在浏览器控制台运行：

```javascript
// 获取当前布局状态
const checkLayout = () => {
  const prefs = JSON.parse(localStorage.getItem('layout-preferences'));
  const layout = prefs?.state?.app?.layout;

  console.log('Current layout:', layout);
  console.log('Expected sidebar:', ['sidebar-nav', 'mixed-nav', 'sidebar-mixed-nav', 'header-sidebar-nav'].includes(layout));
  console.log('Expected header menu:', ['header-nav', 'mixed-nav', 'header-mixed-nav'].includes(layout));
};

checkLayout();
```

## 相关代码位置

### useLayoutComputed Hook

```typescript
// src/store/layoutStore.ts:413-456

export const useLayoutComputed = () => {
  const state = useLayoutStore();

  // 布局标志
  const isFullContent = state.app.layout === 'full-content';
  const isSidebarNav = state.app.layout === 'sidebar-nav';
  const isHeaderNav = state.app.layout === 'header-nav';
  const isMixedNav = state.app.layout === 'mixed-nav';
  const isSidebarMixedNav = state.app.layout === 'sidebar-mixed-nav';
  const isHeaderMixedNav = state.app.layout === 'header-mixed-nav';
  const isHeaderSidebarNav = state.app.layout === 'header-sidebar-nav';

  // 显示逻辑
  const showSidebar =
    !state.sidebar.hidden &&
    (isSidebarNav || isMixedNav || isSidebarMixedNav || isHeaderSidebarNav);

  const showHeaderMenu = isHeaderNav || isMixedNav || isHeaderMixedNav;

  // ...返回所有计算属性
};
```

### MainLayout 条件渲染

```typescript
// src/layouts/MainLayout.tsx:496-504

{isSidebarMixedNav ? (
  /* 双列侧边栏 */
  <Sider>...</Sider>
) : (
  /* 标准侧边栏 */
  showSidebar && (
    <LayoutSidebar ... />
  )
)}
```

## 影响范围

### 修复影响的组件

1. **LayoutSidebar** - 显示/隐藏逻辑
2. **MainLayout** - 内容区域左边距计算
3. **PreferencesDrawer** - 调试信息显示

### 不影响的功能

- 主题切换
- Tabbar 显示
- Footer 显示
- 面包屑导航
- 其他布局配置

## 后续优化建议

### 1. 单元测试

为 `useLayoutComputed` 创建单元测试：

```typescript
// layoutStore.test.ts

describe('useLayoutComputed', () => {
  it('should show sidebar for sidebar-nav', () => {
    const { showSidebar } = useLayoutComputed();
    expect(showSidebar).toBe(true);
  });

  it('should not show sidebar for header-nav', () => {
    const { showSidebar } = useLayoutComputed();
    expect(showSidebar).toBe(false);
  });

  // 测试所有7种布局模式
});
```

### 2. 类型安全

创建布局模式常量：

```typescript
// layoutStore.ts

export const LAYOUTS_WITH_SIDEBAR = [
  'sidebar-nav',
  'mixed-nav',
  'sidebar-mixed-nav',
  'header-sidebar-nav',
] as const;

export const LAYOUTS_WITH_HEADER_MENU = [
  'header-nav',
  'mixed-nav',
  'header-mixed-nav',
] as const;

// 使用常量
const showSidebar =
  !state.sidebar.hidden &&
  LAYOUTS_WITH_SIDEBAR.includes(state.app.layout);
```

### 3. 文档化

在代码中添加注释说明每种布局模式的特点：

```typescript
/**
 * 布局模式说明：
 *
 * sidebar-nav:        侧边栏导航（默认）
 * header-nav:         顶部导航
 * mixed-nav:          混合导航（顶部一级 + 侧边二级）
 * sidebar-mixed-nav:  双列侧边栏（左窄右宽）
 * header-mixed-nav:   顶部双行菜单
 * header-sidebar-nav: 顶部通栏 + 侧边栏
 * full-content:       全屏内容
 */
```

## 总结

### 修复内容
- ✅ 修正 `showSidebar` 的计算逻辑
- ✅ 使用明确的包含法而不是排除法
- ✅ 添加清晰的注释说明
- ✅ 确保所有7种布局模式显示正确

### 预期效果
- ✅ 布局模式选择后立即生效
- ✅ 侧边栏仅在指定的4种模式下显示
- ✅ 顶部菜单仅在指定的3种模式下显示
- ✅ 刷新页面后布局保持不变
- ✅ 调试信息正确反映布局状态

### 测试清单
- [ ] sidebar-nav: 显示侧边栏，不显示顶部菜单
- [ ] header-nav: 不显示侧边栏，显示顶部菜单
- [ ] mixed-nav: 显示侧边栏，显示顶部菜单
- [ ] sidebar-mixed-nav: 显示双列侧边栏，不显示顶部菜单
- [ ] header-mixed-nav: 不显示侧边栏，显示顶部双行菜单
- [ ] header-sidebar-nav: 显示侧边栏，不显示顶部菜单
- [ ] full-content: 不显示侧边栏和顶部菜单
- [ ] 刷新页面后布局保持不变
- [ ] 调试信息显示正确

修复完成后，所有布局模式应该完全按照设计规范显示！
