// 在浏览器控制台运行此脚本
console.clear();
console.log('=== 调试 sidebar-mixed-nav 布局 ===\n');

// 1. 检查二级菜单
const rightMenu = document.getElementById('sidebar-mixed-right-menu');
if (rightMenu) {
  const computed = window.getComputedStyle(rightMenu);
  const rect = rightMenu.getBoundingClientRect();
  
  console.log('📍 二级菜单（黄色）:');
  console.log('  CSS width:', computed.width);
  console.log('  CSS left:', computed.left);
  console.log('  实际 left:', rect.left + 'px');
  console.log('  实际 right:', rect.right + 'px');
  console.log('  实际 width:', rect.width + 'px');
  console.log('  右边缘位置 (left + width):', (rect.left + rect.width) + 'px');
}

// 2. 检查主内容区域的父容器（Layout）
const layouts = document.querySelectorAll('.ant-layout');
let mainLayout = null;

// 找到带有 marginLeft 的 Layout
for (const layout of layouts) {
  const computed = window.getComputedStyle(layout);
  if (computed.marginLeft && computed.marginLeft !== '0px') {
    mainLayout = layout;
    break;
  }
}

if (mainLayout) {
  const computed = window.getComputedStyle(mainLayout);
  const rect = mainLayout.getBoundingClientRect();
  
  console.log('\n📍 主内容容器（Layout）:');
  console.log('  CSS marginLeft:', computed.marginLeft);
  console.log('  CSS paddingLeft:', computed.paddingLeft);
  console.log('  实际 left:', rect.left + 'px');
  console.log('  应该在:', '270px');
}

// 3. 检查 Content
const content = document.querySelector('.ant-layout-content');
if (content) {
  const computed = window.getComputedStyle(content);
  const rect = content.getBoundingClientRect();
  
  console.log('\n📍 Content（红色）:');
  console.log('  CSS paddingLeft:', computed.paddingLeft);
  console.log('  实际 left:', rect.left + 'px');
}

// 4. 计算间隙
if (rightMenu && mainLayout) {
  const menuRect = rightMenu.getBoundingClientRect();
  const layoutRect = mainLayout.getBoundingClientRect();
  
  const menuRightEdge = menuRect.left + menuRect.width;
  const layoutLeftEdge = layoutRect.left;
  const gap = layoutLeftEdge - menuRightEdge;
  
  console.log('\n🔍 间隙分析:');
  console.log('  二级菜单右边缘:', menuRightEdge + 'px');
  console.log('  主内容左边缘:', layoutLeftEdge + 'px');
  console.log('  间隙大小:', gap + 'px');
  console.log('  预期:', '0px（应该紧贴）');
  
  if (gap > 0) {
    console.log('\n❌ 发现问题！');
    console.log('  白色间隙宽度:', gap + 'px');
    console.log('  可能原因: Layout 的 marginLeft 实际生效值 > 270px');
  }
}

console.log('\n=== 调试完成 ===');
