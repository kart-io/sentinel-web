/**
 * Playwright script to capture dashboard screenshots and analyze styles
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function captureDashboard() {
  console.log('Starting Playwright to capture dashboard screenshots...\n');

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Collect console messages
  const consoleMessages = [];
  const consoleErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleErrors.push({ type: msg.type(), text });
    }
  });

  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  try {
    // First, navigate to set localStorage
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });

    // Set authentication in localStorage
    // The secureStorage uses 'sentinel-x:' prefix for keys
    await page.evaluate(() => {
      // Set with the prefix that secureStorage expects
      const authData = JSON.stringify({
        state: {
          token: 'test-token',
          user: { id: '1', username: 'Admin', email: 'admin@test.com', role: 'admin' },
          isAuthenticated: true
        },
        version: 0
      });
      localStorage.setItem('sentinel-x:auth-storage', authData);
      // Also set without prefix as fallback
      localStorage.setItem('auth-storage', authData);
    });

    console.log('Authentication set in localStorage');

    // Navigate to dashboard
    await page.goto('http://localhost:5174/dashboard', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    console.log('Page loaded, capturing screenshots...\n');

    // Take full page screenshot
    const screenshotDir = join(__dirname, '..', 'screenshots');
    await page.screenshot({
      path: join(screenshotDir, 'dashboard-full.png'),
      fullPage: true
    });
    console.log('Full page screenshot saved: screenshots/dashboard-full.png');

    // Take viewport screenshot
    await page.screenshot({
      path: join(screenshotDir, 'dashboard-viewport.png'),
      fullPage: false
    });
    console.log('Viewport screenshot saved: screenshots/dashboard-viewport.png');

    // Analyze CSS variables
    console.log('\n=== CSS Variables Analysis ===');
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        '--color-primary': styles.getPropertyValue('--color-primary'),
        '--color-bg-layout': styles.getPropertyValue('--color-bg-layout'),
        '--color-bg-container': styles.getPropertyValue('--color-bg-container'),
        '--color-bg-sidebar': styles.getPropertyValue('--color-bg-sidebar'),
        '--color-bg-header': styles.getPropertyValue('--color-bg-header'),
        '--color-text-primary': styles.getPropertyValue('--color-text-primary'),
        '--sidebar-width': styles.getPropertyValue('--sidebar-width'),
        '--header-height': styles.getPropertyValue('--header-height'),
      };
    });

    for (const [key, value] of Object.entries(cssVariables)) {
      console.log(`  ${key}: ${value || '(not set)'}`);
    }

    // Analyze layout structure
    console.log('\n=== Layout Structure Analysis ===');
    const layoutAnalysis = await page.evaluate(() => {
      const results = {
        sidebar: null,
        header: null,
        content: null,
        tabsView: null,
        cards: [],
        tables: [],
        issues: []
      };

      // Check sidebar
      const sider = document.querySelector('.ant-layout-sider');
      if (sider) {
        const rect = sider.getBoundingClientRect();
        const styles = getComputedStyle(sider);
        results.sidebar = {
          exists: true,
          width: rect.width,
          height: rect.height,
          position: styles.position,
          backgroundColor: styles.backgroundColor,
          isFixed: styles.position === 'fixed',
        };
      } else {
        results.sidebar = { exists: false };
        results.issues.push('Sidebar not found');
      }

      // Check header
      const header = document.querySelector('.ant-layout-header');
      if (header) {
        const rect = header.getBoundingClientRect();
        const styles = getComputedStyle(header);
        results.header = {
          exists: true,
          width: rect.width,
          height: rect.height,
          backgroundColor: styles.backgroundColor,
        };
      } else {
        results.header = { exists: false };
        results.issues.push('Header not found');
      }

      // Check content area
      const content = document.querySelector('.ant-layout-content');
      if (content) {
        const rect = content.getBoundingClientRect();
        const styles = getComputedStyle(content);
        results.content = {
          exists: true,
          width: rect.width,
          height: rect.height,
          padding: styles.padding,
          backgroundColor: styles.backgroundColor,
        };
      } else {
        results.content = { exists: false };
        results.issues.push('Content area not found');
      }

      // Check tabs view
      const tabsContainer = document.querySelector('[class*="tabs"]') ||
                           document.querySelector('.ant-tabs');
      results.tabsView = {
        exists: !!tabsContainer,
      };

      // Check cards
      const cards = document.querySelectorAll('.ant-card');
      results.cards = Array.from(cards).map((card, i) => {
        const rect = card.getBoundingClientRect();
        const styles = getComputedStyle(card);
        return {
          index: i,
          width: rect.width,
          height: rect.height,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          visible: rect.width > 0 && rect.height > 0,
        };
      });

      // Check tables
      const tables = document.querySelectorAll('.ant-table');
      results.tables = Array.from(tables).map((table, i) => {
        const rect = table.getBoundingClientRect();
        return {
          index: i,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0,
        };
      });

      // Check for deprecated API warnings in DOM
      const deprecatedElements = document.querySelectorAll('[style*="headStyle"], [style*="bodyStyle"]');
      if (deprecatedElements.length > 0) {
        results.issues.push(`Found ${deprecatedElements.length} elements with potentially deprecated style props`);
      }

      return results;
    });

    console.log('Sidebar:', JSON.stringify(layoutAnalysis.sidebar, null, 2));
    console.log('Header:', JSON.stringify(layoutAnalysis.header, null, 2));
    console.log('Content:', JSON.stringify(layoutAnalysis.content, null, 2));
    console.log('TabsView:', JSON.stringify(layoutAnalysis.tabsView, null, 2));
    console.log(`Cards found: ${layoutAnalysis.cards.length}`);
    console.log(`Tables found: ${layoutAnalysis.tables.length}`);

    if (layoutAnalysis.issues.length > 0) {
      console.log('\nLayout Issues:');
      layoutAnalysis.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    // Console errors and warnings
    console.log('\n=== Console Errors/Warnings ===');
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(({ type, text }) => {
        console.log(`  [${type.toUpperCase()}] ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
      });
    } else {
      console.log('  No errors or warnings detected');
    }

    // Page errors
    console.log('\n=== Page Errors ===');
    if (pageErrors.length > 0) {
      pageErrors.forEach(error => {
        console.log(`  ${error.substring(0, 200)}${error.length > 200 ? '...' : ''}`);
      });
    } else {
      console.log('  No page errors detected');
    }

    // Check for Ant Design deprecation warnings
    console.log('\n=== Ant Design Deprecation Check ===');
    const deprecationWarnings = consoleMessages.filter(msg =>
      msg.text.includes('deprecated') ||
      msg.text.includes('Warning:') ||
      msg.text.includes('headStyle') ||
      msg.text.includes('bodyStyle')
    );

    if (deprecationWarnings.length > 0) {
      console.log('Deprecation warnings found:');
      deprecationWarnings.forEach(({ text }) => {
        console.log(`  ${text.substring(0, 300)}${text.length > 300 ? '...' : ''}`);
      });
    } else {
      console.log('  No deprecation warnings detected');
    }

    console.log('\n=== Screenshot Analysis Complete ===');

  } catch (error) {
    console.error('Error during analysis:', error.message);
  } finally {
    await browser.close();
  }
}

// Create screenshots directory
import { mkdirSync } from 'fs';
try {
  mkdirSync(join(dirname(__filename), '..', 'screenshots'), { recursive: true });
} catch (e) {
  // Directory might already exist
}

captureDashboard();
