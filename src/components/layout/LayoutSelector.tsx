import React from 'react';
import { Tooltip } from 'antd';
import { useLayoutStore } from '@/store/layoutStore';

interface LayoutOption {
  key: string;
  label: string;
  icon: React.ReactNode;
  tip?: string;
}

/**
 * 布局选择器组件 - 基于 Vben Admin
 * 可视化展示并切换 7 种布局模式
 */
const LayoutSelector: React.FC = () => {
  const layout = useLayoutStore((state) => state.app.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  const layoutOptions: LayoutOption[] = [
    {
      key: 'sidebar-nav',
      label: '垂直',
      tip: '经典侧边栏布局，菜单位于左侧',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 侧边栏 */}
          <rect x="0" y="0" width="16" height="48" fill="currentColor" opacity="0.9" rx="2" />
          {/* 菜单项 */}
          <rect x="2" y="6" width="12" height="4" fill="white" opacity="0.3" rx="1" />
          <rect x="2" y="12" width="12" height="4" fill="white" opacity="0.3" rx="1" />
          <rect x="2" y="18" width="12" height="4" fill="white" opacity="0.3" rx="1" />
          {/* 内容区 */}
          <rect x="18" y="0" width="46" height="48" fill="currentColor" opacity="0.2" rx="2" />
        </svg>
      ),
    },
    {
      key: 'sidebar-mixed-nav',
      label: '双列菜单',
      tip: '双列侧边栏，一级菜单图标+二级菜单文字',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 左侧窄列 */}
          <rect x="0" y="0" width="10" height="48" fill="currentColor" opacity="0.9" rx="2" />
          <rect x="2" y="6" width="6" height="4" fill="white" opacity="0.3" rx="1" />
          <rect x="2" y="12" width="6" height="4" fill="white" opacity="0.3" rx="1" />
          {/* 右侧宽列 */}
          <rect x="12" y="0" width="16" height="48" fill="currentColor" opacity="0.7" rx="2" />
          <rect x="14" y="6" width="12" height="3" fill="white" opacity="0.3" rx="1" />
          <rect x="14" y="11" width="12" height="3" fill="white" opacity="0.3" rx="1" />
          {/* 内容区 */}
          <rect x="30" y="0" width="34" height="48" fill="currentColor" opacity="0.2" rx="2" />
        </svg>
      ),
    },
    {
      key: 'header-nav',
      label: '水平',
      tip: '顶部导航布局，菜单位于顶部',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 顶部菜单栏 */}
          <rect x="0" y="0" width="64" height="10" fill="currentColor" opacity="0.9" rx="2" />
          <rect x="4" y="3" width="8" height="4" fill="white" opacity="0.3" rx="1" />
          <rect x="14" y="3" width="8" height="4" fill="white" opacity="0.3" rx="1" />
          <rect x="24" y="3" width="8" height="4" fill="white" opacity="0.3" rx="1" />
          {/* 内容区 */}
          <rect x="0" y="12" width="64" height="36" fill="currentColor" opacity="0.2" rx="2" />
        </svg>
      ),
    },
    {
      key: 'header-sidebar-nav',
      label: '侧边导航',
      tip: '顶部通栏一级菜单+侧边二级菜单',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 顶部菜单栏（虚线表示一级菜单） */}
          <rect x="0" y="0" width="64" height="8" fill="currentColor" opacity="0.9" rx="2" />
          <line x1="4" y1="4" x2="60" y2="4" stroke="white" strokeWidth="1" strokeDasharray="4,2" opacity="0.5" />
          {/* 侧边栏 */}
          <rect x="0" y="10" width="16" height="38" fill="currentColor" opacity="0.7" rx="2" />
          <rect x="2" y="14" width="12" height="3" fill="white" opacity="0.3" rx="1" />
          <rect x="2" y="19" width="12" height="3" fill="white" opacity="0.3" rx="1" />
          {/* 内容区 */}
          <rect x="18" y="10" width="46" height="38" fill="currentColor" opacity="0.2" rx="2" />
        </svg>
      ),
    },
    {
      key: 'mixed-nav',
      label: '混合菜单',
      tip: '顶部一级菜单+侧边二级菜单',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 顶部一级菜单（实线） */}
          <rect x="16" y="0" width="48" height="8" fill="currentColor" opacity="0.9" rx="2" />
          <rect x="20" y="2" width="8" height="4" fill="white" opacity="0.3" rx="1" />
          <rect x="30" y="2" width="8" height="4" fill="white" opacity="0.3" rx="1" />
          {/* 侧边栏 */}
          <rect x="0" y="10" width="16" height="38" fill="currentColor" opacity="0.7" rx="2" />
          <rect x="2" y="14" width="12" height="3" fill="white" opacity="0.3" rx="1" />
          <rect x="2" y="19" width="12" height="3" fill="white" opacity="0.3" rx="1" />
          {/* 内容区 */}
          <rect x="18" y="10" width="46" height="38" fill="currentColor" opacity="0.2" rx="2" />
        </svg>
      ),
    },
    {
      key: 'header-mixed-nav',
      label: '混合双列',
      tip: '顶部双行菜单，一级+二级',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 顶部第一行菜单 */}
          <rect x="0" y="0" width="64" height="6" fill="currentColor" opacity="0.9" rx="2" />
          <rect x="4" y="1" width="8" height="4" fill="white" opacity="0.3" rx="1" />
          {/* 顶部第二行菜单 */}
          <rect x="0" y="8" width="64" height="6" fill="currentColor" opacity="0.7" rx="2" />
          <line x1="4" y1="11" x2="60" y2="11" stroke="white" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
          {/* 内容区 */}
          <rect x="0" y="16" width="64" height="32" fill="currentColor" opacity="0.2" rx="2" />
        </svg>
      ),
    },
    {
      key: 'full-content',
      label: '内容全屏',
      tip: '全屏内容布局，无侧边栏和菜单',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 全屏内容 */}
          <rect x="0" y="0" width="64" height="48" fill="currentColor" opacity="0.2" rx="2" />
          <rect x="4" y="4" width="56" height="40" fill="currentColor" opacity="0.1" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">布局</h3>
      <div className="grid grid-cols-3 gap-4">
        {layoutOptions.map((option) => (
          <Tooltip key={option.key} title={option.tip} placement="top">
            <div
              onClick={() => setLayout(option.key as any)}
              className={`
                relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-[1.02]
                ${layout === option.key
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm'
                }
              `}
            >
              <div className="aspect-[4/3] p-3 text-primary">
                {option.icon}
              </div>
              <div className="px-2 pb-2 text-center">
                <span className={`text-xs transition-colors duration-200 ${layout === option.key ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
              </div>
              {layout === option.key && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
