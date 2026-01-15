# sidebar-mixed-nav 模式修复说明

## 问题描述
sidebar-mixed-nav（侧边混合）模式下，Header 覆盖了侧边栏，布局显示不正确。

## 问题根源

### 1. Header 没有左边距
**错误：** Header 的 `marginLeft` 计算中，`showSidebar` 在 sidebar-mixed-nav 模式下返回 `false`，因为我们使用自定义渲染而不是 `LayoutSidebar` 组件。

```typescript
// ❌ 错误的判断
const headerMarginLeft = showSidebar && !app.isMobile ? ... : 0;
// 在 sidebar-mixed-nav 模式下，showSidebar = false，导致 marginLeft = 0
```

**结果：** Header 从 `left: 0` 开始，覆盖了双列侧边栏（272px）

### 2. 右侧二级菜单条件渲染错误
**错误：** 右侧菜单通过 `!sidebar.collapsed` 控制显示

```tsx
// ❌ 错误
{!sidebar.collapsed && (
  <div>右侧二级菜单</div>
)}
```

**问题：** 在 sidebar-mixed-nav 模式下，右侧菜单应该**总是显示**，不应该通过 collapsed 状态控制。

## vben-admin 的正确实现

### 双列侧边栏结构
```vue
<!-- 主侧边栏（左列）：mixedWidth (70-80px) -->
<aside>
  <div v-if="slots.logo">Logo</div>
  <slot></slot>  <!-- 一级菜单 -->
</aside>

<!-- 扩展侧边栏（右列）：extraWidth -->
<div v-if="isSidebarMixed" :style="extraStyle">
  <slot name="extra-title"></slot>  <!-- Logo 文字 -->
  <slot name="extra"></slot>         <!-- 二级菜单 -->
</div>
```

**关键点：**
1. 左列固定 70-80px，显示图标
2. 右列通过 `extraVisible` 控制，但默认显示
3. 总宽度 = mixedWidth + extraWidth

### Header 定位
```typescript
// vben-admin 的 mainStyle 计算
const mainStyle = computed(() => {
  if (currentLayout.value !== 'header-nav' && 
      currentLayout.value !== 'mixed-nav' && 
      currentLayout.value !== 'header-sidebar-nav' && 
      showSidebar.value) {
    // Header 需要左边距
    width = `calc(100% - ${sidebarWidth}px)`;
  }
});
```

## 修复实现

### 1. 更新 LayoutHeader.tsx - 添加 isSidebarMixedNav 判断

```typescript
const { showSidebar, isSidebarMixedNav, ... } = useLayoutComputed();

// 修复 headerMarginLeft 计算
const headerMarginLeft = !app.isMobile && (showSidebar || isSidebarMixedNav)
  ? (isMixedNav 
      ? (sidebar.collapsed ? sidebar.collapsedWidth : sidebar.mixedWidth)
      : isSidebarMixedNav
        ? 272  // 左列72px + 右列200px，总是显示
        : (sidebar.collapsed ? sidebar.collapsedWidth : sidebar.width))
  : 0;

// 修复 width 计算
style={{
  marginLeft: headerMarginLeft,
  width: (showSidebar || isSidebarMixedNav) && !app.isMobile 
    ? `calc(100% - ${headerMarginLeft}px)` 
    : '100%',
}}
```

**关键：** 在判断是否需要左边距时，增加 `|| isSidebarMixedNav` 条件

### 2. 更新 MainLayout.tsx - 右侧菜单总是显示

```tsx
{/* 右侧: 二级菜单 - 总是显示 */}
<div
  style={{
    left: '72px',
    width: '200px',
    // ...
  }}
>
  <Menu ... />
</div>
```

**删除：** `{!sidebar.collapsed && (...)}` 条件判断

### 3. 更新 contentMarginLeft 计算

```typescript
const getContentMarginLeft = () => {
  if (isMobile) return 0;
  if (isHeaderNav || isHeaderMixedNav) return 0;
  if (isSidebarMixedNav) {
    // sidebar-mixed-nav: 左列72px + 右列200px (总是显示)
    return 272;
  }
  if (showSidebar) return sidebarWidth;
  return 0;
};
```

**关键：** sidebar-mixed-nav 模式下，总是返回 272px

## 修复后的布局

### sidebar-mixed-nav 模式
```
┌──┬────────┬──────────────────────┐
│图│ Logo   │  Header              │ <- Header marginLeft: 272px
│标├────────┼──────────────────────┤
│  │ SubM1  │                      │
│M1│ SubM2  │     Content          │
│M2│ SubM3  │                      │
└──┴────────┴──────────────────────┘
 72px 200px  <-- 总宽度 272px
```

**特点：**
- ✅ 左列：72px（一级菜单图标 + Logo 图标）
- ✅ 右列：200px（二级菜单 + Logo 文字）
- ✅ Header：从 272px 开始，宽度 `calc(100% - 272px)`
- ✅ Content：marginLeft 272px

## 验证要点

请硬刷新浏览器（Ctrl+Shift+R），然后切换到 sidebar-mixed-nav 模式，检查：

1. **Header 定位：**
   - ✅ Header 从侧边栏右侧开始（不覆盖）
   - ✅ Header 宽度正确

2. **双列侧边栏：**
   - ✅ 左列显示一级菜单图标（72px）
   - ✅ 右列显示二级菜单（200px）
   - ✅ 右列总是显示（不受 collapsed 影响）

3. **内容区域：**
   - ✅ 从 272px 开始
   - ✅ 不被侧边栏遮挡

4. **交互：**
   - ✅ 点击左列图标，右列显示对应的二级菜单
   - ✅ 当前选中的一级菜单高亮

## 与 vben-admin 对比

| 项目 | vben-admin | 我们的实现 | 状态 |
|------|-----------|----------|------|
| 左列宽度 | 70-80px | 72px | ✅ |
| 右列宽度 | extraWidth | 200px | ✅ |
| 右列显示 | extraVisible控制 | 总是显示 | ⚠️ 简化版 |
| Header marginLeft | 自动计算 | 272px | ✅ |
| Content marginLeft | 自动计算 | 272px | ✅ |
| Logo 分离 | 图标+文字分离 | ✅ | ✅ |

**注意：** vben-admin 的右列通过 `extraVisible` 控制显示/隐藏，支持鼠标悬停展开等交互。我们的简化实现是右列总是显示。如需完整功能，可以后续添加。

## 相关文件

**已修改：**
- `src/components/layout/LayoutHeader.tsx` - 修复 marginLeft 计算
- `src/layouts/MainLayout.tsx` - 修复右侧菜单显示逻辑和 contentMarginLeft

**参考文件：**
- `vben-admin/packages/@core/ui-kit/layout-ui/src/components/layout-sidebar.vue`
- `vben-admin/packages/@core/ui-kit/layout-ui/src/vben-layout.vue`

## 总结

✅ **修复完成**
- Header 不再覆盖侧边栏
- 双列侧边栏布局正确
- 与 vben-admin 基本一致

⚠️ **未来改进**
- 可以添加右列的展开/收起交互
- 可以添加鼠标悬停展开效果
- 可以优化动画过渡

---

**更新时间：** 2026-01-15
**修复类型：** 布局定位修复
**影响范围：** sidebar-mixed-nav 模式
