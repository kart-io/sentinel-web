# 字体大小设置功能文档

## 概述

在偏好设置中添加了全局字体大小控制功能，允许用户自定义应用程序的字体大小（12-18px），提升可访问性和用户体验。

## 功能特性

### 1. 字体大小范围
- **最小值**: 12px
- **默认值**: 14px
- **最大值**: 18px
- 通过滑块控件实现平滑调整

### 2. 全局应用
字体大小设置影响以下所有组件和库：
- **CSS 变量**: `--font-size-base`, `--font-size-sm`, `--font-size-lg`
- **Ant Design**: 所有 Ant Design 组件
- **MUI (Material-UI)**: 所有 MUI 组件
- **自定义组件**: 通过 CSS 变量继承

### 3. 响应式调整
- 实时预览：滑动滑块立即生效
- 自动缓存：设置自动保存到 localStorage
- 主题联动：与主题模式（亮色/暗色）完美配合

## 技术实现

### 1. Store 配置 (`layoutStore.ts`)

```typescript
interface ThemePreferences {
  mode: ThemeMode;
  colorPrimary: string;
  colorPrimaryKey: ThemeColorKey;
  radius: number;
  semiDarkSidebar: boolean;
  semiDarkHeader: boolean;
  fontSize: number; // 新增字体大小配置
}

const defaultPreferences = {
  // ...
  theme: {
    // ...
    fontSize: 14, // 默认 14px
  },
};
```

### 2. CSS 变量系统 (`themeProvider.ts`)

定义了三个字体大小相关的 CSS 变量：

```typescript
interface CSSVariables {
  // ...
  '--font-size-base': string;   // 基础字体大小
  '--font-size-sm': string;     // 小号字体 (fontSize - 2)
  '--font-size-lg': string;     // 大号字体 (fontSize + 2)
  // ...
}
```

应用逻辑：

```typescript
const lightThemeVariables = (primaryColor: string, radius: number, fontSize: number) => ({
  // ...
  '--font-size-base': `${fontSize}px`,
  '--font-size-sm': `${fontSize - 2}px`,
  '--font-size-lg': `${fontSize + 2}px`,
});
```

### 3. Ant Design 集成

在 `useAntdThemeConfig` 中应用字体大小：

```typescript
export function useAntdThemeConfig() {
  const theme = useLayoutStore((state) => state.theme);

  return {
    token: {
      fontSize: theme.fontSize, // 应用到 Ant Design token
      // ...
    },
    components: {
      Menu: {
        fontSize: theme.fontSize, // 菜单字体大小
        // ...
      },
      // ...
    },
  };
}
```

### 4. MUI 集成 (`muiTheme.ts`)

动态创建 MUI 主题时传递字体大小参数：

```typescript
export const createMuiTheme = (
  mode: 'light' | 'dark',
  fontSize: number = 14,
  borderRadius: number = 6
): Theme => {
  return createTheme({
    typography: {
      fontSize, // 基础字体大小
      h1: {
        fontSize: `${fontSize * 2.5 / 14}rem`, // 相对于 fontSize 计算
        fontWeight: 600,
      },
      // ... 其他标题层级
    },
    // ...
  });
};
```

在 `App.tsx` 中应用：

```typescript
function App() {
  const fontSize = useLayoutStore((state) => state.theme.fontSize);
  const borderRadius = useLayoutStore((state) => state.theme.radius);

  const muiTheme = useMemo(() => {
    return createMuiTheme(isDark ? 'dark' : 'light', fontSize, borderRadius);
  }, [isDark, fontSize, borderRadius]);

  return (
    <ThemeProvider theme={muiTheme}>
      {/* ... */}
    </ThemeProvider>
  );
}
```

### 5. UI 控件 (`PreferencesDrawer.tsx`)

在偏好设置抽屉中添加字体大小滑块：

```tsx
{/* 字体大小 */}
<section>
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-gray-600 dark:text-gray-400">字体大小</span>
    <span className="text-xs text-gray-400">{theme.fontSize}px</span>
  </div>
  <Slider
    min={12}
    max={18}
    value={theme.fontSize}
    onChange={(value) => updateTheme({ fontSize: value })}
  />
</section>
```

## 使用方式

### 用户操作流程

1. 点击页面右上角的**设置图标**（齿轮图标）
2. 在偏好设置抽屉中找到**"字体大小"**部分
3. 使用滑块调整字体大小（12-18px）
4. 实时预览效果
5. 关闭抽屉，设置自动保存

### 编程方式

直接通过 store 更新：

```typescript
import { useLayoutStore } from '@/store/layoutStore';

function MyComponent() {
  const updateTheme = useLayoutStore((state) => state.updateTheme);

  const handleFontSizeChange = (size: number) => {
    updateTheme({ fontSize: size });
  };

  return (
    <button onClick={() => handleFontSizeChange(16)}>
      设置为 16px
    </button>
  );
}
```

## 影响范围

### 1. 直接影响的组件
- Ant Design 所有组件（Button, Menu, Input, Table 等）
- MUI 所有组件（Button, Card, Typography 等）
- 自定义组件（使用 CSS 变量的组件）

### 2. 字体大小映射

| 设置值 | --font-size-base | --font-size-sm | --font-size-lg |
|--------|------------------|----------------|----------------|
| 12px   | 12px             | 10px           | 14px           |
| 14px   | 14px             | 12px           | 16px           |
| 16px   | 16px             | 14px           | 18px           |
| 18px   | 18px             | 16px           | 20px           |

### 3. MUI Typography 层级

基于 14px 基准的相对计算：

```typescript
h1: fontSize * 2.5 / 14 rem
h2: fontSize * 2.0 / 14 rem
h3: fontSize * 1.75 / 14 rem
h4: fontSize * 1.5 / 14 rem
h5: fontSize * 1.25 / 14 rem
h6: fontSize * 1.0 / 14 rem
```

例如，当 `fontSize = 16px` 时：
- h1: `2.857rem` (约 45.7px)
- h2: `2.286rem` (约 36.6px)
- body: `16px`

## 兼容性

### 浏览器支持
- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

### UI 库兼容
- ✅ Ant Design 5.x
- ✅ Material-UI 5.x
- ✅ Tailwind CSS 3.x/4.x

## 可访问性

### WCAG 合规
- 支持用户自定义字体大小，符合 WCAG 2.1 AA 级标准
- 字体大小范围 (12-18px) 涵盖大多数用户需求
- 与高对比度模式（暗色主题）配合使用

### 建议使用场景
- **12-13px**: 空间受限的界面
- **14px**: 标准桌面应用（默认）
- **15-16px**: 长时间阅读场景
- **17-18px**: 视力辅助需求

## 性能优化

### 1. 批量更新
使用单次 store 更新触发所有组件重新渲染，避免多次 re-render：

```typescript
updateTheme({ fontSize: 16 }); // 一次更新影响所有组件
```

### 2. useMemo 优化
MUI 主题使用 `useMemo` 缓存，仅在 `fontSize` 变化时重新创建：

```typescript
const muiTheme = useMemo(() => {
  return createMuiTheme(isDark ? 'dark' : 'light', fontSize, borderRadius);
}, [isDark, fontSize, borderRadius]);
```

### 3. CSS 变量优势
CSS 变量实时更新，无需重新编译样式表，性能优异。

## 调试技巧

### 检查当前字体大小

在浏览器控制台运行：

```javascript
// 检查 CSS 变量
getComputedStyle(document.documentElement).getPropertyValue('--font-size-base');

// 检查 store 值
window.__LAYOUT_STORE__.getState().theme.fontSize;
```

### 验证 Ant Design 应用

```javascript
// 检查 Ant Design token
document.querySelector('.ant-btn')?.style.fontSize;
```

### 验证 MUI 应用

```javascript
// 检查 MUI Typography
document.querySelector('.MuiTypography-root')?.style.fontSize;
```

## 常见问题

### Q1: 某些组件字体大小没有改变？
**A**: 检查该组件是否使用了内联样式覆盖。确保组件使用 CSS 变量或从 theme token 读取字体大小。

### Q2: 字体大小在页面刷新后丢失？
**A**: 检查浏览器 localStorage 是否被禁用。字体大小设置会自动持久化到 localStorage。

### Q3: 如何为特定组件设置不同的字体大小？
**A**: 可以使用 CSS 变量的相对值：

```css
.my-component {
  font-size: var(--font-size-lg); /* 使用大号字体 */
}

.my-small-text {
  font-size: var(--font-size-sm); /* 使用小号字体 */
}
```

### Q4: 字体大小与响应式设计如何配合？
**A**: 可以在媒体查询中覆盖：

```css
@media (max-width: 768px) {
  :root {
    --font-size-base: 12px; /* 移动端强制使用小字体 */
  }
}
```

## 后续优化建议

### 1. 字体大小预设
添加快捷预设按钮：

```tsx
<Space>
  <Button onClick={() => updateTheme({ fontSize: 12 })}>小</Button>
  <Button onClick={() => updateTheme({ fontSize: 14 })}>中</Button>
  <Button onClick={() => updateTheme({ fontSize: 16 })}>大</Button>
  <Button onClick={() => updateTheme({ fontSize: 18 })}>特大</Button>
</Space>
```

### 2. 字体族选择
扩展主题配置支持字体族切换：

```typescript
interface ThemePreferences {
  // ...
  fontFamily: 'Inter' | 'Roboto' | 'Arial' | 'System';
}
```

### 3. 行高调整
添加行高配置以匹配字体大小：

```typescript
interface ThemePreferences {
  // ...
  lineHeight: number; // 1.5 | 1.6 | 1.7 | 1.8
}
```

### 4. 字体缩放级别
支持百分比缩放（如 Figma）：

```typescript
interface ThemePreferences {
  // ...
  fontScale: number; // 0.8 | 1.0 | 1.2 | 1.5
}
```

## 相关文件

### 核心文件
- `src/store/layoutStore.ts` - Store 配置
- `src/theme/themeProvider.ts` - CSS 变量和 Ant Design 主题
- `src/theme/muiTheme.ts` - MUI 主题配置
- `src/App.tsx` - MUI 主题应用
- `src/components/layout/PreferencesDrawer.tsx` - UI 控件

### 文档
- `docs/MUI_THEME_MODE_FIX.md` - MUI 主题模式修复文档
- `docs/THEME_SWITCHING_FIX.md` - 主题切换修复文档
- `docs/VBEN_ADMIN_MIGRATION.md` - 主题系统迁移文档

## 总结

字体大小设置功能已完整集成到应用的主题系统中，提供了：
- ✅ 全局统一的字体大小控制
- ✅ 实时预览和自动持久化
- ✅ 完整的 Ant Design + MUI 支持
- ✅ 基于 CSS 变量的高性能实现
- ✅ 符合 WCAG 可访问性标准

用户可以通过偏好设置轻松调整应用字体大小，提升阅读体验和可访问性。
