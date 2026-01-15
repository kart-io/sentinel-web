# 布局模式调试指南

## 问题说明

用户报告：偏好设置中选择的布局模式与实际显示的布局不一致。

## 调试工具

### 1. 布局调试信息组件

在偏好设置抽屉中添加了实时的布局状态调试信息，显示：

- **Store 状态**: `app.layout` 的实际值
- **计算标志**: 当前激活的布局标志名称
- **侧边栏状态**: `showSidebar` 是否显示
- **顶部菜单状态**: `showHeaderMenu` 是否显示
- **所有标志**: 展开查看所有布局标志的状态

### 2. 如何使用

1. 打开应用：http://localhost:5174
2. 点击右上角的设置图标
3. 在"布局模式"部分可以看到调试信息卡片
4. 点击展开"所有标志"查看详细信息

### 3. 诊断步骤

#### 步骤 1：检查 Store 值
查看调试信息中的 `Store:` 值，这是实际保存在 layoutStore 中的布局模式。

**预期**：应该与你选择的布局模式一致

**如果不一致**：
- localStorage 可能被清除
- persist 中间件配置有问题
- 状态更新没有正确保存

#### 步骤 2：检查计算标志
查看 `计算标志:` 的值，这是 useLayoutComputed 钩子返回的布局标志。

**预期**：应该对应当前的布局模式
- `sidebar-nav` → `isSidebarNav`
- `header-nav` → `isHeaderNav`
- `mixed-nav` → `isMixedNav`
- `sidebar-mixed-nav` → `isSidebarMixedNav`
- `header-mixed-nav` → `isHeaderMixedNav`
- `header-sidebar-nav` → `isHeaderSidebarNav`
- `full-content` → `isFullContent`

**如果不一致**：
- useLayoutComputed 逻辑有问题
- state.app.layout 读取错误

#### 步骤 3：检查显示标志
查看 `showSidebar` 和 `showHeaderMenu` 的状态。

**预期行为**：
| 布局模式 | showSidebar | showHeaderMenu |
|---------|-------------|----------------|
| sidebar-nav | ✅ | ❌ |
| header-nav | ❌ | ✅ |
| mixed-nav | ✅ | ✅ |
| sidebar-mixed-nav | ✅ | ❌ |
| header-mixed-nav | ❌ | ✅ |
| header-sidebar-nav | ✅ | ❌ |
| full-content | ❌ | ❌ |

**如果不一致**：
- useLayoutComputed 的条件逻辑有问题
- MainLayout 的渲染逻辑可能错误

#### 步骤 4：检查 localStorage
打开浏览器控制台（F12），运行：

```javascript
const prefs = JSON.parse(localStorage.getItem('layout-preferences'));
console.log('Layout preferences:', prefs);
console.log('Current layout:', prefs?.state?.app?.layout);
```

**预期**：应该能看到完整的偏好设置对象，且 `app.layout` 的值正确。

**如果看不到**：
- localStorage 被禁用
- persist 配置的 name 不正确
- 状态没有正确持久化

## 常见问题和解决方案

### 问题 1：选择布局后没有变化

**症状**：
- Store 值正确
- 但页面布局没有变化

**原因**：MainLayout 的条件渲染逻辑没有正确响应状态变化

**解决方案**：
检查 MainLayout.tsx 中的布局渲染逻辑，确保正确使用了 useLayoutComputed 的标志。

### 问题 2：刷新后布局恢复默认

**症状**：
- 选择布局后正常显示
- 刷新页面后恢复为默认的 sidebar-nav

**原因**：persist 中间件没有正确保存状态

**解决方案**：
1. 检查 layoutStore.ts 中的 persist 配置
2. 确认 localStorage 没有被清除
3. 检查 partialize 是否包含 app.layout

### 问题 3：Store 值和显示不一致

**症状**：
- Store 显示为 `mixed-nav`
- 但计算标志显示为 `isSidebarNav`

**原因**：useLayoutComputed 的逻辑有问题

**解决方案**：
检查 layoutStore.ts 中 useLayoutComputed 的实现：

```typescript
export const useLayoutComputed = () => {
  const state = useLayoutStore();

  const isFullContent = state.app.layout === 'full-content';
  const isSidebarNav = state.app.layout === 'sidebar-nav';
  const isHeaderNav = state.app.layout === 'header-nav';
  const isMixedNav = state.app.layout === 'mixed-nav';
  const isSidebarMixedNav = state.app.layout === 'sidebar-mixed-nav';
  const isHeaderMixedNav = state.app.layout === 'header-mixed-nav';
  const isHeaderSidebarNav = state.app.layout === 'header-sidebar-nav';

  // 确保所有比较都是严格相等
  // ...
};
```

### 问题 4：所有标志都是 ❌

**症状**：
- Store 有值
- 但所有布局标志都是 false

**原因**：useLayoutComputed 没有正确执行或返回

**解决方案**：
1. 检查是否正确导入 useLayoutComputed
2. 确认组件在 Zustand Provider 内部
3. 检查 useLayoutComputed 的返回值结构

## 修复检查清单

完成以下检查来诊断和修复问题：

- [ ] 1. 打开偏好设置，查看调试信息
- [ ] 2. 确认 Store 值与选择的布局一致
- [ ] 3. 确认计算标志正确对应布局模式
- [ ] 4. 检查 showSidebar 和 showHeaderMenu 的值符合预期
- [ ] 5. 在控制台验证 localStorage 中的数据
- [ ] 6. 切换不同布局模式，观察调试信息变化
- [ ] 7. 刷新页面，确认布局保持不变
- [ ] 8. 检查所有7种布局模式是否都能正确显示

## 代码位置

### 相关文件

1. **PreferencesDrawer.tsx** - 布局选择器和调试信息
   - `LayoutSelector` - 布局模式选择器
   - `LayoutDebugInfo` - 调试信息组件

2. **layoutStore.ts** - 状态管理
   - `useLayoutStore` - Zustand store
   - `useLayoutComputed` - 计算属性钩子
   - `setLayout` - 设置布局模式方法

3. **MainLayout.tsx** - 布局渲染
   - 根据 useLayoutComputed 的标志条件渲染不同布局

### 关键代码片段

#### 布局选择

```typescript
const layout = useLayoutStore((state) => state.app.layout);
const setLayout = useLayoutStore((state) => state.setLayout);

// 切换布局
setLayout('mixed-nav');
```

#### 调试信息

```typescript
const {
  isFullContent,
  isSidebarNav,
  isHeaderNav,
  isMixedNav,
  // ...
} = useLayoutComputed();
```

## 下一步

### 如果调试信息显示正常

说明状态管理正确，问题可能在 MainLayout 的渲染逻辑。

**行动**：
1. 检查 MainLayout.tsx 的条件渲染分支
2. 确认每个布局标志都有对应的渲染逻辑
3. 验证 CSS 和组件显示没有被其他样式覆盖

### 如果调试信息显示异常

说明状态管理有问题。

**行动**：
1. 检查 layoutStore.ts 的 persist 配置
2. 验证 useLayoutComputed 的逻辑
3. 测试 setLayout 方法是否正确更新状态
4. 检查 localStorage 的读写权限

## 移除调试信息

修复问题后，如果不再需要调试信息，可以：

1. **保留**：调试信息对开发和用户都有帮助
2. **仅开发环境显示**：
   ```typescript
   {process.env.NODE_ENV === 'development' && <LayoutDebugInfo />}
   ```
3. **完全移除**：
   - 删除 `<LayoutDebugInfo />` 组件调用
   - 删除 `LayoutDebugInfo` 组件定义

## 总结

通过添加布局调试信息组件，现在可以实时查看：
- 当前选择的布局模式（Store 值）
- 计算的布局标志
- 显示状态标志
- 所有布局标志的详细状态

这些信息可以帮助快速定位布局模式不一致的问题根源。
