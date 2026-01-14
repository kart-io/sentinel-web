import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dropdown, type MenuProps } from 'antd';
import {
  X,
  Home,
  RotateCw,
  ChevronDown,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ArrowRight,
  XCircle,
  Pin,
} from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';

export interface Tab {
  key: string;
  title: string;
  icon?: React.ReactNode;
  closable: boolean;
  pinned?: boolean;
}

interface TabsViewProps {
  activeKey: string;
  tabs: Tab[];
  onTabClick: (key: string) => void;
  onClose: (key: string) => void;
  onCloseOthers: (key: string) => void;
  onCloseAll: () => void;
  onCloseLeft: (key: string) => void;
  onCloseRight: (key: string) => void;
  onRefresh?: () => void;
  onPin?: (key: string) => void;
}

/**
 * 增强的标签页视图组件
 * 支持右键菜单、刷新、最大化等功能
 */
const TabsView: React.FC<TabsViewProps> = ({
  activeKey,
  tabs,
  onTabClick,
  onClose,
  onCloseOthers,
  onCloseAll,
  onCloseLeft,
  onCloseRight,
  onRefresh,
  onPin,
}) => {
  const tabbar = useLayoutStore((state) => state.tabbar);
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 右键菜单项
  const getContextMenuItems = (tabKey: string): MenuProps['items'] => {
    const currentIndex = tabs.findIndex((t) => t.key === tabKey);
    const tab = tabs.find((t) => t.key === tabKey);
    const hasLeft = currentIndex > 0;
    const hasRight = currentIndex < tabs.length - 1;

    return [
      {
        key: 'refresh',
        label: '刷新当前',
        icon: <RotateCw size={14} />,
        onClick: () => onRefresh?.(),
      },
      { type: 'divider' },
      {
        key: 'pin',
        label: tab?.pinned ? '取消固定' : '固定标签',
        icon: <Pin size={14} />,
        onClick: () => onPin?.(tabKey),
      },
      { type: 'divider' },
      {
        key: 'close',
        label: '关闭当前',
        icon: <X size={14} />,
        disabled: !tab?.closable,
        onClick: () => onClose(tabKey),
      },
      {
        key: 'closeLeft',
        label: '关闭左侧',
        icon: <ArrowLeft size={14} />,
        disabled: !hasLeft,
        onClick: () => onCloseLeft(tabKey),
      },
      {
        key: 'closeRight',
        label: '关闭右侧',
        icon: <ArrowRight size={14} />,
        disabled: !hasRight,
        onClick: () => onCloseRight(tabKey),
      },
      {
        key: 'closeOthers',
        label: '关闭其他',
        icon: <XCircle size={14} />,
        onClick: () => onCloseOthers(tabKey),
      },
      {
        key: 'closeAll',
        label: '关闭全部',
        icon: <XCircle size={14} />,
        onClick: () => onCloseAll(),
      },
    ];
  };

  // 滚动到激活的标签页
  const scrollToActiveTab = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const activeTab = scrollContainerRef.current.querySelector(`[data-tab-key="${activeKey}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeKey]);

  useEffect(() => {
    scrollToActiveTab();
  }, [activeKey, scrollToActiveTab]);

  // 切换最大化
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    // 这里可以添加最大化逻辑
  };

  // 获取标签页样式类名
  const getTabClassName = (_tab: Tab, isActive: boolean) => {
    const baseClasses = `
      group relative flex items-center gap-2 px-3 py-1 text-xs cursor-pointer
      transition-all whitespace-nowrap select-none
    `;

    switch (tabbar.styleType) {
      case 'chrome':
        return `${baseClasses} rounded-t-sm border-t border-l border-r
          ${isActive
            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[var(--color-primary)] font-medium z-10 h-[calc(100%-1px)] translate-y-[1px]'
            : 'bg-transparent border-transparent text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 h-[calc(100%-4px)] hover:h-[calc(100%-1px)]'
          }
        `;
      case 'card':
        return `${baseClasses} rounded-md mx-0.5
          ${isActive
            ? 'bg-[var(--color-primary)] text-white shadow-sm'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
          }
        `;
      case 'brisk':
        return `${baseClasses}
          ${isActive
            ? 'text-[var(--color-primary)] font-medium border-b-2 border-[var(--color-primary)]'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }
        `;
      case 'plain':
      default:
        return `${baseClasses} rounded-sm
          ${isActive
            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
          }
        `;
    }
  };

  if (!tabbar.enable) return null;

  return (
    <div
      className={`
        bg-[var(--color-bg-layout)] flex items-end pt-1 px-2
        border-b border-gray-200 dark:border-gray-700 shadow-sm
        sticky top-[var(--header-height)] z-10 select-none overflow-hidden
      `}
      style={{ height: `${tabbar.height}px` }}
    >
      {/* 标签页列表 */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-end overflow-x-auto no-scrollbar h-full gap-1"
      >
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key || (tab.key === '/dashboard' && activeKey === '/');

          return (
            <Dropdown
              key={tab.key}
              menu={{ items: getContextMenuItems(tab.key) }}
              trigger={['contextMenu']}
            >
              <div
                data-tab-key={tab.key}
                className={getTabClassName(tab, isActive)}
                onClick={() => onTabClick(tab.key)}
              >
                {/* 固定标签图标 */}
                {tab.pinned && <Pin size={10} className="text-[var(--color-primary)]" />}

                {/* 标签图标 */}
                {tabbar.showIcon && tab.key === '/dashboard' && (
                  <Home size={12} className={isActive ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-gray-400'} />
                )}
                {tabbar.showIcon && tab.icon && tab.key !== '/dashboard' && tab.icon}

                {/* 标签标题 */}
                <span>{tab.title}</span>

                {/* 关闭按钮 */}
                {tab.closable && !tab.pinned && (
                  <X
                    size={12}
                    className={`
                      ml-1 -mr-1 rounded-full p-0.5 box-content
                      hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300
                      transition-colors
                      ${isActive
                        ? 'text-gray-400'
                        : 'text-gray-400 opacity-0 group-hover:opacity-100'
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose(tab.key);
                    }}
                  />
                )}
              </div>
            </Dropdown>
          );
        })}
      </div>

      {/* 工具栏 */}
      <div className="border-l border-gray-200 dark:border-gray-700 pl-2 ml-2 flex items-center gap-1 mb-1">
        {/* 刷新按钮 */}
        {tabbar.showRefresh && (
          <div
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer text-gray-500 dark:text-gray-400 transition-colors"
            onClick={onRefresh}
            title="刷新当前页面"
          >
            <RotateCw size={14} />
          </div>
        )}

        {/* 最大化按钮 */}
        {tabbar.showMaximize && (
          <div
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer text-gray-500 dark:text-gray-400 transition-colors"
            onClick={toggleMaximize}
            title={isMaximized ? '退出最大化' : '最大化'}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </div>
        )}

        {/* 更多操作 */}
        <Dropdown
          menu={{
            items: [
              { key: '1', label: '关闭其他', onClick: () => onCloseOthers(activeKey) },
              { key: '2', label: '关闭全部', onClick: onCloseAll },
            ],
          }}
        >
          <div className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer text-gray-500 dark:text-gray-400 transition-colors">
            <ChevronDown size={14} />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default TabsView;
