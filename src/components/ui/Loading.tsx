import { Spin } from 'antd';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Props 接口
 */
export interface LoadingProps {
  /**
   * 加载提示文本
   */
  tip?: string;

  /**
   * 加载类型
   * @default 'spinner'
   */
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton';

  /**
   * 骨架屏配置（仅当 type='skeleton' 时有效）
   */
  skeleton?: {
    /**
     * 骨架屏行数
     */
    lines?: number;
    /**
     * 是否显示头像骨架
     */
    avatar?: boolean;
    /**
     * 是否显示标题骨架
     */
    title?: boolean;
    /**
     * 是否显示段落骨架
     */
    paragraph?: boolean;
  };

  /**
   * 加载状态
   * @default true
   */
  loading?: boolean;

  /**
   * 覆盖整个容器
   * @default false
   */
  fullscreen?: boolean;

  /**
   * 图标组件（仅当 type='spinner' 时有效）
   */
  icon?: LucideIcon;

  /**
   * 图标大小
   * @default 40
   */
  size?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 加载时显示的内容（反遮罩）
   */
  children?: ReactNode;
}

/**
 * Loading 组件
 *
 * @description 加载状态组件，支持多种加载样式和骨架屏
 *
 * @example
 * ```tsx
 * // 旋转图标加载
 * <Loading tip="加载中..." type="spinner" />
 *
 * // 骨架屏
 * <Loading
 *   type="skeleton"
 *   skeleton={{ title: true, paragraph: { rows: 4 } }}
 * />
 * ```
 */
export function Loading({
  tip,
  type = 'spinner',
  skeleton,
  loading = true,
  fullscreen = false,
  icon: Icon = Loader2,
  size = 40,
  className,
  style,
  children,
}: LoadingProps) {
  if (!loading && children) {
    return <>{children}</>;
  }

  const renderSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      <Icon size={size} className="animate-spin text-violet-500" />
      {tip && <span className="text-gray-500 text-sm">{tip}</span>}
    </div>
  );

  const renderDots = () => (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      {tip && <span className="text-gray-500 text-sm ml-2">{tip}</span>}
    </div>
  );

  const renderPulse = () => (
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16 bg-violet-200 rounded-full animate-pulse" />
      {tip && <span className="text-gray-500 text-sm">{tip}</span>}
    </div>
  );

  const renderSkeleton = () => {
    const skConfig = skeleton || {};
    const { avatar = false, title = true, paragraph = true, lines = 3 } = skConfig;

    return (
      <div className="space-y-4">
        {avatar && <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />}
        {title && <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />}
        {paragraph && (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={`h-4 bg-gray-200 rounded animate-pulse ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const content = (() => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'spinner':
      default:
        return renderSpinner();
    }
  })();

  if (fullscreen) {
    return (
      <Spin
        tip={tip}
        spinning={loading}
        fullscreen
        className={className}
        style={style}
      >
        {children}
      </Spin>
    );
  }

  if (children) {
    return (
      <Spin
        tip={tip}
        spinning={loading}
        className={className}
        style={style}
      >
        {children}
      </Spin>
    );
  }

  return (
    <div
      className={`flex items-center justify-center p-8 ${className || ''}`}
      style={style}
    >
      {content}
    </div>
  );
}
