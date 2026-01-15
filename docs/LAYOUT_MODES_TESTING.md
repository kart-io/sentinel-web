# 布局模式测试指南

## 测试步骤

1. 启动开发服务器: `npm run dev`
2. 访问 `http://localhost:5174/`
3. 点击右上角的"设置"按钮打开偏好设置抽屉
4. 在"布局模式"部分选择不同的布局

## 7种布局模式说明

### 1. 侧边导航 (sidebar-nav) ✅ 默认
**特点**:
- 左侧固定侧边栏
- 顶部 Header (面包屑 + 工具栏)
- 菜单在左侧垂直排列

**预期效果**:
- ✅ 侧边栏显示在左侧
- ✅ 可以折叠/展开侧边栏
- ✅ 悬停展开功能正常
- ✅ 顶部显示面包屑

### 2. 顶部导航 (header-nav) ✅
**特点**:
- 无侧边栏
- 菜单在顶部 Header 中横向排列
- 全宽布局

**预期效果**:
- ✅ 侧边栏完全隐藏
- ✅ 顶部显示横向菜单
- ✅ 内容区域宽度 100%
- ✅ 切换侧边栏按钮隐藏

### 3. 混合导航 (mixed-nav) ✅
**特点**:
- 顶部 Header 显示一级菜单
- 左侧窄侧边栏显示二级菜单
- 适合多级菜单结构

**预期效果**:
- ✅ 顶部显示一级菜单 (横向)
- ✅ 左侧显示窄版侧边栏
- ✅ 侧边栏宽度使用 `mixedWidth` (80px)
- ✅ Header 和 Tabbar 留出侧边栏空间

### 4. 侧边混合 (sidebar-mixed-nav) 🔧
**特点**:
- 双列侧边栏
- 左侧极窄栏显示图标菜单
- 中间栏显示子菜单
- 适合大型应用

**预期效果**:
- ✅ 左侧显示图标栏 (60px)
- ✅ 中间显示子菜单栏 (180-240px)
- ⚠️  需要实现二级菜单数据结构

### 5. 顶部混合 (header-mixed-nav) 🔧
**特点**:
- 顶部显示主菜单
- 顶部第二行显示子菜单
- 无侧边栏

**预期效果**:
- ✅ 顶部双行菜单
- ✅ 无侧边栏
- ⚠️  需要实现二级菜单数据结构

### 6. 顶部侧边 (header-sidebar-nav) ✅
**特点**:
- 顶部通栏 Header
- 左侧固定侧边栏
- 经典后台布局

**预期效果**:
- ✅ 顶部 Header 全宽
- ✅ 侧边栏在 Header 下方
- ✅ 类似 sidebar-nav 但 Header 更宽

### 7. 全屏内容 (full-content) ✅
**特点**:
- 无侧边栏
- 无 Header
- 无 Tabbar
- 无 Footer
- 纯内容展示

**预期效果**:
- ✅ 只显示 `<Outlet />` 内容
- ✅ 所有布局组件隐藏
- ✅ 适合展示页、打印页

## 当前实现状态

### ✅ 已实现
1. **sidebar-nav** - 完整实现
2. **header-nav** - 完整实现,顶部菜单正常显示
3. **full-content** - 完整实现
4. **mixed-nav** - 基础布局实现
5. **header-sidebar-nav** - 基础布局实现

### 🔧 需要完善
1. **sidebar-mixed-nav** - 需要实现双列侧边栏和二级菜单
2. **header-mixed-nav** - 需要实现顶部双行菜单

## 常见问题排查

### 问题 1: 切换布局后侧边栏还在显示
**原因**: `showSidebar` 计算逻辑问题
**解决**: 检查 `useLayoutComputed` 中的 `showSidebar` 计算

### 问题 2: header-nav 模式没有显示菜单
**原因**: 没有在 Header 区域渲染菜单
**解决**: ✅ 已在 MainLayout 中添加 `{isHeaderNav && <Menu ... />}`

### 问题 3: 混合导航模式布局错乱
**原因**: margin 和 width 计算不正确
**解决**: 检查 `contentMarginLeft` 和 `tabbarMarginLeft` 计算逻辑

### 问题 4: 全屏内容模式还显示 Header
**原因**: 没有提前返回独立的布局
**解决**: ✅ 已在 MainLayout 中添加提前返回逻辑

## 测试清单

### 基础功能测试
- [ ] 切换到每种布局模式
- [ ] 检查侧边栏显示/隐藏
- [ ] 检查菜单显示位置
- [ ] 检查内容区域宽度

### 交互功能测试
- [ ] 折叠/展开侧边栏
- [ ] 悬停展开功能
- [ ] 菜单点击导航
- [ ] 响应式布局 (缩小浏览器窗口)

### 主题切换测试
- [ ] 切换亮色/暗色主题
- [ ] 切换主题色
- [ ] 检查所有布局模式下的主题效果

### 边界情况测试
- [ ] 移动端视口 (< 768px)
- [ ] 超宽视口 (> 1920px)
- [ ] 禁用侧边栏
- [ ] 禁用标签页
- [ ] 禁用面包屑

## 调试技巧

### 1. 查看当前布局状态
```typescript
// 在浏览器控制台执行
const layout = JSON.parse(localStorage.getItem('layout-preferences'));
console.log('当前布局:', layout.app.layout);
console.log('侧边栏配置:', layout.sidebar);
```

### 2. 强制切换布局
```typescript
// 在浏览器控制台执行
const { useLayoutStore } = await import('./src/store/layoutStore');
useLayoutStore.getState().setLayout('header-nav');
```

### 3. 查看计算属性
```typescript
// 在组件中添加
const computed = useLayoutComputed();
console.log('布局计算属性:', computed);
```

## 下一步改进

1. **实现二级菜单**
   - 添加菜单数据的 children 字段
   - 实现 sidebar-mixed-nav 的双栏显示
   - 实现 header-mixed-nav 的双行显示

2. **添加动画过渡**
   - 布局切换时的平滑过渡
   - 侧边栏展开/折叠动画优化

3. **持久化优化**
   - 保存每个布局模式的独立配置
   - 切换布局时自动应用对应配置

4. **响应式优化**
   - 移动端自动切换到合适的布局
   - 平板设备的特殊适配

## 参考截图位置

建议为每种布局模式截图保存到:
```
/screenshots/layout-modes/
  - sidebar-nav.png
  - header-nav.png
  - mixed-nav.png
  - sidebar-mixed-nav.png
  - header-mixed-nav.png
  - header-sidebar-nav.png
  - full-content.png
```

---

**更新日期**: 2026-01-14
**状态**: 基础布局已实现,部分高级模式需要完善
