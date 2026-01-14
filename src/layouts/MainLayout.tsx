import { useState, useEffect, useCallback } from 'react';
import { Layout, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Database,
  Users,
  Calendar,
  Settings,
  Home,
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLayoutStore, useLayoutComputed } from '@/store/layoutStore';
import { useThemeProvider, useAntdThemeConfig } from '@/theme/themeProvider';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import LayoutSidebar from '@/components/layout/LayoutSidebar';
import LayoutHeader from '@/components/layout/LayoutHeader';
import TabsView, { type Tab } from '@/components/layout/TabsView';
import PreferencesDrawer from '@/components/layout/PreferencesDrawer';

const { Content } = Layout;

/**
 * 主布局组件 - 基于 Vben Admin
 * 支持 7 种布局模式:
 * - sidebar-nav: 侧边导航布局（默认）
 * - header-nav: 顶部导航布局
 * - mixed-nav: 混合导航布局（顶部+侧边）
 * - sidebar-mixed-nav: 侧边混合布局（双列侧边栏）
 * - header-mixed-nav: 顶部混合布局（顶部双列）
 * - header-sidebar-nav: 顶部通栏+侧边布局
 * - full-content: 全屏内容布局
 */
export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // 布局状态
  const app = useLayoutStore((state) => state.app);
  const sidebar = useLayoutStore((state) => state.sidebar);
  const header = useLayoutStore((state) => state.header);
  const tabbar = useLayoutStore((state) => state.tabbar);
  const footer = useLayoutStore((state) => state.footer);
  const breadcrumb = useLayoutStore((state) => state.breadcrumb);
  const transition = useLayoutStore((state) => state.transition);
  const toggleSidebarCollapse = useLayoutStore((state) => state.toggleSidebarCollapse);
  const setIsMobile = useLayoutStore((state) => state.setIsMobile);

  // 计算属性
  const {
    showSidebar,
    isDarkMode,
    isMixedNav,
    isFullContent,
    sidebarWidth,
  } = useLayoutComputed();

  // 响应式
  const { isMobile } = useBreakpoint();

  // 应用主题
  useThemeProvider();
  const antdTheme = useAntdThemeConfig();

  // 偏好设置抽屉
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // 标签页状态
  const [tabs, setTabs] = useState<Tab[]>([
    { key: '/dashboard', title: '仪表板', closable: false },
  ]);

  // 更新移动端状态
  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  // 菜单配置
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: '仪表板',
    },
    {
      key: '/rag',
      icon: <Database size={18} />,
      label: 'RAG 知识库',
    },
    {
      key: '/user-center',
      icon: <Users size={18} />,
      label: '用户中心',
    },
    {
      key: '/scheduler',
      icon: <Calendar size={18} />,
      label: '任务调度',
    },
    {
      key: '/mui-demo',
      icon: <Database size={18} />,
      label: '组件演示',
    },
    {
      key: '/settings',
      icon: <Settings size={18} />,
      label: '系统设置',
    },
  ];

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  // 获取面包屑
  const getBreadcrumbs = useCallback(() => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const foundItem = menuItems?.find((item: any) => item?.key === url) as any;
      let title = pathSnippets[index].charAt(0).toUpperCase() + pathSnippets[index].slice(1);
      if (foundItem?.label) title = foundItem.label;

      const isLast = index === pathSnippets.length - 1;

      return {
        key: `breadcrumb-${url}`,
        title: (
          <span
            className={`flex items-center gap-1 leading-none ${
              isLast
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {breadcrumb.showIcon && foundItem?.icon && (
              <span className="flex items-center text-muted-foreground [&>svg]:w-3.5 [&>svg]:h-3.5">
                {foundItem.icon}
              </span>
            )}
            <span className="translate-y-[0.5px]">{title}</span>
          </span>
        ),
      };
    });

    const homeBreadcrumb = {
      key: 'breadcrumb-home',
      title: (
        <span
          className={`flex items-center gap-1 leading-none ${
            location.pathname === '/dashboard'
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          {breadcrumb.showIcon && <Home size={14} className="text-muted-foreground" />}
          <span className="translate-y-[0.5px]">首页</span>
        </span>
      ),
    };

    // 如果显示首页，且当前在 dashboard，则不重复显示 dashboard 面包屑
    if (breadcrumb.showHome) {
      const filteredItems = location.pathname === '/dashboard'
        ? []
        : extraBreadcrumbItems;
      return [homeBreadcrumb, ...filteredItems];
    }

    return extraBreadcrumbItems;
  }, [location.pathname, menuItems, breadcrumb.showIcon, breadcrumb.showHome]);

  // 更新标签页
  const updateTabs = useCallback(() => {
    const path = location.pathname;
    if (path === '/' || path === '/login') return;

    setTabs((prev) => {
      if (!Array.isArray(prev)) return [{ key: '/dashboard', title: '仪表板', closable: false }];
      if (prev.find((t) => t.key === path)) return prev;

      const menuItem = menuItems?.find((item: any) => item.key === path) as any;
      const title = menuItem?.label || '未命名';
      const icon = menuItem?.icon;
      return [...prev, { key: path, title, icon, closable: true }];
    });
  }, [location.pathname, menuItems]);

  useEffect(() => {
    if (tabbar.enable) {
      updateTabs();
    }
  }, [updateTabs, tabbar.enable]);

  // 标签页操作
  const handleTabClick = (key: string) => {
    navigate(key);
  };

  const handleCloseTab = (key: string) => {
    const newTabs = tabs.filter((t) => t.key !== key);
    setTabs(newTabs);

    if (key === location.pathname) {
      const lastTab = newTabs[newTabs.length - 1];
      if (lastTab) navigate(lastTab.key);
    }
  };

  const handleCloseOthers = (key: string) => {
    const current = tabs.find((t) => t.key === key);
    const homeTab = tabs.find((t) => t.key === '/dashboard');

    if (key === '/dashboard') {
      setTabs([{ key: '/dashboard', title: '仪表板', closable: false }]);
    } else if (homeTab && current) {
      setTabs([homeTab, { ...current, closable: true }]);
    }
  };

  const handleCloseAll = () => {
    setTabs([{ key: '/dashboard', title: '仪表板', closable: false }]);
    navigate('/dashboard');
  };

  const handleCloseLeft = (key: string) => {
    const index = tabs.findIndex((t) => t.key === key);
    const homeTab = tabs.find((t) => t.key === '/dashboard');
    const newTabs = [
      ...(homeTab ? [homeTab] : []),
      ...tabs.slice(index).filter((t) => t.key !== '/dashboard'),
    ];
    setTabs(newTabs);
  };

  const handleCloseRight = (key: string) => {
    const index = tabs.findIndex((t) => t.key === key);
    setTabs(tabs.slice(0, index + 1));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // 计算内容区域左边距 - fixed 模式下生效
  const contentMarginLeft = header.mode === 'fixed' && showSidebar && !app.isMobile
    ? sidebarWidth
    : 0;

  // 计算 Header Wrapper 高度 (包含 Header + Tabbar)
  const headerWrapperHeight = (header.enable ? header.height : 0) + (tabbar.enable ? tabbar.height : 0);

  // 计算 Tabbar 样式 (混合导航模式下需要考虑侧边栏)
  const tabbarMarginLeft = isMixedNav && showSidebar
    ? (sidebar.collapsed ? sidebar.collapsedWidth : sidebar.mixedWidth)
    : contentMarginLeft;

  return (
    <ConfigProvider theme={antdTheme}>
      <Layout className={`min-h-screen flex flex-row ${isDarkMode ? 'dark' : ''}`}>
        {/* 侧边栏 */}
        <LayoutSidebar
          menuItems={menuItems}
          selectedKeys={[location.pathname]}
          onMenuClick={handleMenuClick}
        />

        {/* 主内容区域 */}
        <Layout
          className="bg-background transition-all duration-300 flex flex-col min-h-screen"
          style={{
            marginLeft: contentMarginLeft,
            width: showSidebar ? `calc(100% - ${contentMarginLeft}px)` : '100%',
          }}
        >
          {/* 顶栏 & 标签栏容器 */}
          {!isFullContent && (
            <div
              className={`
                ${header.mode === 'fixed' ? 'sticky top-0 z-[200]' : ''}
                transition-all duration-200
              `}
              style={{
                marginLeft: isMixedNav && showSidebar ? tabbarMarginLeft - contentMarginLeft : 0,
              }}
            >
              {/* 顶栏 */}
              <LayoutHeader
                breadcrumbs={getBreadcrumbs()}
                user={user || undefined}
                onToggleSidebar={toggleSidebarCollapse}
                onLogout={handleLogout}
                onOpenSettings={() => setPreferencesOpen(true)}
                notificationCount={3}
              />

              {/* 标签页 */}
              {tabbar.enable && (
                <TabsView
                  activeKey={location.pathname}
                  tabs={tabs}
                  onTabClick={handleTabClick}
                  onClose={handleCloseTab}
                  onCloseOthers={handleCloseOthers}
                  onCloseAll={handleCloseAll}
                  onCloseLeft={handleCloseLeft}
                  onCloseRight={handleCloseRight}
                  onRefresh={handleRefresh}
                />
              )}
            </div>
          )}

          {/* 内容区域 */}
          <Content
            className="p-6 overflow-auto min-h-0 bg-background-deep flex-1"
            style={{
              marginTop: header.mode === 'fixed' && !isFullContent ? 0 : 0,
            }}
          >
            <div
              className={`w-full h-full ${
                transition.enable ? 'animate-fade-in' : ''
              }`}
            >
              <Outlet />
            </div>
          </Content>

          {/* 页脚 */}
          {footer.enable && !isFullContent && (
            <div className="text-center py-4 text-muted-foreground text-xs bg-background border-t border-border">
              Copyright ©{new Date().getFullYear()} Sentinel Admin - Powered by Vben Admin
            </div>
          )}
        </Layout>

        {/* 偏好设置抽屉 */}
        <PreferencesDrawer
          open={preferencesOpen}
          onClose={() => setPreferencesOpen(false)}
        />
      </Layout>
    </ConfigProvider>
  );
}
