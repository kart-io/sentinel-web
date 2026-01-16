import React, { useState, useEffect, useRef } from 'react';
import { Layout, Breadcrumb, Tooltip, Avatar, Dropdown, Badge } from 'antd';
import type { MenuProps, BreadcrumbProps } from 'antd';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Github,
  Maximize,
  Minimize,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useLayoutStore, useLayoutComputed } from '@/store/layoutStore';

const { Header } = Layout;

type BreadcrumbItem = NonNullable<BreadcrumbProps['items']>[number];

interface LayoutHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  user?: {
    username?: string;
    avatar?: string;
  };
  onToggleSidebar: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onSearch?: () => void;
  notificationCount?: number;
  // header-nav 模式下的菜单
  headerMenu?: React.ReactNode;
  // sidebar-mixed-nav 模式下右侧菜单是否可见
  sidebarMixedRightVisible?: boolean;
  // sidebar-mixed-nav 模式下内容区域偏移（用于对齐）
  sidebarMixedOffset?: number;
}

/**
 * 增强的顶栏组件 - 基于 Vben Admin
 * 特性:
 * - 自动隐藏: auto 模式下鼠标离开顶部自动隐藏
 * - 滚动隐藏: auto-scroll 模式下滚动时自动隐藏/显示
 * - 全屏切换: 支持全屏模式切换
 * - 主题切换: 亮色/暗色模式快速切换
 * - 响应式: 移动端自动适配
 * - 通知中心: 消息通知徽章
 */
const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  breadcrumbs,
  user,
  onToggleSidebar,
  onLogout,
  onOpenSettings,
  onSearch,
  notificationCount = 0,
  headerMenu,
  sidebarMixedRightVisible = true,
  sidebarMixedOffset,
}) => {
  const header = useLayoutStore((state) => state.header);
  const sidebar = useLayoutStore((state) => state.sidebar);
  const breadcrumbSettings = useLayoutStore((state) => state.breadcrumb);
  const app = useLayoutStore((state) => state.app);
  const tabbar = useLayoutStore((state) => state.tabbar);
  const toggleThemeMode = useLayoutStore((state) => state.toggleThemeMode);

  const { showSidebar, isDarkMode, isMixedNav, showHeaderLogo, isHeaderNav, isSidebarMixedNav, isHeaderMixedNav, isHeaderSidebarNav } = useLayoutComputed();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // auto-scroll 模式: 滚动时自动隐藏/显示
  useEffect(() => {
    if (header.mode !== 'auto-scroll') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 顶部附近不隐藏
      if (currentScrollY < header.height) {
        setIsHidden(false);
        return;
      }

      // 向下滚动 - 隐藏 Header
      if (currentScrollY > lastScrollY && currentScrollY > header.height) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // 向上滚动 - 显示 Header
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [header.mode, header.height, lastScrollY]);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 用户菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'header',
      label: (
        <div className="px-1 py-1 cursor-default">
          <p className="font-semibold text-foreground m-0">
            {user?.username || 'Admin'}
          </p>
        </div>
      ),
      disabled: true,
      className: 'hover:bg-transparent cursor-default',
    },
    { type: 'divider' },
    { key: 'profile', icon: <User size={14} />, label: '个人中心' },
    { key: 'settings', icon: <Settings size={14} />, label: '个人设置' },
    { type: 'divider' },
    { key: 'logout', icon: <LogOut size={14} />, label: '退出登录', danger: true },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      onLogout();
    }
  };

  if (!header.enable) return null;

  // 计算 Header 位置样式
  const headerStyles: React.CSSProperties = {
    height: header.height,
    lineHeight: `${header.height}px`,
    // auto-scroll 模式下的动画
    transform: isHidden ? `translateY(-${header.height + (tabbar.enable ? tabbar.height : 0)}px)` : 'translateY(0)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const sidebarMixedLeftWidth = sidebar.mixedWidth;
  const sidebarMixedRightWidth = sidebar.width;

  // 计算左侧边距
  // 注意：sidebar-nav 模式下，Header 的定位由 MainLayout 的 wrapper 控制，这里不需要 marginLeft
  // mixed-nav: Header 为混合侧边栏留出空间
  // sidebar-mixed-nav: Header 需要为双列侧边栏留出空间（根据右侧菜单显示状态）
  const isSidebarNav = app.layout === 'sidebar-nav';
  const headerMarginLeft = !app.isMobile && !isSidebarNav && (showSidebar || isSidebarMixedNav)
    ? (isMixedNav
        ? (sidebar.collapsed ? sidebar.collapsedWidth : sidebar.mixedWidth)
        : isSidebarMixedNav
          ? (sidebarMixedOffset ?? (sidebarMixedRightVisible
              ? sidebarMixedLeftWidth + sidebarMixedRightWidth
              : sidebarMixedLeftWidth))
          : (sidebar.collapsed ? sidebar.collapsedWidth : sidebar.width))
    : 0;

  return (
    <Header
      ref={headerRef}
      className={`
        bg-header px-0 flex items-center justify-between
        ${!isHeaderNav && !isMixedNav && !isHeaderMixedNav && !isHeaderSidebarNav ? 'shadow-sm border-b border-border' : 'border-b border-border'}
        transition-colors duration-200
      `}
        style={{
          height: header.height,
          lineHeight: `${header.height}px`,
          transform: isHidden ? `translateY(-${header.height + (tabbar.enable ? tabbar.height : 0)}px)` : 'translateY(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // sidebar-nav 模式下，定位由 wrapper 控制，Header 占满 wrapper 宽度
          marginLeft: isSidebarNav ? 0 : headerMarginLeft,
          width: isSidebarNav ? '100%' : `calc(100% - ${headerMarginLeft}px)`,
        }}
    >
      {/* 左侧区域 */}
      <div className="flex items-center h-full">
        {/* Logo - header-nav, mixed-nav, header-mixed-nav, full-content 模式显示 */}
        {showHeaderLogo && (
          <div className={`h-full flex items-center px-4 ${!showSidebar ? 'border-r border-border min-w-[210px]' : ''}`}>
            <a
              href="/"
              className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <div className="w-7 h-7 bg-[#0960bd] rounded-md flex items-center justify-center text-white font-bold text-base shadow-sm hover:shadow-md transition-all">
                  S
                </div>
              </div>
              <span className="font-semibold text-base tracking-wide whitespace-nowrap truncate text-foreground dark:text-white">
                Sentinel Admin
              </span>
            </a>
          </div>
        )}

        {/* 侧边栏切换按钮 - 仅在有侧边栏且不是 mixed-nav 时显示 */}
        {showSidebar && !isMixedNav && !showHeaderLogo && (
          <div
            onClick={onToggleSidebar}
            className="h-full flex items-center justify-center px-4 hover:bg-accent cursor-pointer text-muted-foreground transition-colors"
          >
            {sidebar.collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </div>
        )}

        {/* header-nav 模式: 水平菜单直接在 Header 中 */}
        {isHeaderNav && headerMenu && (
          <div className="flex-1 h-full flex items-center">
            {headerMenu}
          </div>
        )}

        {/* 其他模式: 面包屑 */}
        {!isHeaderNav && breadcrumbSettings.enable && (
          <Breadcrumb
            items={breadcrumbs}
            className="flex text-sm text-muted-foreground ml-1 items-center !mb-0"
            separator={<ChevronRight size={14} className="text-muted-foreground/60 mt-[1px]" />}
          />
        )}
      </div>

      {/* 右侧工具栏 */}
      <div className="flex items-center h-full gap-1 ml-auto">
        {/* 搜索按钮 */}
        {onSearch && (
          <Tooltip title="搜索 (⌘K)">
            <div
              onClick={onSearch}
              className="h-full px-2.5 flex items-center hover:bg-accent cursor-pointer text-muted-foreground transition-colors rounded-md"
            >
              <Search size={16} />
            </div>
          </Tooltip>
        )}

        {/* GitHub */}
        <Tooltip title="源码">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-full px-2.5 flex items-center hover:bg-accent cursor-pointer text-muted-foreground transition-colors rounded-md"
          >
            <Github size={16} />
          </a>
        </Tooltip>

        {/* 主题切换 */}
        <Tooltip title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}>
          <div
            onClick={toggleThemeMode}
            className="h-full px-2.5 flex items-center hover:bg-accent cursor-pointer text-muted-foreground transition-colors rounded-md"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </div>
        </Tooltip>

        {/* 全屏 */}
        <Tooltip title={isFullscreen ? '退出全屏 (F11)' : '全屏 (F11)'}>
          <div
            onClick={toggleFullscreen}
            className="h-full px-2.5 flex items-center hover:bg-accent cursor-pointer text-muted-foreground transition-colors rounded-md"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </div>
        </Tooltip>

        {/* 通知 */}
        <Tooltip title="通知">
          <Badge count={notificationCount} size="small" offset={[-2, 2]}>
            <div className="h-full px-2.5 flex items-center hover:bg-accent cursor-pointer text-muted-foreground rounded-md">
              <Bell size={16} />
            </div>
          </Badge>
        </Tooltip>

        {/* 用户菜单 */}
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
          trigger={['hover']}
        >
          <div className="h-full pl-2 pr-1 flex items-center gap-2 hover:bg-accent cursor-pointer transition-colors rounded-md">
            <Avatar size={24} src={user?.avatar} className="bg-primary">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
            <span className="hidden sm:block text-sm font-medium text-foreground">
              {user?.username || 'Admin'}
            </span>
          </div>
        </Dropdown>

        {/* 分隔线 */}
        <div className="h-6 w-px bg-border mx-1"></div>

        {/* 设置按钮 - 放在最右边 */}
        <Tooltip title="系统设置">
          <div
            onClick={onOpenSettings}
            className="h-full pl-2.5 pr-2 flex items-center hover:bg-accent cursor-pointer text-muted-foreground transition-colors rounded-md"
          >
            <Settings size={16} />
          </div>
        </Tooltip>
      </div>
    </Header>
  );
};

export default LayoutHeader;
