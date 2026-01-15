import { Button } from 'antd';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * EmptyState Props 接口
 */
export interface EmptyStateProps {
  /**
   * 标题
   */
  title: string;

  /**
   * 描述文本
   */
  description?: string;

  /**
   * 图标组件
   */
  icon?: LucideIcon;

  /**
   * 图标颜色
   * @default 'text-gray-400'
   */
  iconColor?: string;

  /**
   * 操作按钮文本
   */
  actionText?: string;

  /**
   * 操作按钮回调
   */
  onAction?: () => void;

  /**
   * 自定义操作按钮
   */
  action?: ReactNode;

  /**
   * 空状态图片
   */
  image?: string;

  /**
   * 是否居中显示
   * @default true
   */
  centered?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 额外内容
   */
  extra?: ReactNode;
}

/**
 * EmptyState 组件
 *
 * @description 空状态组件，用于无数据时的友好提示
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="暂无数据"
 *   description="点击下方按钮创建第一条数据"
 *   icon={Database}
 *   actionText="创建"
 *   onAction={handleCreate}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  iconColor = 'text-muted-foreground',
  actionText,
  onAction,
  action,
  image,
  centered = true,
  className,
  style,
  extra,
}: EmptyStateProps) {
  const containerClass = centered ? 'text-center' : '';

  return (
    <div
      className={`${containerClass} py-16 px-4 ${className || ''}`}
      style={{
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {image ? (
        <div className="mb-6">
          <img src={image} alt={title} className="w-48 h-48 mx-auto object-contain opacity-50" />
        </div>
      ) : Icon ? (
        <div className={`mb-6 flex ${centered ? 'justify-center' : ''}`}>
          <div
            className={`p-4 rounded-full ${iconColor}`}
            style={{
              backgroundColor: 'var(--color-border-secondary)',
              opacity: 0.6
            }}
          >
            <Icon size={64} />
          </div>
        </div>
      ) : null}

      <h3
        className="text-xl font-semibold mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="mb-6 max-w-md"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {description}
        </p>
      )}

      {(action || (actionText && onAction)) && (
        <div className={`flex gap-3 ${centered ? 'justify-center' : ''} mb-4`}>
          {action || (
            <Button
              type="primary"
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
        </div>
      )}

      {extra && <div className={`mt-6 ${centered ? 'text-center' : ''}`}>{extra}</div>}
    </div>
  );
}
