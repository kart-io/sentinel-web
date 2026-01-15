// sidebar-mixed-nav 调试脚本
// 在浏览器控制台运行此脚本

console.clear();
console.log('=== Sidebar Mixed Nav 调试 ===\n');

// 1. 检查布局模式
const layoutPrefs = JSON.parse(localStorage.getItem('layout-preferences') || '{}');
console.log('1. 当前布局模式:');
console.log('   layout:', layoutPrefs?.app?.layout);
console.log('   预期: sidebar-mixed-nav');

// 2. 检查左侧图标列
const leftSider = document.querySelector('[style*="width: 60px"]');
console.log('\n2. 左侧图标列:');
console.log('   找到元素:', !!leftSider);
if (leftSider) {
  const styles = window.getComputedStyle(leftSider);
  console.log('   width:', styles.width);
  console.log('   position:', styles.position);
  console.log('   left:', styles.left);
}

// 3. 检查右侧菜单列（红色的那个）
const rightMenu = document.querySelector('[style*="background"]');
console.log('\n3. 右侧菜单列 (红色):');
console.log('   找到元素:', !!rightMenu);
if (rightMenu) {
  const styles = window.getComputedStyle(rightMenu);
  console.log('   实际 width:', styles.width);
  console.log('   设置的 width:', rightMenu.style.width);
  console.log('   position:', styles.position);
  console.log('   left:', styles.left);
  console.log('   backgroundColor:', styles.backgroundColor);
  console.log('   所有 class:', rightMenu.className);
  
  // 检查是否有其他样式覆盖
  const allStyles = [];
  for (let i = 0; i < rightMenu.style.length; i++) {
    const prop = rightMenu.style[i];
    allStyles.push(`${prop}: ${rightMenu.style[prop]}`);
  }
  console.log('   所有 inline styles:', allStyles);
}

// 4. 检查主内容区域
const content = document.querySelector('.ant-layout-content');
console.log('\n4. 主内容区域:');
if (content) {
  const parent = content.parentElement;
  const styles = window.getComputedStyle(parent);
  console.log('   marginLeft:', styles.marginLeft);
  console.log('   预期: 270px');
}

// 5. 测量实际宽度
if (rightMenu) {
  const rect = rightMenu.getBoundingClientRect();
  console.log('\n5. 实际测量:');
  console.log('   getBoundingClientRect width:', rect.width + 'px');
  console.log('   left:', rect.left + 'px');
  console.log('   right:', rect.right + 'px');
}

// 6. 检查是否有冲突的 CSS
console.log('\n6. CSS 冲突检查:');
if (rightMenu) {
  const allRules = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        if (rule.selectorText && rightMenu.matches(rule.selectorText)) {
          allRules.push({
            selector: rule.selectorText,
            width: rule.style.width,
            sheet: sheet.href || 'inline'
          });
        }
      }
    } catch (e) {
      // 跨域样式表，跳过
    }
  }
  console.log('   匹配的 CSS 规则:', allRules.length);
  if (allRules.length > 0) {
    console.table(allRules);
  }
}

console.log('\n=== 调试完成 ===');
