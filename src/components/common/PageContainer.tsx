import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 页面容器组件
 *
 * 用于包装页面内容，确保：
 * 1. 内容区域至少占满可视高度
 * 2. 空状态显示在页面底部居中
 * 3. 统一的间距和布局
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <YourPageContent />
 * </PageContainer>
 * ```
 *
 * @example 空状态页面
 * ```tsx
 * <PageContainer>
 *   <EmptyState
 *     title="暂无数据"
 *     description="还没有任何内容"
 *     icon={Database}
 *   />
 * </PageContainer>
 * ```
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`page-container ${className}`}
      style={{
        minHeight: 'calc(100vh - var(--header-height) - var(--tabbar-height, 0px))',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      {children}
    </div>
  );
};

/**
 * 页面内容区域组件
 *
 * 用于包装实际的页面内容（非空状态）
 */
export const PageContent: React.FC<PageContainerProps> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`page-content ${className}`}
      style={{
        flex: 1,
        padding: '20px',
        ...style
      }}
    >
      {children}
    </div>
  );
};

/**
 * 空状态容器组件
 *
 * 用于包装空状态内容，确保显示在页面底部居中
 */
export const EmptyContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`empty-container ${className}`}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        ...style
      }}
    >
      {children}
    </div>
  );
};
