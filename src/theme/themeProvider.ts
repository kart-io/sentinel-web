import { useEffect } from 'react';
import { useLayoutStore } from '@/store/layoutStore';

/**
 * CSS 变量配置
 */
interface CSSVariables {
  // 主题色
  '--color-primary': string;
  '--color-primary-hover': string;
  '--color-primary-active': string;

  // 背景色
  '--color-bg-layout': string;
  '--color-bg-container': string;
  '--color-bg-elevated': string;
  '--color-bg-sidebar': string;
  '--color-bg-header': string;

  // 文字颜色
  '--color-text-primary': string;
  '--color-text-secondary': string;
  '--color-text-tertiary': string;
  '--color-text-disabled': string;

  // 边框
  '--color-border': string;
  '--color-border-secondary': string;

  // 圆角
  '--border-radius': string;
  '--border-radius-sm': string;
  '--border-radius-lg': string;

  // 尺寸
  '--sidebar-width': string;
  '--sidebar-collapsed-width': string;
  '--header-height': string;
  '--tabbar-height': string;

  // 阴影
  '--shadow-sm': string;
  '--shadow-md': string;
  '--shadow-lg': string;

  // 过渡
  '--transition-duration': string;
}

/**
 * 亮色主题变量
 */
const lightThemeVariables = (primaryColor: string, radius: number): Partial<CSSVariables> => ({
  '--color-primary': primaryColor,
  '--color-primary-hover': adjustColor(primaryColor, 10),
  '--color-primary-active': adjustColor(primaryColor, -10),

  '--color-bg-layout': '#f0f2f5',
  '--color-bg-container': '#ffffff',
  '--color-bg-elevated': '#ffffff',
  '--color-bg-sidebar': '#001529',
  '--color-bg-header': '#ffffff',

  '--color-text-primary': 'rgba(0, 0, 0, 0.88)',
  '--color-text-secondary': 'rgba(0, 0, 0, 0.65)',
  '--color-text-tertiary': 'rgba(0, 0, 0, 0.45)',
  '--color-text-disabled': 'rgba(0, 0, 0, 0.25)',

  '--color-border': '#d9d9d9',
  '--color-border-secondary': '#f0f0f0',

  '--border-radius': `${radius}px`,
  '--border-radius-sm': `${Math.max(radius - 2, 2)}px`,
  '--border-radius-lg': `${radius + 2}px`,

  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
  '--shadow-md': '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  '--shadow-lg': '0 12px 32px 0 rgba(0, 0, 0, 0.1), 0 6px 12px -6px rgba(0, 0, 0, 0.15), 0 18px 56px 16px rgba(0, 0, 0, 0.06)',

  '--transition-duration': '0.2s',
});

/**
 * 暗色主题变量
 */
const darkThemeVariables = (primaryColor: string, radius: number): Partial<CSSVariables> => ({
  '--color-primary': primaryColor,
  '--color-primary-hover': adjustColor(primaryColor, 15),
  '--color-primary-active': adjustColor(primaryColor, -10),

  '--color-bg-layout': '#000000',
  '--color-bg-container': '#141414',
  '--color-bg-elevated': '#1f1f1f',
  '--color-bg-sidebar': '#001529',
  '--color-bg-header': '#141414',

  '--color-text-primary': 'rgba(255, 255, 255, 0.85)',
  '--color-text-secondary': 'rgba(255, 255, 255, 0.65)',
  '--color-text-tertiary': 'rgba(255, 255, 255, 0.45)',
  '--color-text-disabled': 'rgba(255, 255, 255, 0.25)',

  '--color-border': '#424242',
  '--color-border-secondary': '#303030',

  '--border-radius': `${radius}px`,
  '--border-radius-sm': `${Math.max(radius - 2, 2)}px`,
  '--border-radius-lg': `${radius + 2}px`,

  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  '--shadow-md': '0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
  '--shadow-lg': '0 12px 32px 0 rgba(0, 0, 0, 0.4), 0 6px 12px -6px rgba(0, 0, 0, 0.6), 0 18px 56px 16px rgba(0, 0, 0, 0.24)',

  '--transition-duration': '0.2s',
});

/**
 * 调整颜色明度
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * 应用 CSS 变量到 document
 */
function applyCSSVariables(variables: Partial<CSSVariables>) {
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value);
    }
  });
}

/**
 * 应用尺寸变量
 */
function applySizeVariables(
  sidebarWidth: number,
  collapsedWidth: number,
  headerHeight: number,
  tabbarHeight: number
) {
  const root = document.documentElement;
  root.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  root.style.setProperty('--sidebar-collapsed-width', `${collapsedWidth}px`);
  root.style.setProperty('--header-height', `${headerHeight}px`);
  root.style.setProperty('--tabbar-height', `${tabbarHeight}px`);
}

/**
 * 主题提供者 Hook
 * 负责将 layout store 中的配置应用到 CSS 变量
 */
export function useThemeProvider() {
  const theme = useLayoutStore((state) => state.theme);
  const sidebar = useLayoutStore((state) => state.sidebar);
  const header = useLayoutStore((state) => state.header);
  const tabbar = useLayoutStore((state) => state.tabbar);

  useEffect(() => {
    // 确定实际的主题模式
    let isDark = theme.mode === 'dark';
    if (theme.mode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 应用主题 CSS 变量
    const variables = isDark
      ? darkThemeVariables(theme.colorPrimary, theme.radius)
      : lightThemeVariables(theme.colorPrimary, theme.radius);

    applyCSSVariables(variables);

    // 应用尺寸变量
    applySizeVariables(
      sidebar.width,
      sidebar.collapsedWidth,
      header.height,
      tabbar.height
    );

    // 切换 HTML 的 dark class（用于 Tailwind dark mode）
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, sidebar, header, tabbar]);

  // 监听系统主题变化
  useEffect(() => {
    if (theme.mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const variables = e.matches
        ? darkThemeVariables(theme.colorPrimary, theme.radius)
        : lightThemeVariables(theme.colorPrimary, theme.radius);
      applyCSSVariables(variables);

      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme.mode, theme.colorPrimary, theme.radius]);
}

/**
 * 获取 Ant Design 主题配置
 */
export function useAntdThemeConfig() {
  const theme = useLayoutStore((state) => state.theme);

  // 确定是否是暗色模式
  let isDark = theme.mode === 'dark';
  if (theme.mode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return {
    token: {
      colorPrimary: theme.colorPrimary,
      borderRadius: theme.radius,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      colorBgLayout: isDark ? '#000000' : '#f0f2f5',
      colorBgContainer: isDark ? '#141414' : '#ffffff',
      colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
    },
    components: {
      Menu: {
        darkItemBg: theme.semiDarkSidebar ? '#001529' : (isDark ? '#141414' : '#001529'),
        darkSubMenuItemBg: theme.semiDarkSidebar ? '#0c2135' : (isDark ? '#1f1f1f' : '#0c2135'),
        darkItemSelectedBg: theme.colorPrimary,
        darkItemColor: 'rgba(255, 255, 255, 0.7)',
        darkItemSelectedColor: '#ffffff',
        itemHeight: 40,
        itemMarginInline: 0,
        itemBorderRadius: 0,
        iconSize: 16,
        fontSize: 14,
      },
      Layout: {
        siderBg: theme.semiDarkSidebar ? '#001529' : (isDark ? '#141414' : '#001529'),
        headerBg: isDark ? '#141414' : '#ffffff',
        headerHeight: 48,
        bodyBg: isDark ? '#000000' : '#f0f2f5',
      },
      Breadcrumb: {
        itemColor: isDark ? 'rgba(255, 255, 255, 0.45)' : '#8b949e',
        lastItemColor: isDark ? 'rgba(255, 255, 255, 0.85)' : '#303133',
        separatorColor: isDark ? 'rgba(255, 255, 255, 0.25)' : '#d0d7de',
      },
      Button: {
        borderRadius: theme.radius,
        controlHeight: 32,
      },
      Input: {
        borderRadius: theme.radius,
      },
      Card: {
        borderRadius: theme.radius,
      },
      Table: {
        borderRadius: theme.radius,
      },
    },
    algorithm: isDark ? undefined : undefined, // 可以在这里添加 antd 的暗色算法
  };
}
