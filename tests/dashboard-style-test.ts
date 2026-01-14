/**
 * Playwright Dashboard Style Verification Script
 * 验证 dashboard 页面的布局、样式和 CSS 变量
 */

import { chromium, Browser, Page } from 'playwright';

interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
}

interface StyleTestReport {
  timestamp: string;
  url: string;
  screenshot: string;
  consoleErrors: string[];
  layoutVisibility: Record<string, TestResult>;
  cssVariables: Record<string, { expected: string; actual: string; passed: boolean }>;
  issues: string[];
}

async function runDashboardStyleTest(): Promise<StyleTestReport> {
  const report: StyleTestReport = {
    timestamp: new Date().toISOString(),
    url: 'http://localhost:5174/dashboard',
    screenshot: '/tmp/dashboard-screenshot.png',
    consoleErrors: [],
    layoutVisibility: {},
    cssVariables: {},
    issues: [],
  };

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('Starting Playwright Dashboard Style Test...\n');

    // Launch browser
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    page = await context.newPage();

    // Collect console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        report.consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      report.consoleErrors.push(`Page Error: ${error.message}`);
    });

    // Step 1: Navigate to login page and perform login
    console.log('1. Navigating to login page and performing login...');
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Fill login form
    await page.fill('input[placeholder="用户名"]', 'Admin');
    await page.fill('input[placeholder="密码"]', 'password123');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for animations

    console.log('   Login successful, now on dashboard');

    // Step 2: Take screenshot
    console.log('2. Taking screenshot...');
    await page.screenshot({
      path: report.screenshot,
      fullPage: true
    });
    console.log(`   Screenshot saved to: ${report.screenshot}`);

    // Step 3: Check layout component visibility
    console.log('3. Checking layout components visibility...');

    // Check Sidebar
    const sidebarSelectors = [
      { name: 'sidebar-sider', selector: '.ant-layout-sider' },
      { name: 'sidebar-menu', selector: '.ant-menu' },
      { name: 'sidebar-logo', selector: '.ant-layout-sider .font-bold' },
    ];

    for (const item of sidebarSelectors) {
      const element = await page.$(item.selector);
      const isVisible = element ? await element.isVisible() : false;
      report.layoutVisibility[item.name] = {
        passed: isVisible,
        message: isVisible ? `${item.name} is visible` : `${item.name} is NOT visible`,
      };
      console.log(`   ${item.name}: ${isVisible ? 'VISIBLE' : 'NOT VISIBLE'}`);
    }

    // Check Header
    const headerSelectors = [
      { name: 'header', selector: '.ant-layout-header' },
      { name: 'header-breadcrumb', selector: '.ant-breadcrumb' },
      { name: 'header-user-avatar', selector: '.ant-avatar' },
    ];

    for (const item of headerSelectors) {
      const element = await page.$(item.selector);
      const isVisible = element ? await element.isVisible() : false;
      report.layoutVisibility[item.name] = {
        passed: isVisible,
        message: isVisible ? `${item.name} is visible` : `${item.name} is NOT visible`,
      };
      console.log(`   ${item.name}: ${isVisible ? 'VISIBLE' : 'NOT VISIBLE'}`);
    }

    // Check Content area
    const contentSelectors = [
      { name: 'content', selector: '.ant-layout-content' },
      { name: 'dashboard-cards', selector: '.ant-card' },
      { name: 'dashboard-table', selector: '.ant-table' },
    ];

    for (const item of contentSelectors) {
      const element = await page.$(item.selector);
      const isVisible = element ? await element.isVisible() : false;
      report.layoutVisibility[item.name] = {
        passed: isVisible,
        message: isVisible ? `${item.name} is visible` : `${item.name} is NOT visible`,
      };
      console.log(`   ${item.name}: ${isVisible ? 'VISIBLE' : 'NOT VISIBLE'}`);
    }

    // Check Menu items
    const menuItems = await page.$$('.ant-menu-item');
    report.layoutVisibility['menu-items'] = {
      passed: menuItems.length > 0,
      message: `Found ${menuItems.length} menu items`,
      details: { count: menuItems.length },
    };
    console.log(`   menu-items: Found ${menuItems.length} items`);

    // Step 4: Check CSS variables
    console.log('\n4. Checking CSS variables...');

    const expectedCssVars: Record<string, string> = {
      '--color-primary': '#0960bd',
      '--color-bg-layout': '#f0f2f5',
      '--color-bg-container': '#ffffff',
      '--color-bg-sidebar': '#001529',
      '--color-bg-header': '#ffffff',
      '--border-radius': '6px',
      '--sidebar-width': '210px',
      '--header-height': '48px',
    };

    const actualCssVars = await page.evaluate((vars) => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const result: Record<string, string> = {};

      for (const varName of Object.keys(vars)) {
        result[varName] = computedStyle.getPropertyValue(varName).trim();
      }

      return result;
    }, expectedCssVars);

    for (const [varName, expected] of Object.entries(expectedCssVars)) {
      const actual = actualCssVars[varName] || 'NOT SET';
      const passed = actual === expected;
      report.cssVariables[varName] = { expected, actual, passed };
      console.log(`   ${varName}: ${actual} (expected: ${expected}) ${passed ? 'OK' : 'MISMATCH'}`);

      if (!passed) {
        report.issues.push(`CSS variable ${varName} mismatch: expected "${expected}", got "${actual}"`);
      }
    }

    // Step 5: Check for additional style issues
    console.log('\n5. Checking for style issues...');

    // Check if dark mode class is properly applied
    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ||
             document.body.classList.contains('dark') ||
             document.querySelector('.ant-layout')?.classList.contains('dark');
    });
    console.log(`   Dark mode class: ${hasDarkClass ? 'Applied' : 'Not applied (light mode)'}`);

    // Check sidebar width
    const sidebarWidth = await page.evaluate(() => {
      const sider = document.querySelector('.ant-layout-sider') as HTMLElement;
      return sider ? getComputedStyle(sider).width : 'N/A';
    });
    console.log(`   Sidebar actual width: ${sidebarWidth}`);

    // Check header height
    const headerHeight = await page.evaluate(() => {
      const header = document.querySelector('.ant-layout-header') as HTMLElement;
      return header ? getComputedStyle(header).height : 'N/A';
    });
    console.log(`   Header actual height: ${headerHeight}`);

    // Check content margin-left (should match sidebar width)
    const contentMargin = await page.evaluate(() => {
      const layouts = document.querySelectorAll('.ant-layout');
      for (const layout of layouts) {
        const marginLeft = getComputedStyle(layout as HTMLElement).marginLeft;
        if (marginLeft && marginLeft !== '0px') {
          return marginLeft;
        }
      }
      return 'N/A';
    });
    console.log(`   Content margin-left: ${contentMargin}`);

    // Check for overlapping elements
    const overlapCheck = await page.evaluate(() => {
      const sider = document.querySelector('.ant-layout-sider') as HTMLElement;
      const header = document.querySelector('.ant-layout-header') as HTMLElement;
      const content = document.querySelector('.ant-layout-content') as HTMLElement;

      const issues: string[] = [];

      if (sider && content) {
        const siderRect = sider.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        if (contentRect.left < siderRect.right - 5) {
          issues.push(`Content overlaps with sidebar: content.left=${contentRect.left}, sider.right=${siderRect.right}`);
        }
      }

      if (header && content) {
        const headerRect = header.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        if (contentRect.top < headerRect.bottom - 5) {
          issues.push(`Content overlaps with header: content.top=${contentRect.top}, header.bottom=${headerRect.bottom}`);
        }
      }

      return issues;
    });

    if (overlapCheck.length > 0) {
      report.issues.push(...overlapCheck);
      console.log(`   Layout overlaps detected: ${overlapCheck.join(', ')}`);
    } else {
      console.log('   No layout overlaps detected');
    }

    // Check z-index stacking
    const zIndexCheck = await page.evaluate(() => {
      const sider = document.querySelector('.ant-layout-sider') as HTMLElement;
      const header = document.querySelector('.ant-layout-header') as HTMLElement;

      return {
        siderZIndex: sider ? getComputedStyle(sider).zIndex : 'N/A',
        headerZIndex: header ? getComputedStyle(header).zIndex : 'N/A',
      };
    });
    console.log(`   Z-index - Sidebar: ${zIndexCheck.siderZIndex}, Header: ${zIndexCheck.headerZIndex}`);

    // Step 6: Check specific component styles
    console.log('\n6. Checking specific component styles...');

    // Check dashboard cards styling
    const cardStyles = await page.evaluate(() => {
      const cards = document.querySelectorAll('.ant-card');
      if (cards.length === 0) return null;

      const firstCard = cards[0] as HTMLElement;
      const styles = getComputedStyle(firstCard);

      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        border: styles.border,
      };
    });

    if (cardStyles) {
      console.log(`   Card styles:`, cardStyles);
    }

    // Check table styling
    const tableStyles = await page.evaluate(() => {
      const table = document.querySelector('.ant-table') as HTMLElement;
      if (!table) return null;

      const styles = getComputedStyle(table);
      return {
        backgroundColor: styles.backgroundColor,
      };
    });

    if (tableStyles) {
      console.log(`   Table styles:`, tableStyles);
    }

    // Step 7: Summary
    console.log('\n7. Console errors collected:');
    if (report.consoleErrors.length === 0) {
      console.log('   No console errors detected');
    } else {
      report.consoleErrors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err}`);
      });
    }

    console.log('\n=== TEST SUMMARY ===');
    const visibilityPassed = Object.values(report.layoutVisibility).filter(r => r.passed).length;
    const visibilityTotal = Object.keys(report.layoutVisibility).length;
    console.log(`Layout Visibility: ${visibilityPassed}/${visibilityTotal} passed`);

    const cssVarsPassed = Object.values(report.cssVariables).filter(r => r.passed).length;
    const cssVarsTotal = Object.keys(report.cssVariables).length;
    console.log(`CSS Variables: ${cssVarsPassed}/${cssVarsTotal} matched`);

    console.log(`Console Errors: ${report.consoleErrors.length}`);
    console.log(`Issues Found: ${report.issues.length}`);

    if (report.issues.length > 0) {
      console.log('\n=== ISSUES ===');
      report.issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
      });
    }

  } catch (error) {
    console.error('Test failed with error:', error);
    report.issues.push(`Test execution error: ${error}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return report;
}

// Run the test
runDashboardStyleTest()
  .then((report) => {
    console.log('\n=== FULL REPORT (JSON) ===');
    console.log(JSON.stringify(report, null, 2));
  })
  .catch((error) => {
    console.error('Failed to run test:', error);
    process.exit(1);
  });
