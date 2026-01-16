import React from 'react';
import { Tooltip } from 'antd';
import { useLayoutStore } from '@/store/layoutStore';
import type { ContentCompactType } from '@/store/layoutStore';

interface ContentWidthOption {
  key: ContentCompactType;
  label: string;
  icon: React.ReactNode;
  tip?: string;
}

/**
 * 内容宽度选择器组件
 * 可视化展示并切换流式/定宽两种内容宽度模式
 */
const ContentWidthSelector: React.FC = () => {
  const contentCompact = useLayoutStore((state) => state.app.contentCompact);
  const updateApp = useLayoutStore((state) => state.updateApp);

  const widthOptions: ContentWidthOption[] = [
    {
      key: 'wide',
      label: '流式',
      tip: '内容区域宽度自适应，占满整个容器',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 流式布局 - 内容填满整个容器 */}
          <rect x="0" y="0" width="64" height="8" fill="currentColor" opacity="0.9" rx="2" />
          <line x1="4" y1="4" x2="60" y2="4" stroke="white" strokeWidth="1" strokeDasharray="4,2" opacity="0.5" />
          <rect x="0" y="10" width="64" height="38" fill="currentColor" opacity="0.2" rx="2" />
          {/* 内容块 */}
          <rect x="2" y="12" width="60" height="34" fill="currentColor" opacity="0.15" rx="1" />
        </svg>
      ),
    },
    {
      key: 'compact',
      label: '定宽',
      tip: '内容区域固定最大宽度，居中显示',
      icon: (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          {/* 定宽布局 - 内容居中固定宽度 */}
          <rect x="0" y="0" width="64" height="8" fill="currentColor" opacity="0.9" rx="2" />
          <line x1="4" y1="4" x2="60" y2="4" stroke="white" strokeWidth="1" strokeDasharray="4,2" opacity="0.5" />
          <rect x="0" y="10" width="64" height="38" fill="currentColor" opacity="0.2" rx="2" />
          {/* 内容块 - 居中固定宽度 */}
          <rect x="12" y="12" width="40" height="34" fill="currentColor" opacity="0.15" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">内容</h3>
      <div className="grid grid-cols-2 gap-4">
        {widthOptions.map((option) => (
          <Tooltip key={option.key} title={option.tip} placement="top">
            <div
              onClick={() => updateApp({ contentCompact: option.key })}
              className={`
                relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-[1.02]
                ${contentCompact === option.key
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm'
                }
              `}
            >
              <div className="aspect-[4/3] p-3 text-primary">
                {option.icon}
              </div>
              <div className="px-2 pb-2 text-center">
                <span className={`text-xs transition-colors duration-200 ${contentCompact === option.key ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
              </div>
              {contentCompact === option.key && (
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

export default ContentWidthSelector;
