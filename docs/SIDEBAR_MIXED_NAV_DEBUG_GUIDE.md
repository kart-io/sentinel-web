# sidebar-mixed-nav 交互调试指南

## 问题描述

用户反馈：**无法点击隐藏菜单栏**

从截图看到，左侧只显示了60px宽的图标列，右侧菜单没有显示。点击左侧图标时，右侧菜单没有反应。

## 调试步骤

### 1. 打开浏览器控制台

**Chrome/Edge:** `F12` 或 `Ctrl + Shift + I`
**Firefox:** `F12`

### 2. 硬刷新页面

```
Ctrl + Shift + R
```

### 3. 切换到 sidebar-mixed-nav 模式

通过偏好设置或直接访问 `/layout-modes` 页面切换。

### 4. 查看控制台输出

#### 初始加载时应该看到：
```
🔔 sidebarMixedRightVisible 状态变化: true
📍 当前模式: { isSidebarMixedNav: true, showSidebar: false }
🎨 渲染检查 - sidebarMixedRightVisible: true
```

**检查点：**
- ✅ `sidebarMixedRightVisible` 应该是 `true`
- ✅ `isSidebarMixedNav` 应该是 `true`
- ✅ 应该有 "🎨 渲染检查" 的日志（说明右侧菜单正在渲染）

#### 点击左侧图标时应该看到：
```
=== Sidebar Top Menu Click ===
Clicked key: dashboard (或其他 key)
Current selectedTopMenu: dashboard
Current sidebarMixedRightVisible: true
→ 点击当前菜单，切换显示/隐藏
🔔 sidebarMixedRightVisible 状态变化: false
🎨 渲染检查 - sidebarMixedRightVisible: false (不应该有这行)
```

**检查点：**
- ✅ 应该有 "=== Sidebar Top Menu Click ===" 日志（说明点击被触发）
- ✅ 状态应该切换（`true` → `false` 或 `false` → `true`）
- ✅ 切换到 `false` 时，不应该再有 "🎨 渲染检查" 的日志

### 5. 可能的问题和解决方案

#### 问题 1：没有 "=== Sidebar Top Menu Click ===" 日志

**原因：** 点击事件没有被触发

**检查：**
1. 左侧菜单是否正确渲染？
   ```javascript
   // 在控制台运行
   document.querySelector('.ant-menu-inline')
   ```
   应该返回一个 Menu 元素

2. Menu 是否有点击事件？
   ```javascript
   // 在控制台运行
   const menu = document.querySelector('.ant-menu-inline');
   console.log('Menu 元素:', menu);
   console.log('Menu items:', menu?.querySelectorAll('.ant-menu-item'));
   ```

3. 尝试手动触发点击：
   ```javascript
   // 在控制台运行
   const firstItem = document.querySelector('.ant-menu-item');
   firstItem?.click();
   ```

#### 问题 2：有点击日志，但状态没有变化

**原因：** 状态更新被阻止或条件判断有问题

**检查：**
1. 查看 `Clicked key` 和 `selectedTopMenu` 是否匹配
2. 确认进入了哪个分支（"点击当前菜单" 还是 "切换到新菜单"）

#### 问题 3：状态变化了，但 UI 没有更新

**原因：** 渲染条件有问题或 React 没有重新渲染

**检查：**
1. 查看是否有 "🎨 渲染检查" 日志
2. 检查 `sidebarMixedRightVisible` 的值
3. 查看 DOM 中是否有右侧菜单元素：
   ```javascript
   // 在控制台运行
   const rightMenu = document.querySelector('[style*="left: 60px"][style*="width: 180px"]');
   console.log('右侧菜单元素:', rightMenu);
   ```

#### 问题 4：初始加载时右侧菜单就是隐藏的

**原因：** 初始状态或条件渲染有问题

**检查：**
1. 初始加载时 `sidebarMixedRightVisible` 应该是 `true`
2. 检查 `isSidebarMixedNav` 是否为 `true`
3. 确认外层条件判断：
   ```tsx
   {isSidebarMixedNav ? (
     // 双列侧边栏
     <>
       {/* 左列 */}
       <Sider ... />
       {/* 右列 */}
       {sidebarMixedRightVisible && <div ... />}
     </>
   ) : (
     // 其他模式
   )}
   ```

### 6. 检查菜单项配置

```javascript
// 在控制台运行
console.log('Top level menu items:');
document.querySelectorAll('.ant-menu-item').forEach((item, i) => {
  console.log(`Item ${i}:`, {
    key: item.getAttribute('data-menu-id'),
    text: item.textContent,
    hasClickHandler: item.onclick !== null
  });
});
```

### 7. 手动测试状态切换

```javascript
// 在控制台运行 - 手动切换状态
// 注意：这需要访问 React 内部状态，可能不总是有效

// 查找 React Fiber
const findReactFiber = (dom) => {
  const key = Object.keys(dom).find(key => key.startsWith('__reactFiber'));
  return dom[key];
};

const sider = document.querySelector('.ant-layout-sider');
const fiber = findReactFiber(sider);
console.log('React Fiber:', fiber);
```

## 预期行为

### 正常流程

1. **初始加载**
   - 左列显示（60px）
   - 右列显示（180px）
   - 总宽度 240px

2. **首次点击当前菜单图标**
   - 控制台日志：点击事件触发
   - 状态切换：`true` → `false`
   - UI 变化：右列隐藏
   - 内容区域：向左扩展（marginLeft: 240px → 60px）

3. **再次点击（或点击其他图标）**
   - 控制台日志：点击事件触发
   - 状态切换：`false` → `true`
   - UI 变化：右列显示
   - 内容区域：缩回（marginLeft: 60px → 240px）

## 可能的 Bug

### Bug 1：Menu items 没有 key

如果菜单项没有正确的 key，点击事件可能无法正确识别。

**检查 `getIconOnlyMenuItems()`：**
```tsx
const getIconOnlyMenuItems = () => {
  return topLevelMenuItems?.map((item: any) => ({
    key: item.key,  // ✅ 必须有 key
    icon: item.icon,
    label: '',
    title: item.label,
  }));
};
```

### Bug 2：selectedKeys 不匹配

如果 `selectedKeys={[selectedTopMenu]}` 中的值与菜单项的 key 不匹配，可能导致问题。

**检查：**
```javascript
// 在控制台运行
console.log('selectedTopMenu:', 'dashboard'); // 应该是实际的值
console.log('Menu keys:', Array.from(document.querySelectorAll('.ant-menu-item')).map(item => item.getAttribute('data-menu-id')));
```

### Bug 3：事件冒泡被阻止

如果某个父元素阻止了事件冒泡，点击可能无法到达 Menu。

**检查：**
查看是否有其他元素覆盖在菜单上方：
```javascript
// 在控制台运行
const menuItem = document.querySelector('.ant-menu-item');
const rect = menuItem.getBoundingClientRect();
const elementAtPoint = document.elementFromPoint(rect.x + rect.width/2, rect.y + rect.height/2);
console.log('点击位置的元素:', elementAtPoint);
console.log('是否是菜单项:', elementAtPoint === menuItem || menuItem.contains(elementAtPoint));
```

## 快速诊断脚本

复制并在控制台运行：

```javascript
// 🔍 sidebar-mixed-nav 快速诊断
console.clear();
console.log('=== sidebar-mixed-nav 诊断 ===\n');

// 1. 检查模式
const layoutStore = window.__LAYOUT_STORE__; // 如果有的话
console.log('1. 布局模式检查');
console.log('   - 应该是 sidebar-mixed-nav 模式');

// 2. 检查左侧菜单
const leftMenu = document.querySelector('[style*="width: 60px"] .ant-menu-inline');
console.log('\n2. 左侧菜单检查');
console.log('   - 找到菜单元素:', !!leftMenu);
console.log('   - 菜单项数量:', leftMenu?.querySelectorAll('.ant-menu-item').length);

// 3. 检查右侧菜单
const rightMenu = document.querySelector('[style*="left: 60px"][style*="width: 180px"]');
console.log('\n3. 右侧菜单检查');
console.log('   - 找到菜单元素:', !!rightMenu);
console.log('   - 是否可见:', rightMenu ? getComputedStyle(rightMenu).display !== 'none' : false);

// 4. 测试点击
console.log('\n4. 点击测试');
const firstMenuItem = leftMenu?.querySelector('.ant-menu-item');
if (firstMenuItem) {
  console.log('   - 找到第一个菜单项:', firstMenuItem.textContent);
  console.log('   - 尝试点击...');
  firstMenuItem.click();
  console.log('   - 点击完成，查看上方是否有点击日志');
} else {
  console.log('   - ❌ 未找到菜单项');
}

console.log('\n=== 诊断完成 ===');
console.log('请查看上方日志和控制台是否有新的调试信息');
```

## 下一步

根据控制台输出，将结果反馈给我：

1. 初始加载时的日志
2. 点击菜单项时的日志
3. 快速诊断脚本的输出
4. 是否看到右侧菜单（即使没有内容）

这将帮助我准确定位问题所在。
