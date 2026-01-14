import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useLayoutStore, useLayoutComputed } from '@/store/layoutStore';

const { Sider } = Layout;

interface LayoutSidebarProps {
  menuItems: MenuProps['items'];
  selectedKeys: string[];
  onMenuClick: MenuProps['onClick'];
  logo?: React.ReactNode;
  collapsedLogo?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 增强的侧边栏组件 - 基于 Vben Admin
 * 特性:
 * - 悬停展开: 折叠状态下鼠标悬停自动展开
 * - 混合导航: 支持双列侧边栏布局
 * - 手风琴模式: 菜单项展开时自动折叠其他项
 * - 响应式: 移动端自动适配
 * - 主题适配: 支持亮色/暗色/半暗侧边栏
 */
const LayoutSidebar: React.FC<LayoutSidebarProps> = ({
  menuItems,
  selectedKeys,
  onMenuClick,
  logo,
  collapsedLogo,
  className = '',
  style = {},
}) => {
  const sidebar = useLayoutStore((state) => state.sidebar);
  const theme = useLayoutStore((state) => state.theme);
  const app = useLayoutStore((state) => state.app);
  const header = useLayoutStore((state) => state.header);
  const navigation = useLayoutStore((state) => state.navigation);
  const updateSidebar = useLayoutStore((state) => state.updateSidebar);

  const {
    showSidebar,
    isHeaderNav,
    isFullContent,
    isMixedNav,
    isSidebarMixedNav,
    isHeaderMixedNav,
  } = useLayoutComputed();

  // 悬停展开状态
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 计算实际的折叠状态（考虑悬停展开）
  const effectiveCollapsed = sidebar.collapsed && !(sidebar.expandOnHover && isHovering);

  // 处理鼠标进入 - 延迟展开避免误触
  const handleMouseEnter = useCallback(() => {
    if (!sidebar.expandOnHover || !sidebar.collapsed) return;

    const timeout = setTimeout(() => {
      setIsHovering(true);
    }, 150); // 150ms 延迟，提升体验
    setHoverTimeout(timeout);
  }, [sidebar.expandOnHover, sidebar.collapsed]);

  // 处理鼠标离开 - 立即折叠
  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovering(false);
  }, [hoverTimeout]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // 不显示侧边栏的情况
  if (!showSidebar || isHeaderNav || isFullContent || sidebar.hidden) {
    return null;
  }

  // 计算侧边栏宽度
  const sidebarWidth = effectiveCollapsed
    ? sidebar.collapsedWidth
    : isSidebarMixedNav || isHeaderMixedNav
    ? sidebar.mixedWidth
    : sidebar.width;

  // 确定侧边栏背景色 - 支持半暗模式
  const sidebarBg = theme.semiDarkSidebar ? '#001529' : undefined;

  // 计算侧边栏 margin-top (混合导航模式下)
  const sidebarMarginTop = isMixedNav && !app.isMobile ? header.height : 0;

  // 计算 z-index
  const sidebarZIndex = app.isMobile ? 1001 : isMixedNav ? 201 : 200;

  return (
    <>
      <Sider
        ref={sidebarRef}
        trigger={null}
        collapsible
        collapsed={effectiveCollapsed}
        width={sidebarWidth}
        collapsedWidth={sidebar.collapsedWidth}
        className={`
          !fixed left-0 top-0 bottom-0 h-full overflow-hidden
          transition-all duration-300 ease-in-out
          ${isHovering && sidebar.collapsed ? 'shadow-2xl' : 'shadow-lg'}
          ${className}
        `}
        style={{
          backgroundColor: sidebarBg,
          width: sidebarWidth,
          marginTop: sidebarMarginTop,
          height: `calc(100% - ${sidebarMarginTop}px)`,
          zIndex: sidebarZIndex,
          ...style,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo 区域 - 混合导航模式下不显示 */}
        {!isMixedNav && (
          <div
            className={`
              h-[${header.height}px] flex items-center justify-center relative overflow-hidden
              transition-all duration-300 shadow-sm border-b
              ${theme.semiDarkSidebar ? 'bg-[#001529] border-gray-800' : 'bg-inherit border-gray-200'}
            `}
            style={{ height: header.height }}
          >
            <div
              className={`
                flex items-center gap-4 transition-all duration-300
                ${effectiveCollapsed ? 'justify-center w-full' : 'w-full px-6'}
              `}
            >
              {effectiveCollapsed ? (
                collapsedLogo || (
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      S
                    </div>
                  </div>
                )
              ) : (
                logo || (
                  <>
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        S
                      </div>
                    </div>
                    <span className="font-bold text-lg text-white tracking-wide whitespace-nowrap opacity-100 transition-opacity duration-300">
                      Sentinel<span className="text-primary-foreground opacity-90">Admin</span>
                    </span>
                  </>
                )
              )}
            </div>
          </div>
        )}

        {/* 菜单区域 */}
        <div className="h-full overflow-hidden flex flex-col">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            onClick={onMenuClick}
            className="border-r-0 font-medium flex-1 overflow-y-auto select-none custom-scrollbar"
            inlineCollapsed={effectiveCollapsed}
            // 手风琴模式 - 只展开一个菜单项
            {...(navigation.accordion ? { accordion: true } : {})}
            style={{
              paddingTop: isMixedNav ? 8 : 0,
            }}
          />
        </div>

        {/* 悬停展开提示 */}
        {isHovering && sidebar.collapsed && sidebar.expandOnHover && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium animate-fade-in">
              松开鼠标自动折叠
            </div>
          </div>
        )}
      </Sider>

      {/* 移动端遮罩层 */}
      {app.isMobile && !sidebar.collapsed && (
        <div
          className="fixed inset-0 bg-overlay z-[1000] transition-opacity animate-fade-in"
          onClick={() => updateSidebar({ collapsed: true })}
        />
      )}
    </>
  );
};

export default LayoutSidebar;
