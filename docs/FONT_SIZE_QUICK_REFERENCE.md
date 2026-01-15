# 字体大小设置 - 快速参考

## 功能概览
在偏好设置中添加字体大小控制（12-18px），支持 Ant Design、MUI 和自定义组件。

## 使用方式

### 用户界面
1. 点击右上角设置图标
2. 在"字体大小"部分拖动滑块
3. 实时预览效果
4. 设置自动保存

### 编程方式
```typescript
import { useLayoutStore } from '@/store/layoutStore';

const updateTheme = useLayoutStore((state) => state.updateTheme);
updateTheme({ fontSize: 16 });
```

## 技术要点

### 配置位置
```typescript
// layoutStore.ts
interface ThemePreferences {
  fontSize: number; // 12-18px, 默认 14px
}
```

### CSS 变量
```css
--font-size-base: 14px;  /* 基础字体 */
--font-size-sm: 12px;    /* 小号字体 (base - 2) */
--font-size-lg: 16px;    /* 大号字体 (base + 2) */
```

### Ant Design
```typescript
// useAntdThemeConfig()
{
  token: { fontSize: theme.fontSize },
  components: {
    Menu: { fontSize: theme.fontSize }
  }
}
```

### MUI
```typescript
// createMuiTheme(mode, fontSize, borderRadius)
{
  typography: {
    fontSize: 16,
    h1: { fontSize: '2.857rem' }
  }
}
```

## 影响范围
- ✅ 所有 Ant Design 组件
- ✅ 所有 MUI 组件
- ✅ 使用 CSS 变量的自定义组件
- ✅ 响应式布局
- ✅ 亮色/暗色主题

## 测试验证

### 浏览器控制台
```javascript
// 检查 CSS 变量
getComputedStyle(document.documentElement).getPropertyValue('--font-size-base');

// 检查 localStorage
JSON.parse(localStorage.getItem('layout-preferences')).theme.fontSize;
```

### 测试页面
- Dashboard：卡片、表格、统计数据
- MUI Demo：http://localhost:5174/mui-demo
- RAG 页面：文档列表、编辑器
- 偏好设置：实时预览

## 相关文件
```
src/
├── store/layoutStore.ts              # Store 配置
├── theme/
│   ├── themeProvider.ts              # CSS 变量和 Ant Design 配置
│   └── muiTheme.ts                   # MUI 主题配置
├── App.tsx                           # MUI 主题应用
└── components/layout/
    └── PreferencesDrawer.tsx         # UI 控件

docs/
├── FONT_SIZE_SETTING.md              # 详细文档
└── FONT_SIZE_SETTING_TEST.md         # 测试指南
```

## 常见问题

**Q: 字体大小没有变化？**
A: 检查组件是否使用 CSS 变量或从 theme 读取配置，避免内联样式覆盖。

**Q: 刷新后设置丢失？**
A: 检查浏览器 localStorage 是否被禁用。

**Q: 如何为特定组件设置不同字体？**
A: 使用 CSS 变量：`font-size: var(--font-size-lg);`

## 可访问性
- 符合 WCAG 2.1 AA 级标准
- 支持键盘操作（方向键、Home/End）
- 支持屏幕阅读器

## 性能
- 使用 CSS 变量实时更新，无需重新编译
- MUI 主题使用 `useMemo` 缓存
- 单次 store 更新触发所有组件

## 字体大小建议
- **12-13px**: 空间受限界面
- **14px**: 标准桌面应用（默认）
- **15-16px**: 长时间阅读
- **17-18px**: 视力辅助需求
