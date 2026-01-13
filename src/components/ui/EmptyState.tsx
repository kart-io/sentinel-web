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
  iconColor = 'text-gray-400',
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
    <div className={`${containerClass} py-12 ${className || ''}`} style={style}>
      {image ? (
        <div className="mb-6">
          <img src={image} alt={title} className="w-48 h-48 mx-auto object-contain opacity-50" />
        </div>
      ) : Icon ? (
        <div className={`mb-6 flex ${centered ? 'justify-center' : ''}`}>
          <div className={`p-4 rounded-full bg-gray-50 ${iconColor}`}>
            <Icon size={64} />
          </div>
        </div>
      ) : null}

      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>

      {description && <p className="text-gray-500 mb-6">{description}</p>}

      {(action || (actionText && onAction)) && (
        <div className={`flex gap-3 ${centered ? 'justify-center' : ''} mb-4`}>
          {action || (
            <Button
              type="primary"
              onClick={onAction}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                border: 'none',
              }}
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
