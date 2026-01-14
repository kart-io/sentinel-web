import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * 布局类型 - 参考 vben-admin 的 7 种布局模式
 */
export type LayoutType =
  | 'sidebar-nav'        // 侧边导航布局（默认）
  | 'header-nav'         // 顶部导航布局
  | 'mixed-nav'          // 混合导航布局（顶部+侧边）
  | 'sidebar-mixed-nav'  // 侧边混合布局（双列侧边栏）
  | 'header-mixed-nav'   // 顶部混合布局（顶部双列）
  | 'header-sidebar-nav' // 顶部通栏+侧边布局
  | 'full-content';      // 全屏内容布局

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Header 模式
 */
export type HeaderMode = 'fixed' | 'static' | 'auto' | 'auto-scroll';

/**
 * 标签页样式
 */
export type TabsStyleType = 'chrome' | 'card' | 'brisk' | 'plain';

/**
 * 内容区域宽度模式
 */
export type ContentCompactType = 'wide' | 'compact';

/**
 * 导航菜单样式
 */
export type NavigationStyleType = 'rounded' | 'plain';

/**
 * 主题色预设
 */
export const themeColorPresets = {
  default: '#0960bd',
  violet: '#7c3aed',
  pink: '#db2777',
  rose: '#e11d48',
  orange: '#ea580c',
  green: '#16a34a',
  skyBlue: '#0284c7',
  cyan: '#0891b2',
} as const;

export type ThemeColorKey = keyof typeof themeColorPresets;

/**
 * 侧边栏配置
 */
interface SidebarPreferences {
  width: number;
  collapsedWidth: number;
  collapsed: boolean;
  expandOnHover: boolean;
  mixedWidth: number;
  hidden: boolean;
}

/**
 * Header 配置
 */
interface HeaderPreferences {
  enable: boolean;
  height: number;
  mode: HeaderMode;
  menuAlign: 'start' | 'center' | 'end';
}

/**
 * 标签页配置
 */
interface TabbarPreferences {
  enable: boolean;
  height: number;
  styleType: TabsStyleType;
  keepAlive: boolean;
  persist: boolean;
  showIcon: boolean;
  showMaximize: boolean;
  showRefresh: boolean;
}

/**
 * 底栏配置
 */
interface FooterPreferences {
  enable: boolean;
  fixed: boolean;
}

/**
 * 导航配置
 */
interface NavigationPreferences {
  accordion: boolean;
  styleType: NavigationStyleType;
  split: boolean;
}

/**
 * 面包屑配置
 */
interface BreadcrumbPreferences {
  enable: boolean;
  showIcon: boolean;
  showHome: boolean;
}

/**
 * 主题配置
 */
interface ThemePreferences {
  mode: ThemeMode;
  colorPrimary: string;
  colorPrimaryKey: ThemeColorKey;
  radius: number;
  semiDarkSidebar: boolean;
  semiDarkHeader: boolean;
}

/**
 * 动画配置
 */
interface TransitionPreferences {
  enable: boolean;
  name: 'fade' | 'fade-slide' | 'fade-up' | 'fade-down';
  loading: boolean;
}

/**
 * 完整的偏好设置配置
 */
export interface LayoutPreferences {
  app: {
    layout: LayoutType;
    contentCompact: ContentCompactType;
    contentCompactWidth: number;
    isMobile: boolean;
    locale: string;
  };
  sidebar: SidebarPreferences;
  header: HeaderPreferences;
  tabbar: TabbarPreferences;
  footer: FooterPreferences;
  navigation: NavigationPreferences;
  breadcrumb: BreadcrumbPreferences;
  theme: ThemePreferences;
  transition: TransitionPreferences;
}

/**
 * 默认配置
 */
const defaultPreferences: LayoutPreferences = {
  app: {
    layout: 'sidebar-nav',
    contentCompact: 'wide',
    contentCompactWidth: 1200,
    isMobile: false,
    locale: 'zh-CN',
  },
  sidebar: {
    width: 210,
    collapsedWidth: 64,
    collapsed: false,
    expandOnHover: true,
    mixedWidth: 80,
    hidden: false,
  },
  header: {
    enable: true,
    height: 48,
    mode: 'fixed',
    menuAlign: 'start',
  },
  tabbar: {
    enable: true,
    height: 32,
    styleType: 'chrome',
    keepAlive: true,
    persist: true,
    showIcon: true,
    showMaximize: true,
    showRefresh: true,
  },
  footer: {
    enable: true,
    fixed: false,
  },
  navigation: {
    accordion: true,
    styleType: 'rounded',
    split: false,
  },
  breadcrumb: {
    enable: true,
    showIcon: true,
    showHome: true,
  },
  theme: {
    mode: 'light',
    colorPrimary: '#0960bd',
    colorPrimaryKey: 'default',
    radius: 6,
    semiDarkSidebar: true,
    semiDarkHeader: false,
  },
  transition: {
    enable: true,
    name: 'fade-slide',
    loading: true,
  },
};

/**
 * Layout Store Actions
 */
interface LayoutActions {
  // 更新偏好设置
  updatePreferences: (preferences: Partial<LayoutPreferences>) => void;
  // 重置偏好设置
  resetPreferences: () => void;
  // 切换侧边栏折叠状态
  toggleSidebarCollapse: () => void;
  // 切换主题模式
  toggleThemeMode: () => void;
  // 设置主题色
  setThemeColor: (color: string, key?: ThemeColorKey) => void;
  // 设置布局类型
  setLayout: (layout: LayoutType) => void;
  // 设置移动端状态
  setIsMobile: (isMobile: boolean) => void;
  // 切换标签栏显示
  toggleTabbar: () => void;
  // 切换面包屑显示
  toggleBreadcrumb: () => void;
  // 切换页脚显示
  toggleFooter: () => void;
  // 更新侧边栏设置
  updateSidebar: (sidebar: Partial<SidebarPreferences>) => void;
  // 更新 Header 设置
  updateHeader: (header: Partial<HeaderPreferences>) => void;
  // 更新标签页设置
  updateTabbar: (tabbar: Partial<TabbarPreferences>) => void;
  // 更新主题设置
  updateTheme: (theme: Partial<ThemePreferences>) => void;
}

type LayoutState = LayoutPreferences & LayoutActions;

/**
 * 布局偏好设置 Store
 */
export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      ...defaultPreferences,

      updatePreferences: (preferences) => {
        set((state) => {
          const newState = { ...state };
          Object.keys(preferences).forEach((key) => {
            const prefKey = key as keyof LayoutPreferences;
            if (preferences[prefKey]) {
              (newState as any)[prefKey] = {
                ...(state as any)[prefKey],
                ...(preferences as any)[prefKey],
              };
            }
          });
          return newState;
        });
      },

      resetPreferences: () => {
        set(defaultPreferences);
      },

      toggleSidebarCollapse: () => {
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            collapsed: !state.sidebar.collapsed,
          },
        }));
      },

      toggleThemeMode: () => {
        set((state) => ({
          theme: {
            ...state.theme,
            mode: state.theme.mode === 'light' ? 'dark' : 'light',
          },
        }));
      },

      setThemeColor: (color, key) => {
        set((state) => ({
          theme: {
            ...state.theme,
            colorPrimary: color,
            colorPrimaryKey: key || 'default',
          },
        }));
      },

      setLayout: (layout) => {
        set((state) => ({
          app: {
            ...state.app,
            layout,
          },
        }));
      },

      setIsMobile: (isMobile) => {
        set((state) => ({
          app: {
            ...state.app,
            isMobile,
          },
          sidebar: {
            ...state.sidebar,
            collapsed: isMobile ? true : state.sidebar.collapsed,
          },
        }));
      },

      toggleTabbar: () => {
        set((state) => ({
          tabbar: {
            ...state.tabbar,
            enable: !state.tabbar.enable,
          },
        }));
      },

      toggleBreadcrumb: () => {
        set((state) => ({
          breadcrumb: {
            ...state.breadcrumb,
            enable: !state.breadcrumb.enable,
          },
        }));
      },

      toggleFooter: () => {
        set((state) => ({
          footer: {
            ...state.footer,
            enable: !state.footer.enable,
          },
        }));
      },

      updateSidebar: (sidebar) => {
        set((state) => ({
          sidebar: { ...state.sidebar, ...sidebar },
        }));
      },

      updateHeader: (header) => {
        set((state) => ({
          header: { ...state.header, ...header },
        }));
      },

      updateTabbar: (tabbar) => {
        set((state) => ({
          tabbar: { ...state.tabbar, ...tabbar },
        }));
      },

      updateTheme: (theme) => {
        set((state) => ({
          theme: { ...state.theme, ...theme },
        }));
      },
    }),
    {
      name: 'layout-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        app: state.app,
        sidebar: state.sidebar,
        header: state.header,
        tabbar: state.tabbar,
        footer: state.footer,
        navigation: state.navigation,
        breadcrumb: state.breadcrumb,
        theme: state.theme,
        transition: state.transition,
      }),
    }
  )
);

/**
 * 布局相关的计算属性 hooks
 */
export const useLayoutComputed = () => {
  const state = useLayoutStore();

  const isFullContent = state.app.layout === 'full-content';
  const isSidebarNav = state.app.layout === 'sidebar-nav';
  const isHeaderNav = state.app.layout === 'header-nav';
  const isMixedNav = state.app.layout === 'mixed-nav';
  const isSidebarMixedNav = state.app.layout === 'sidebar-mixed-nav';
  const isHeaderMixedNav = state.app.layout === 'header-mixed-nav';
  const isHeaderSidebarNav = state.app.layout === 'header-sidebar-nav';

  // 是否显示侧边栏
  const showSidebar = !isFullContent && !isHeaderNav && !state.sidebar.hidden;

  // 是否显示顶部菜单
  const showHeaderMenu = isHeaderNav || isMixedNav || isHeaderMixedNav;

  // 计算侧边栏实际宽度
  const sidebarWidth = state.sidebar.collapsed
    ? state.sidebar.collapsedWidth
    : state.sidebar.width;

  // 计算内容区域左边距
  const contentMarginLeft = showSidebar ? sidebarWidth : 0;

  // 是否是暗色模式
  const isDarkMode = state.theme.mode === 'dark' ||
    (state.theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return {
    isFullContent,
    isSidebarNav,
    isHeaderNav,
    isMixedNav,
    isSidebarMixedNav,
    isHeaderMixedNav,
    isHeaderSidebarNav,
    showSidebar,
    showHeaderMenu,
    sidebarWidth,
    contentMarginLeft,
    isDarkMode,
  };
};
