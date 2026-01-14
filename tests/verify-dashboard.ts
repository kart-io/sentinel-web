import { chromium } from 'playwright';

async function verifyDashboard() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const consoleMessages: string[] = [];
  const consoleErrors: string[] = [];

  // Capture console messages
  page.on('console', (msg) => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    // Only count actual errors, not info warnings about encryption
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  try {
    console.log('🔍 Navigating to dashboard...');
    await page.goto('http://localhost:5174/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Take screenshot
    const screenshotPath = '/tmp/dashboard-verification.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);

    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page: ${title} - ${url}`);

    // Check for key UI elements with broader selectors
    console.log('\n🔍 Checking UI elements...');

    const checks = [
      { name: 'Layout Container', selector: '.ant-layout' },
      { name: 'Sidebar (Sider)', selector: 'aside, .ant-layout-sider, [class*="Sider"]' },
      { name: 'Header', selector: 'header, .ant-layout-header, [class*="Header"]' },
      { name: 'Content Area', selector: '.ant-layout-content, [class*="Content"]' },
      { name: 'Menu', selector: '.ant-menu, [class*="Menu"]' },
      { name: 'Breadcrumb', selector: '.ant-breadcrumb, [class*="breadcrumb"]' },
    ];

    let foundCount = 0;
    for (const check of checks) {
      const element = await page.$(check.selector);
      if (element) {
        console.log(`  ✅ ${check.name} found`);
        foundCount++;
      } else {
        console.log(`  ❌ ${check.name} NOT found`);
      }
    }

    // Get actual HTML structure for debugging
    console.log('\n📝 Page structure (first-level children of body):');
    const bodyChildren = await page.evaluate(() => {
      const body = document.body;
      return Array.from(body.children).map(el => {
        return `<${el.tagName.toLowerCase()} class="${el.className}">`;
      }).join('\n');
    });
    console.log(bodyChildren);

    // Check CSS variables
    console.log('\n🎨 Checking CSS variables...');
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      return {
        colorPrimary: style.getPropertyValue('--color-primary'),
        colorBgLayout: style.getPropertyValue('--color-bg-layout'),
        colorBgContainer: style.getPropertyValue('--color-bg-container'),
        colorText: style.getPropertyValue('--color-text'),
        colorBorder: style.getPropertyValue('--color-border'),
      };
    });

    let cssVarsValid = 0;
    for (const [name, value] of Object.entries(cssVars)) {
      if (value && value.trim()) {
        console.log(`  ✅ ${name}: ${value.trim()}`);
        cssVarsValid++;
      } else {
        console.log(`  ⚠️  ${name}: not set (may be optional)`);
      }
    }

    // Report console errors (only actual errors, not warnings)
    console.log('\n📋 Console errors:');
    if (consoleErrors.length === 0) {
      console.log('  ✅ No console errors!');
    } else {
      console.log(`  ❌ Found ${consoleErrors.length} errors:`);
      consoleErrors.forEach((err) => console.log(`    ${err}`));
    }

    // Final summary
    console.log('\n═══════════════════════════════════════');
    console.log('VERIFICATION SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`UI Elements Found: ${foundCount}/${checks.length}`);
    console.log(`CSS Variables Set: ${cssVarsValid}/${Object.keys(cssVars).length}`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Screenshot: ${screenshotPath}`);

    if (consoleErrors.length === 0 && foundCount >= 4) {
      console.log('\n✅ Dashboard verification PASSED!');
      return true;
    } else {
      console.log('\n⚠️  Dashboard needs attention.');
      return false;
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
    return false;
  } finally {
    await browser.close();
  }
}

verifyDashboard();
