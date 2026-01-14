import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  console.log('Setting up authentication...');
  // Navigate to the app first to initialize localStorage
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });

  // Inject authentication state into localStorage (without encryption in dev mode)
  await page.evaluate(() => {
    const authState = {
      state: {
        token: 'mock-playwright-token-' + Date.now(),
        user: {
          id: 'playwright-user-1',
          username: 'playwright-test',
          email: 'playwright@test.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=playwright',
          role: 'admin'
        },
        isAuthenticated: true
      },
      version: 0
    };

    // Store auth state in localStorage (the key is 'sentinel-x:auth-storage' based on secureStorage config)
    localStorage.setItem('sentinel-x:auth-storage', JSON.stringify(authState));
  });

  console.log('Authentication state set. Navigating to dashboard...');
  await page.goto('http://localhost:5174/dashboard', { waitUntil: 'networkidle' });
  
  // Wait a bit for any dynamic content
  await page.waitForTimeout(2000);
  
  // Take screenshot of dashboard
  await page.screenshot({ path: '/tmp/dashboard-screenshot.png', fullPage: true });
  console.log('Screenshot saved to /tmp/dashboard-screenshot.png');
  
  // Get CSS variables from root
  const cssVariables = await page.evaluate(() => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    return {
      '--color-primary': styles.getPropertyValue('--color-primary'),
      '--color-bg-layout': styles.getPropertyValue('--color-bg-layout'),
      '--color-bg-container': styles.getPropertyValue('--color-bg-container'),
      '--color-text': styles.getPropertyValue('--color-text'),
      '--color-border': styles.getPropertyValue('--color-border'),
    };
  });
  
  console.log('\n=== CSS Variables ===');
  console.log(JSON.stringify(cssVariables, null, 2));
  
  // Check for sidebar
  const sidebar = await page.$('[class*="sidebar"], [class*="Sidebar"], aside, nav');
  console.log('\n=== UI Elements Check ===');
  console.log('Sidebar found:', !!sidebar);
  
  // Check for header/breadcrumbs
  const header = await page.$('header, [class*="header"], [class*="Header"]');
  console.log('Header found:', !!header);
  
  const breadcrumbs = await page.$('[class*="breadcrumb"], [class*="Breadcrumb"], nav[aria-label*="breadcrumb"]');
  console.log('Breadcrumbs found:', !!breadcrumbs);
  
  // Check for theme toggle (look for Sun/Moon icons)
  const themeToggle = await page.$('svg[class*="lucide-sun"], svg[class*="lucide-moon"]');
  console.log('Theme toggle found:', !!themeToggle);

  // Get theme toggle parent to check click handler
  if (themeToggle) {
    const themeToggleParent = await page.evaluate(() => {
      const sunIcon = document.querySelector('svg[class*="lucide-sun"]');
      const moonIcon = document.querySelector('svg[class*="lucide-moon"]');
      const icon = sunIcon || moonIcon;
      return icon ? {
        hasClickableParent: !!icon.closest('[onclick], [class*="cursor-pointer"]'),
        parentTag: icon.parentElement?.tagName,
        parentClasses: icon.parentElement?.className
      } : null;
    });
    console.log('Theme toggle details:', themeToggleParent);
  }
  
  // Check for settings icon
  const settingsIcon = await page.$('[aria-label*="setting"], [class*="setting"], button:has(svg)');
  console.log('Settings icon found:', !!settingsIcon);
  
  // Check for tabs
  const tabs = await page.$('[role="tablist"], [class*="tab"], [class*="Tab"]');
  console.log('Tabs found:', !!tabs);
  
  console.log('\n=== Console Messages ===');
  consoleMessages.forEach(msg => {
    console.log(`[${msg.type}] ${msg.text}`);
  });
  
  console.log('\n=== Page Errors ===');
  if (pageErrors.length === 0) {
    console.log('No page errors found');
  } else {
    pageErrors.forEach(err => console.log('ERROR:', err));
  }
  
  await browser.close();
})();
