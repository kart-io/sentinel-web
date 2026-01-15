import { chromium } from 'playwright';

async function verifyHeaderLayout() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // 访问应用
    await page.goto('http://localhost:5174');
    console.log('✓ 页面加载成功');

    // 等待登录页面或已登录状态
    await page.waitForTimeout(2000);

    // 检查是否需要登录
    const isLoginPage = await page.locator('input[type="text"]').count() > 0;

    if (isLoginPage) {
      console.log('检测到登录页面，正在登录...');
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('✓ 登录成功');
    }

    // 等待 Header 加载
    await page.waitForSelector('.ant-layout-header', { timeout: 5000 });
    console.log('✓ Header 加载完成');

    // 获取右侧工具栏所有图标
    const toolbarIcons = await page.locator('.ant-layout-header > div:last-child > *').evaluateAll(elements => {
      return elements.map((el, index) => {
        const rect = el.getBoundingClientRect();
        const tooltipTitle = el.querySelector('[title]')?.getAttribute('title') ||
                            el.getAttribute('title') ||
                            el.textContent?.trim() ||
                            'unknown';
        return {
          index,
          position: Math.round(rect.right),
          width: Math.round(rect.width),
          tooltip: tooltipTitle,
          hasSettingsIcon: el.innerHTML.includes('Settings') || el.innerHTML.includes('系统设置')
        };
      });
    });

    console.log('\n=== 右侧工具栏图标顺序（从左到右） ===');
    toolbarIcons.forEach((icon, idx) => {
      console.log(`${idx + 1}. ${icon.tooltip} - 位置: ${icon.position}px, 宽度: ${icon.width}px`);
      if (icon.hasSettingsIcon) {
        console.log('   ⚙️ 找到设置图标！');
      }
    });

    // 检查最右边的元素
    const rightmostIcon = toolbarIcons.reduce((max, icon) =>
      icon.position > max.position ? icon : max
    , toolbarIcons[0]);

    console.log('\n=== 验证结果 ===');
    if (rightmostIcon.hasSettingsIcon || rightmostIcon.tooltip.includes('设置')) {
      console.log('✅ 设置图标在最右边 - 正确！');
    } else {
      console.log(`❌ 设置图标不在最右边！`);
      console.log(`   最右边的元素是: ${rightmostIcon.tooltip}`);
    }

    // 截图保存
    await page.screenshot({
      path: 'header-layout-verification.png',
      fullPage: false
    });
    console.log('\n✓ 截图已保存: header-layout-verification.png');

    // 保持浏览器打开以便手动检查
    console.log('\n浏览器将保持打开状态，按 Ctrl+C 退出...');
    await page.waitForTimeout(300000); // 5分钟

  } catch (error) {
    console.error('错误:', error);
  } finally {
    await browser.close();
  }
}

verifyHeaderLayout();
