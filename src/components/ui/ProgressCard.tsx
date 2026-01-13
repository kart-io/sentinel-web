import { Card, Progress } from 'antd';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * ProgressCard Props 接口
 */
export interface ProgressCardProps {
  /**
   * 标题
   */
  title: string;

  /**
   * 进度百分比 (0-100)
   */
  percent: number;

  /**
   * 描述文本
   */
  description?: string;

  /**
   * 图标组件
   */
  icon?: LucideIcon;

  /**
   * 进度条颜色
   */
  strokeColor?: string | string[];

  /**
   * 进度条类型
   * @default 'line'
   */
  type?: 'line' | 'circle' | 'dashboard';

  /**
   * 显示状态文本
   * @default true
   */
  showInfo?: boolean;

  /**
   * 图标背景颜色
   * @default 'bg-blue-100'
   */
  iconBgColor?: string;

  /**
   * 图标颜色
   * @default 'text-blue-600'
   */
  iconColor?: string;

  /**
   * 状态
   */
  status?: 'normal' | 'exception' | 'success' | 'active';

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
 * ProgressCard 组件
 *
 * @description 进度卡片组件，用于展示任务进度和百分比
 *
 * @example
 * ```tsx
 * <ProgressCard
 *   title="数据同步"
 *   percent={75}
 *   description="正在同步数据到远程服务器"
 *   icon={Database}
 *   strokeColor="#8b5cf6"
 * />
 * ```
 */
export function ProgressCard({
  title,
  percent,
  description,
  icon: Icon,
  strokeColor = '#8b5cf6',
  type = 'line',
  showInfo = true,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  status = 'normal',
  className,
  style,
  extra,
}: ProgressCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className || ''}`} style={style}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {Icon && (
              <div className={`${iconBgColor} p-2 rounded-lg ${iconColor}`}>
                <Icon size={20} />
              </div>
            )}
          </div>

          <Progress
            percent={percent}
            strokeColor={strokeColor}
            type={type}
            showInfo={showInfo}
            status={status}
          />

          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
      </div>

      {extra && <div className="mt-4">{extra}</div>}
    </Card>
  );
}
