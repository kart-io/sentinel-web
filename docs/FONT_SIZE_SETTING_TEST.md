# 字体大小设置功能 - 测试指南

## 测试环境
- 开发服务器：http://localhost:5174
- 测试页面：任意已登录页面

## 测试步骤

### 1. 访问偏好设置
1. 启动开发服务器：`pnpm run dev`
2. 打开浏览器访问：http://localhost:5174
3. 登录应用
4. 点击右上角的**设置图标**（齿轮图标）

### 2. 调整字体大小
1. 在偏好设置抽屉中，找到**"字体大小"**选项
2. 观察当前值显示（默认：14px）
3. 拖动滑块从左到右：
   - 最小值：12px
   - 最大值：18px
4. 观察页面内容实时变化

### 3. 验证影响范围

#### 3.1 Ant Design 组件
测试页面：
- 侧边栏菜单文字
- 顶部导航栏
- 按钮文字
- 表格内容
- 输入框占位符

预期：所有 Ant Design 组件字体大小同步变化

#### 3.2 MUI 组件
测试页面：http://localhost:5174/mui-demo

检查项：
- Card 内容文字
- Button 文字
- Typography 各级标题
- Table 内容
- Input 文字

预期：所有 MUI 组件字体大小同步变化

#### 3.3 自定义组件
测试页面：Dashboard、RAG 页面等

检查项：
- 卡片标题和内容
- 统计数据显示
- 列表项文字
- 面包屑导航

预期：使用 CSS 变量的组件字体大小同步变化

### 4. 验证持久化
1. 设置字体大小为 16px
2. 刷新页面（F5）
3. 检查字体大小是否保持为 16px

预期：设置自动保存到 localStorage，刷新后保持

### 5. 与主题模式配合测试
1. 设置字体大小为 16px
2. 切换主题模式：亮色 → 暗色
3. 检查字体大小是否保持为 16px
4. 切换主题模式：暗色 → 亮色
5. 检查字体大小是否保持为 16px

预期：字体大小设置独立于主题模式，不受影响

### 6. 极值测试

#### 最小值测试（12px）
1. 将滑块拖动到最左侧（12px）
2. 检查所有文字是否清晰可读
3. 检查是否有文字溢出或布局错乱

#### 最大值测试（18px）
1. 将滑块拖动到最右侧（18px）
2. 检查所有文字是否清晰可读
3. 检查是否有文字溢出或布局错乱

### 7. 响应式测试
1. 设置字体大小为 16px
2. 调整浏览器窗口大小：
   - 桌面（1920x1080）
   - 平板（768x1024）
   - 手机（375x667）
3. 检查字体大小在不同屏幕尺寸下的表现

预期：字体大小设置在所有屏幕尺寸下生效

## 控制台验证

### 检查 CSS 变量
在浏览器控制台运行：

```javascript
// 应该返回当前设置的字体大小（如 "16px"）
console.log(getComputedStyle(document.documentElement).getPropertyValue('--font-size-base').trim());

// 应该返回 fontSize - 2
console.log(getComputedStyle(document.documentElement).getPropertyValue('--font-size-sm').trim());

// 应该返回 fontSize + 2
console.log(getComputedStyle(document.documentElement).getPropertyValue('--font-size-lg').trim());
```

### 检查 Store 状态
```javascript
// 检查 localStorage
console.log(JSON.parse(localStorage.getItem('layout-preferences') || '{}').theme?.fontSize);
```

### 检查 Ant Design
```javascript
// 检查菜单项字体大小
const menuItem = document.querySelector('.ant-menu-item');
if (menuItem) {
  console.log('Menu font size:', window.getComputedStyle(menuItem).fontSize);
}
```

### 检查 MUI
```javascript
// 检查 Typography 字体大小
const typography = document.querySelector('.MuiTypography-root');
if (typography) {
  console.log('MUI Typography font size:', window.getComputedStyle(typography).fontSize);
}
```

## 常见问题排查

### 问题 1：字体大小没有变化
**排查步骤**：
1. 检查浏览器控制台是否有错误
2. 验证 CSS 变量是否正确应用
3. 检查组件是否使用了内联样式覆盖

### 问题 2：刷新后设置丢失
**排查步骤**：
1. 检查 localStorage 是否被禁用
2. 在控制台验证 localStorage 写入
3. 检查浏览器隐私设置

### 问题 3：部分组件字体未更新
**排查步骤**：
1. 确认组件是否使用 CSS 变量
2. 检查是否有 CSS 优先级问题
3. 验证组件是否从 theme 读取配置

## 性能测试

### 测试切换性能
1. 快速拖动滑块多次
2. 观察页面响应是否流畅
3. 检查是否有卡顿或闪烁

预期：字体大小切换流畅，无明显性能问题

### 测试内存占用
1. 打开浏览器任务管理器
2. 记录初始内存占用
3. 切换字体大小 10 次
4. 观察内存占用变化

预期：内存占用稳定，无内存泄漏

## 可访问性测试

### 屏幕阅读器测试
1. 启用屏幕阅读器（如 NVDA、JAWS）
2. 导航到偏好设置
3. 检查滑块是否可以通过键盘操作
4. 检查当前值是否被正确朗读

### 键盘导航测试
1. 使用 Tab 键导航到字体大小滑块
2. 使用方向键（←→）调整字体大小
3. 使用 Home/End 键跳转到最小/最大值

预期：完全支持键盘操作

## 回归测试清单

- [ ] 登录页面字体显示正常
- [ ] Dashboard 字体显示正常
- [ ] RAG 页面字体显示正常
- [ ] MUI Demo 页面字体显示正常
- [ ] 侧边栏菜单字体显示正常
- [ ] 顶部导航栏字体显示正常
- [ ] 面包屑导航字体显示正常
- [ ] 表格内容字体显示正常
- [ ] 表单控件字体显示正常
- [ ] 弹窗内容字体显示正常
- [ ] 抽屉内容字体显示正常
- [ ] 通知消息字体显示正常

## 浏览器兼容性测试

测试以下浏览器：
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

每个浏览器验证：
1. 字体大小调整功能
2. 设置持久化
3. 主题模式配合
4. 响应式表现

## 测试报告模板

```
测试日期：[日期]
测试人员：[姓名]
测试环境：[浏览器版本、操作系统]

测试结果：
✅ 字体大小调整功能正常
✅ 设置持久化功能正常
✅ Ant Design 组件支持正常
✅ MUI 组件支持正常
✅ 主题模式配合正常
✅ 响应式表现正常
✅ 性能表现良好
✅ 可访问性符合标准

发现问题：
[描述问题及复现步骤]

建议改进：
[改进建议]
```

## 自动化测试建议

### Playwright 测试示例

```javascript
import { test, expect } from '@playwright/test';

test.describe('字体大小设置', () => {
  test('应该能够调整字体大小', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // 登录
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // 打开偏好设置
    await page.click('[aria-label="设置"]');

    // 调整字体大小
    const slider = page.locator('.ant-slider');
    await slider.click({ position: { x: 100, y: 0 } });

    // 验证 CSS 变量
    const fontSize = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--font-size-base').trim();
    });

    expect(fontSize).not.toBe('14px');
  });

  test('应该持久化字体大小设置', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // 设置字体大小
    // ...

    // 刷新页面
    await page.reload();

    // 验证设置保持
    const fontSize = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('layout-preferences') || '{}');
      return prefs.theme?.fontSize;
    });

    expect(fontSize).toBe(16);
  });
});
```

## 总结

完成以上测试后，字体大小设置功能应该：
- ✅ 功能完整且稳定
- ✅ 用户体验流畅
- ✅ 兼容性良好
- ✅ 性能优异
- ✅ 符合可访问性标准
