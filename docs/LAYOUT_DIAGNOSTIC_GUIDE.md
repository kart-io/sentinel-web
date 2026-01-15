# 布局问题诊断工具使用指南

## 问题现状

用户报告：偏好设置中选择的布局模式与实际显示的布局不一致。

## 诊断工具

### 1. 浏览器内调试信息

**位置**：偏好设置抽屉 → 布局模式部分

**显示内容**：
- Store 值
- 计算标志
- showSidebar 状态
- showHeaderMenu 状态
- 所有布局标志详情

**使用方法**：
1. 打开应用
2. 点击右上角设置图标⚙️
3. 查看"布局模式"下方的蓝色调试信息卡片
4. 点击"在控制台打印详细信息"按钮

### 2. 完整诊断脚本

**位置**：`diagnose-layout.js`

**功能**：
- 检查 localStorage 状态
- 计算所有布局标志
- 检查 DOM 元素
- 对比预期 vs 实际
- 自动诊断问题

**使用方法**：

#### 方法 A：在浏览器控制台直接运行

```javascript
// 复制 diagnose-layout.js 的内容到浏览器控制台运行
```

#### 方法 B：作为脚本加载

```javascript
// 在浏览器控制台运行
const script = document.createElement('script');
script.src = '/diagnose-layout.js';
document.head.appendChild(script);
```

## 诊断步骤

### 步骤 1：查看调试信息

1. 打开偏好设置
2. 查看调试信息卡片
3. 记录以下信息：
   - Store 值（如：`sidebar-nav`）
   - 计算标志（如：`isSidebarNav`）
   - showSidebar 状态
   - showHeaderMenu 状态

### 步骤 2：运行诊断脚本

1. 打开浏览器控制台（F12）
2. 复制并运行 `diagnose-layout.js` 的内容
3. 查看诊断结果

### 步骤 3：分析诊断结果

诊断脚本会输出以下信息：

```
=== 布局诊断开始 ===

1. LocalStorage 状态:
  - app.layout: sidebar-nav
  - sidebar.hidden: false
  - sidebar.collapsed: false
  - header.enable: true
  - tabbar.enable: true

2. 计算的布局标志:
  ✅ isSidebarNav: true
  ❌ isHeaderNav: false
  ...

3. 显示逻辑:
  showSidebar: ✅
  showHeaderMenu: ❌

4. DOM 元素检查:
  - Sidebar DOM: ✅ 存在
    宽度: 210px
    Z-Index: 150
  - Header DOM: ✅ 存在
    高度: 48px
    Z-Index: auto
  ...

5. 预期 vs 实际对比:
  布局模式: sidebar-nav
  预期 Sidebar: ✅
  实际 Sidebar: ✅
  ✅ 匹配

6. 问题诊断:
  ✅ 未发现问题！布局显示正确。

=== 布局诊断结束 ===
```

## 常见问题诊断

### 问题 1：Store 值不正确

**症状**：
```
1. LocalStorage 状态:
  - app.layout: undefined 或 错误的值
```

**原因**：
- localStorage 被清除
- persist 配置有问题
- 首次访问，没有保存过偏好设置

**解决方案**：
1. 在偏好设置中重新选择布局模式
2. 刷新页面验证是否持久化

### 问题 2：计算标志不正确

**症状**：
```
2. 计算的布局标志:
  ❌ 所有标志都是 false
```

**原因**：
- useLayoutComputed 逻辑有问题
- state.app.layout 值不在预期范围内

**解决方案**：
检查 layoutStore.ts 中的 useLayoutComputed 实现

### 问题 3：showSidebar 计算错误

**症状**：
```
3. 显示逻辑:
  showSidebar: ❌  (但预期应该是 ✅)
```

**原因**：
- showSidebar 的计算逻辑不正确
- sidebar.hidden 被意外设置为 true

**解决方案**：
检查 layoutStore.ts:424-428 的 showSidebar 计算逻辑

### 问题 4：DOM 元素不存在

**症状**：
```
4. DOM 元素检查:
  - Sidebar DOM: ❌ 不存在  (但应该存在)
```

**原因**：
- MainLayout 的条件渲染逻辑有问题
- LayoutSidebar 组件没有正确渲染

**解决方案**：
检查 MainLayout.tsx:496-505 的侧边栏渲染逻辑

### 问题 5：预期与实际不匹配

**症状**：
```
5. 预期 vs 实际对比:
  预期 Sidebar: ✅
  实际 Sidebar: ❌
  ❌ 不匹配
```

**原因**：
综合性问题，需要逐个排查上述可能的原因

## 修复验证清单

完成修复后，运行诊断脚本，确认：

- [ ] LocalStorage 状态正确
  - [ ] app.layout 值正确
  - [ ] sidebar.hidden 为 false（如果需要显示侧边栏）
  - [ ] header.enable 为 true

- [ ] 计算标志正确
  - [ ] 只有一个布局标志为 true
  - [ ] 布局标志与 app.layout 对应

- [ ] 显示逻辑正确
  - [ ] showSidebar 符合预期
  - [ ] showHeaderMenu 符合预期

- [ ] DOM 元素正确
  - [ ] 该显示的元素存在
  - [ ] 不该显示的元素不存在

- [ ] 预期与实际匹配
  - [ ] Sidebar 匹配
  - [ ] Header Menu 匹配

- [ ] 问题诊断
  - [ ] 未发现问题 ✅

## 提交问题报告

如果诊断后仍有问题，请提交以下信息：

1. **诊断脚本完整输出**
   ```
   复制控制台的完整诊断结果
   ```

2. **截图**
   - 当前页面显示
   - 偏好设置中的选择
   - 调试信息卡片

3. **操作步骤**
   - 选择了什么布局模式
   - 预期看到什么
   - 实际看到什么

4. **浏览器信息**
   - 浏览器类型和版本
   - 操作系统

## 开发者调试

### 在代码中添加日志

在 MainLayout.tsx 中添加调试日志：

```typescript
useEffect(() => {
  console.log('[MainLayout] Layout State:', {
    layout: app.layout,
    showSidebar,
    showHeaderMenu,
    isSidebarNav,
    isHeaderNav,
    // ... 其他标志
  });
}, [
  app.layout,
  showSidebar,
  showHeaderMenu,
  // ... 其他依赖
]);
```

### 断点调试

在以下位置设置断点：

1. **layoutStore.ts:424** - showSidebar 计算
2. **MainLayout.tsx:498** - 侧边栏渲染条件
3. **LayoutSidebar.tsx:89** - 侧边栏显示判断

### 性能监控

检查是否有不必要的重新渲染：

```javascript
// 在浏览器控制台运行
performance.mark('layout-render-start');
// 切换布局模式
setTimeout(() => {
  performance.mark('layout-render-end');
  performance.measure('layout-render', 'layout-render-start', 'layout-render-end');
  console.log(performance.getEntriesByName('layout-render'));
}, 1000);
```

## 总结

通过使用这些诊断工具，可以快速定位布局显示问题的根源：

1. **调试信息卡片**：快速查看当前状态
2. **诊断脚本**：全面检查所有相关信息
3. **控制台日志**：实时监控状态变化
4. **断点调试**：深入分析代码执行

如果诊断后仍无法解决问题，请提交完整的诊断结果给开发团队。
