# 🚀 布局模式快速参考

## 访问测试页面
```
菜单路径: 系统管理 -> 布局测试
直接访问: http://localhost:5173/layout-test
```

## 7 种布局模式速查

### 1️⃣ sidebar-nav (默认推荐)
```
🎯 左侧垂直菜单
📌 适合: 经典后台管理系统
✨ 特性: 可折叠、悬停展开
```

### 2️⃣ header-nav (简洁)
```
🎯 顶部横向菜单
📌 适合: 菜单项较少的应用
✨ 特性: 全宽布局、响应式
```

### 3️⃣ mixed-nav (两级联动)
```
🎯 顶部一级 + 侧边二级
📌 适合: 菜单层级深的应用
✨ 特性: 动态联动、模块清晰
```

### 4️⃣ sidebar-mixed-nav (空间高效)
```
🎯 双列侧边栏 (图标+菜单)
📌 适合: 空间受限但菜单多
✨ 特性: 左窄(72px) + 右宽(200px)
```

### 5️⃣ header-mixed-nav (宽屏优化)
```
🎯 顶部双行菜单
📌 适合: 宽屏显示器
✨ 特性: 无侧边栏、顶部集中
```

### 6️⃣ header-sidebar-nav (经典企业)
```
🎯 全宽顶部 + 侧边栏
📌 适合: 需要统一品牌区域
✨ 特性: Header 不分割、独立区域
```

### 7️⃣ full-content (沉浸式)
```
🎯 纯内容展示
📌 适合: 数据大屏、全屏演示
✨ 特性: 无任何导航元素
```

## 快速切换代码

```typescript
import { useLayoutStore } from '@/store/layoutStore';

// 获取切换函数
const setLayout = useLayoutStore((state) => state.setLayout);

// 切换到不同布局
setLayout('sidebar-nav');      // 默认布局
setLayout('header-nav');       // 顶部菜单
setLayout('mixed-nav');        // 混合导航
setLayout('sidebar-mixed-nav'); // 双列侧边
setLayout('header-mixed-nav');  // 双行顶部
setLayout('header-sidebar-nav');// 全宽顶部
setLayout('full-content');     // 全屏内容
```

## 常用功能

### 切换主题
```typescript
const toggleThemeMode = useLayoutStore((state) => state.toggleThemeMode);
toggleThemeMode(); // 亮色 ↔ 暗色
```

### 折叠侧边栏
```typescript
const toggleSidebarCollapse = useLayoutStore((state) => state.toggleSidebarCollapse);
toggleSidebarCollapse();
```

### 切换标签页
```typescript
const toggleTabbar = useLayoutStore((state) => state.toggleTabbar);
toggleTabbar();
```

### 切换页脚
```typescript
const toggleFooter = useLayoutStore((state) => state.toggleFooter);
toggleFooter();
```

## 获取布局状态

```typescript
import { useLayoutStore, useLayoutComputed } from '@/store/layoutStore';

// 基础状态
const layout = useLayoutStore((state) => state.app.layout);
const collapsed = useLayoutStore((state) => state.sidebar.collapsed);

// 计算属性
const {
  isMixedNav,
  isHeaderNav,
  showSidebar,
  isDarkMode,
  sidebarWidth,
} = useLayoutComputed();
```

## 文件位置

| 文件 | 路径 |
|------|------|
| 布局组件 | `/src/layouts/MainLayout.tsx` |
| 状态管理 | `/src/store/layoutStore.ts` |
| 菜单配置 | `/src/config/menuConfig.tsx` |
| 测试页面 | `/src/features/layout-demo/LayoutTestPage.tsx` |
| 完整文档 | `/docs/COMPLETE_LAYOUT_MODES.md` |
| 实现总结 | `/docs/LAYOUT_IMPLEMENTATION_SUMMARY.md` |

## 测试清单

- [ ] 切换所有 7 种布局模式
- [ ] 侧边栏折叠/展开
- [ ] 主题切换（暗色/亮色）
- [ ] 标签页开关
- [ ] 页脚开关
- [ ] 响应式（调整浏览器窗口）
- [ ] 菜单导航
- [ ] 面包屑导航
- [ ] 配置持久化（刷新页面）

## 快速故障排除

### 问题：布局切换无效
```bash
# 清除缓存
localStorage.clear()
# 刷新页面
```

### 问题：菜单不显示
```bash
# 检查路由配置
/src/router/index.tsx
# 检查菜单配置
/src/config/menuConfig.tsx
```

### 问题：样式异常
```bash
# 检查 Tailwind 配置
tailwind.config.js
# 检查全局样式
/src/index.css
```

## 性能提示

✅ 使用 `useLayoutComputed` 获取计算属性
✅ 避免频繁切换布局模式
✅ 合理使用标签页缓存
✅ 菜单层级不超过 3 级

## 最佳实践

1. **选择合适的布局**
   - 管理系统：`sidebar-nav`
   - 简单应用：`header-nav`
   - 复杂应用：`mixed-nav`

2. **优化菜单结构**
   - 一级：模块分类 (5-8 个)
   - 二级：具体功能 (3-6 个)

3. **响应式考虑**
   - 移动端体验
   - 触控优化
   - 自动适配

---

**🎉 所有布局模式已完整实现！立即访问 `/layout-test` 体验！**
