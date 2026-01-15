import { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import { Layout, ConfigProvider, Menu, Button, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { Home, Settings, LogOut } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLayoutStore, useLayoutComputed } from '@/store/layoutStore';
import { useThemeProvider, useAntdThemeConfig } from '@/theme/themeProvider';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import LayoutSidebar from '@/components/layout/LayoutSidebar';
import LayoutHeader from '@/components/layout/LayoutHeader';
import TabsView, { type Tab } from '@/components/layout/TabsView';
import PreferencesDrawer from '@/components/layout/PreferencesDrawer';
import {
  menuConfig,
  convertToAntdMenu,
  getTopLevelMenu,
  getSubMenu,
  getAllPathsMap,
  getParentKey,
} from '@/config/menuConfig';

const { Content, Sider } = Layout;

/**
 * 主布局组件 - 基于 Vben Admin
 * 支持 7 种布局模式:
 * - sidebar-nav: 侧边导航布局（默认）
 * - header-nav: 顶部导航布局
 * - mixed-nav: 混合导航布局（顶部一级+侧边二级）
 * - sidebar-mixed-nav: 侧边混合布局（双列侧边栏）
 * - header-mixed-nav: 顶部混合布局（顶部双行菜单）
 * - header-sidebar-nav: 顶部通栏+侧边布局
 * - full-content: 全屏内容布局
 */
export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // 布局状态
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
    isHeaderNav,
    isSidebarMixedNav,
    isHeaderMixedNav,
    isHeaderSidebarNav,
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

  // Mixed-nav 状态: 当前选中的一级菜单
  const [selectedTopMenu, setSelectedTopMenu] = useState<string>('dashboard');

  // sidebar-mixed-nav 右侧菜单显示状态
  const [sidebarMixedRightVisible, setSidebarMixedRightVisible] = useState<boolean>(true);
  const sidebarMixedLeftRef = useRef<HTMLDivElement>(null);
  const sidebarMixedRightRef = useRef<HTMLDivElement>(null);
  const [sidebarMixedMeasuredWidth, setSidebarMixedMeasuredWidth] = useState<number | null>(null);

  // 更新移动端状态
  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  // 菜单配置
  const fullMenuItems = convertToAntdMenu(menuConfig);
  const topLevelMenuItems = getTopLevelMenu(menuConfig);
  const pathsMap = getAllPathsMap(menuConfig);

  // 根据当前路径确定选中的一级菜单
  useEffect(() => {
    const parentKey = getParentKey(location.pathname, menuConfig);
    if (parentKey) {
      setSelectedTopMenu(parentKey);
    }
  }, [location.pathname]);

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  // 处理顶部菜单点击 (mixed-nav, header-mixed-nav)
  const handleTopMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedTopMenu(e.key);
    // mixed-nav: 切换侧边栏的二级菜单
    // header-mixed-nav: 切换顶部第二行的菜单
  };

  // 处理侧边栏一级菜单点击 (sidebar-mixed-nav)
  const handleSidebarTopMenuClick: MenuProps['onClick'] = (e) => {
    // 如果点击的是当前已选中的菜单，切换右侧菜单显示/隐藏
    if (e.key === selectedTopMenu) {
      setSidebarMixedRightVisible(!sidebarMixedRightVisible);
    } else {
      // 切换到新菜单，显示右侧菜单
      setSelectedTopMenu(e.key);
      setSidebarMixedRightVisible(true);
    }
  };

  // 为 sidebar-mixed-nav 创建只显示图标的菜单项
  const getIconOnlyMenuItems = () => {
    return topLevelMenuItems?.map((item: any) => ({
      key: item.key,
      icon: item.icon,
      label: '', // 空标签，只显示图标
      title: item.label, // 使用 title 作为 tooltip
    }));
  };

  // 获取侧边栏菜单项
  const getSidebarMenuItems = () => {
    if (isMixedNav || isHeaderSidebarNav) {
      // mixed-nav / header-sidebar-nav: 显示当前选中一级菜单的二级菜单
      return getSubMenu(selectedTopMenu, menuConfig);
    } else if (isSidebarMixedNav) {
      // sidebar-mixed-nav: 侧边栏显示一级菜单
      return topLevelMenuItems;
    } else {
      // 其他模式: 显示完整菜单
      return fullMenuItems;
    }
  };

  // 获取面包屑
  const getBreadcrumbs = useCallback(() => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const menuItem = pathsMap.get(url);
      let title = pathSnippets[index].charAt(0).toUpperCase() + pathSnippets[index].slice(1);
      if (menuItem?.label) title = menuItem.label;

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
            {breadcrumb.showIcon && menuItem?.icon && (
              <span className="flex items-center text-muted-foreground [&>svg]:w-3.5 [&>svg]:h-3.5">
                {menuItem.icon}
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

    if (breadcrumb.showHome) {
      const filteredItems = location.pathname === '/dashboard' ? [] : extraBreadcrumbItems;
      return [homeBreadcrumb, ...filteredItems];
    }

    return extraBreadcrumbItems;
  }, [location.pathname, pathsMap, breadcrumb.showIcon, breadcrumb.showHome]);

  // 更新标签页
  const updateTabs = useCallback(() => {
    const path = location.pathname;
    if (path === '/' || path === '/login') return;

    setTabs((prev) => {
      if (!Array.isArray(prev)) return [{ key: '/dashboard', title: '仪表板', closable: false }];
      if (prev.find((t) => t.key === path)) return prev;

      const menuItem = pathsMap.get(path);
      const title = menuItem?.label || '未命名';
      const icon = menuItem?.icon;
      return [...prev, { key: path, title, icon, closable: true }];
    });
  }, [location.pathname, pathsMap]);

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

  // ============= 布局模式: Full Content =============
  if (isFullContent) {
    return (
      <ConfigProvider theme={antdTheme}>
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
          <div className="w-full h-screen bg-background">
            {/* 浮动退出按钮 - 允许从 full-content 模式切换回其他模式 */}
            <div className="fixed top-4 right-4 z-[9999] flex gap-2">
              <Tooltip title="返回正常布局">
                <Button
                  type="primary"
                  size="small"
                  icon={<Settings size={14} />}
                  onClick={() => setPreferencesOpen(true)}
                >
                  设置
                </Button>
              </Tooltip>
              <Tooltip title="退出登录">
                <Button
                  size="small"
                  danger
                  icon={<LogOut size={14} />}
                  onClick={handleLogout}
                >
                  退出
                </Button>
              </Tooltip>
            </div>

            <Outlet />
          </div>
        </div>

        {/* Preferences Drawer */}
        <PreferencesDrawer open={preferencesOpen} onClose={() => setPreferencesOpen(false)} />
      </ConfigProvider>
    );
  }

  const sidebarMixedLeftWidth = sidebar.mixedWidth;
  const sidebarMixedRightWidth = sidebar.width;

  useLayoutEffect(() => {
    if (!isSidebarMixedNav) return;

    const measure = () => {
      const leftWidth = sidebarMixedLeftRef.current?.getBoundingClientRect().width ?? 0;
      const rightWidth = sidebarMixedRightVisible
        ? sidebarMixedRightRef.current?.getBoundingClientRect().width ?? 0
        : 0;
      const total = leftWidth + rightWidth;
      if (total > 0) setSidebarMixedMeasuredWidth(total);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isSidebarMixedNav, sidebarMixedRightVisible, sidebarMixedLeftWidth, sidebarMixedRightWidth]);

  const sidebarMixedOffset =
    sidebarMixedMeasuredWidth ??
    (sidebarMixedRightVisible
      ? sidebarMixedLeftWidth + sidebarMixedRightWidth
      : sidebarMixedLeftWidth);

  // 计算内容区域左边距
  const getContentMarginLeft = () => {
    if (isMobile) return 0;
    if (isHeaderNav || isHeaderMixedNav) return 0;
    if (isSidebarMixedNav) {
      // sidebar-mixed-nav: 左列 + 右列 (根据显示状态)
      return sidebarMixedOffset;
    }
    if (showSidebar) return sidebarWidth;
    return 0;
  };

  const contentMarginLeft = getContentMarginLeft();

  // 调试：输出 marginLeft
  console.log('🔍 Content marginLeft:', contentMarginLeft, 'px');
  console.log('🔍 isSidebarMixedNav:', isSidebarMixedNav);
  console.log('🔍 sidebarMixedRightVisible:', sidebarMixedRightVisible);

  // 计算顶部额外高度
  const getTopExtraHeight = () => {
    let extra = 0;
    if (isMixedNav || isHeaderSidebarNav) extra += 48; // 顶部一级菜单
    if (isHeaderMixedNav) extra += 88; // 双行菜单
    // header-nav 模式菜单在 Header 内部，不需要额外高度
    return extra;
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <Layout
        className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}
        style={{
          backgroundColor: isDarkMode ? 'rgb(10, 10, 10)' : 'rgb(248, 250, 252)',
        }}
      >
        {/* ============= Header (fixed 定位) ============= */}
        <div
          className="fixed top-0 left-0 right-0 z-[200]"
          style={{ height: `${header.height}px` }}
        >
          <LayoutHeader
            breadcrumbs={getBreadcrumbs()}
            user={user || undefined}
            onToggleSidebar={toggleSidebarCollapse}
            onLogout={handleLogout}
            onOpenSettings={() => setPreferencesOpen(true)}
            notificationCount={3}
            sidebarMixedRightVisible={sidebarMixedRightVisible}
            sidebarMixedOffset={sidebarMixedOffset}
            headerMenu={
              isHeaderNav ? (
                <Menu
                  mode="horizontal"
                  selectedKeys={[location.pathname]}
                  items={fullMenuItems}
                  onClick={handleMenuClick}
                  className="border-none flex-1"
                  style={{
                    lineHeight: `${header.height}px`,
                    backgroundColor: 'transparent',
                  }}
                />
              ) : undefined
            }
          />
        </div>

        {/* ============= Mixed-Nav: 顶部一级菜单 ============= */}
        {isMixedNav && (
          <div
            className="fixed left-0 right-0 z-[190] border-b border-border transition-all"
            style={{
              top: `${header.height}px`,
              backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
            }}
          >
            <Menu
              mode="horizontal"
              selectedKeys={[selectedTopMenu]}
              items={topLevelMenuItems}
              onClick={handleTopMenuClick}
              className="border-none"
              style={{
                lineHeight: '48px',
                backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
              }}
            />
          </div>
        )}

        {/* ============= Header-Mixed-Nav: 顶部双行菜单 ============= */}
        {isHeaderMixedNav && (
          <div
            className="fixed left-0 right-0 z-[190]"
            style={{
              top: `${header.height}px`,
              backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
            }}
          >
            {/* 第一行: 一级菜单 */}
            <div
              className="border-b border-border"
            >
              <Menu
                mode="horizontal"
                selectedKeys={[selectedTopMenu]}
                items={topLevelMenuItems}
                onClick={handleTopMenuClick}
                className="border-none"
                style={{
                  lineHeight: '44px',
                  backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
                }}
              />
            </div>
            {/* 第二行: 二级菜单 */}
            <div className="border-b border-border">
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={getSubMenu(selectedTopMenu, menuConfig)}
                onClick={handleMenuClick}
                className="border-none"
                style={{
                  lineHeight: '44px',
                  backgroundColor: isDarkMode ? 'rgb(26, 26, 26)' : '#fafafa',
                }}
              />
            </div>
          </div>
        )}

        {/* ============= Header-Sidebar-Nav: 顶部通栏一级菜单 + 侧边二级菜单 ============= */}
        {isHeaderSidebarNav && (
          <div
            className="fixed left-0 right-0 z-[190] border-b border-border"
            style={{
              top: `${header.height}px`,
              backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
            }}
          >
            <Menu
              mode="horizontal"
              selectedKeys={[selectedTopMenu]}
              items={topLevelMenuItems}
              onClick={handleTopMenuClick}
              className="border-none"
              style={{
                lineHeight: '48px',
                backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
              }}
            />
          </div>
        )}

        {/* ============= Sidebar-Mixed-Nav: 双列侧边栏 ============= */}
        {isSidebarMixedNav ? (
          <>
            {/* 左侧: 一级菜单 (窄列 - 仅图标) */}
            <Sider
              width={sidebarMixedLeftWidth}
              collapsed={false}
              className="fixed h-screen overflow-y-auto overflow-x-hidden border-r border-border transition-all z-[100]"
              ref={sidebarMixedLeftRef}
              style={{
                top: 0,
                height: '100vh',
                backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
                width: `${sidebarMixedLeftWidth}px`,
                minWidth: `${sidebarMixedLeftWidth}px`,
                maxWidth: `${sidebarMixedLeftWidth}px`,
                flex: `0 0 ${sidebarMixedLeftWidth}px`,
              }}
            >
              {/* Logo 区域 - 仅图标 */}
              <div
                className="flex items-center justify-center relative overflow-hidden transition-all duration-300 border-b"
                style={{
                  height: `${header.height}px`,
                  backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
                  borderColor: isDarkMode ? '#0f1419' : '#e5e7eb',
                }}
              >
                <a
                  href="/"
                  className="flex items-center justify-center no-underline hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/dashboard');
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="w-7 h-7 bg-[#0960bd] rounded-md flex items-center justify-center text-white font-bold text-base shadow-sm transition-all hover:shadow-md">
                      S
                    </div>
                  </div>
                </a>
              </div>

              <Menu
                mode="inline"
                selectedKeys={[selectedTopMenu]}
                items={getIconOnlyMenuItems()}
                onClick={handleSidebarTopMenuClick}
                inlineIndent={0}
                theme={isDarkMode ? 'dark' : 'light'}
                className="border-none [&_.ant-menu-item]:!flex [&_.ant-menu-item]:!items-center [&_.ant-menu-item]:!justify-center [&_.ant-menu-item]:!mx-2 [&_.ant-menu-item]:!my-1 [&_.ant-menu-item]:!rounded-md [&_.ant-menu-item]:!h-12 [&_.ant-menu-item]:!leading-[48px]"
                style={{
                  backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
                }}
              />
            </Sider>

            {/* 右侧: 二级菜单 (普通宽度侧边栏 - 显示当前一级菜单的子菜单) */}
            {sidebarMixedRightVisible && (
              <div
                id="sidebar-mixed-right-menu"
                className="border-r border-border"
                ref={sidebarMixedRightRef}
                style={{
                  position: 'fixed',
                  left: `${sidebarMixedLeftWidth}px`,
                  top: 0,
                  width: `${sidebarMixedRightWidth}px`,
                  minWidth: `${sidebarMixedRightWidth}px`,
                  maxWidth: `${sidebarMixedRightWidth}px`,
                  height: '100vh',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  backgroundColor: 'yellow',  // 改为黄色
                  zIndex: 90,
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                  borderRight: '5px solid green',  // 添加绿色右边框，显示菜单右边缘
                  flex: `0 0 ${sidebarMixedRightWidth}px`,
                }}
              >
                {/* Logo 文字区域 */}
                <div
                  className="flex items-center px-4 relative overflow-hidden transition-all duration-300 border-b"
                  style={{
                    height: `${header.height}px`,
                    backgroundColor: isDarkMode ? 'rgb(26, 26, 26)' : '#ffffff',
                    borderColor: isDarkMode ? '#0f1419' : '#e5e7eb',
                  }}
                >
                  <span className={`font-semibold text-base tracking-wide whitespace-nowrap truncate ${isDarkMode ? 'text-white' : 'text-foreground'}`}>
                    Sentinel Admin
                  </span>
                </div>

                <Menu
                  mode="inline"
                  selectedKeys={[location.pathname]}
                  items={getSubMenu(selectedTopMenu, menuConfig)}
                  onClick={handleMenuClick}
                  inlineIndent={16}
                  theme={isDarkMode ? 'dark' : 'light'}
                  className="border-none"
                  style={{
                    backgroundColor: isDarkMode ? 'rgb(26, 26, 26)' : '#ffffff',
                  }}
                />
              </div>
            )}
          </>
        ) : (
          /* 标准侧边栏 (sidebar-nav, mixed-nav, header-sidebar-nav) */
          showSidebar && (
            <LayoutSidebar
              menuItems={getSidebarMenuItems()}
              selectedKeys={[location.pathname]}
              onMenuClick={handleMenuClick}
            />
          )
        )}

        {/* ============= Main Content ============= */}
        <Layout
          className="transition-all duration-300"
          style={{
            marginLeft: `${contentMarginLeft}px`,
            marginTop: `${header.height + getTopExtraHeight()}px`,
            borderLeft: '5px solid blue',  // 添加蓝色边框，显示左边缘
            paddingLeft: 0,  // 强制移除 padding
            marginRight: 0,  // 强制移除右边距
          }}
        >
          {/* Tabbar */}
          {tabbar.enable && (
            <div className="sticky top-0 z-[50]">
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
            </div>
          )}

          {/* Content Area */}
          <Content
            className="min-h-screen transition-all"
            style={{
              backgroundColor: 'red',  // 临时改为红色
              padding: 0,  // 移除所有 padding
            }}
          >
            <div className={transition.enable ? 'animate-fade-in' : ''}>
              <Outlet />
            </div>
          </Content>

          {/* Footer */}
          {footer.enable && (
            <footer
              className={`text-center py-4 border-t border-border ${
                footer.fixed ? 'fixed bottom-0 left-0 right-0 z-[10]' : ''
              }`}
              style={{
                marginLeft: footer.fixed ? `${contentMarginLeft}px` : '0',
                backgroundColor: isDarkMode ? 'rgb(20, 20, 20)' : '#fff',
              }}
            >
              <span className="text-muted-foreground text-sm">
                Copyright © {new Date().getFullYear()} Sentinel Admin - Powered by Vben Admin
              </span>
            </footer>
          )}
        </Layout>

        {/* Preferences Drawer */}
        <PreferencesDrawer open={preferencesOpen} onClose={() => setPreferencesOpen(false)} />
      </Layout>
    </ConfigProvider>
  );
}
