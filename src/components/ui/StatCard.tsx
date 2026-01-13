import { Card } from 'antd';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * StatCard Props 接口
 */
export interface StatCardProps {
  /**
   * 卡片标题
   */
  title: string;

  /**
   * 统计数值
   */
  value: number | string;

  /**
   * 数值后缀
   */
  suffix?: string;

  /**
   * 趋势变化（百分比）
   */
  trend?: {
    value: number;
    text?: string;
  };

  /**
   * 图标组件
   */
  icon?: LucideIcon;

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
   * 加载状态
   */
  loading?: boolean;

  /**
   * 点击回调
   */
  onClick?: () => void;

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
 * StatCard 组件
 *
 * @description 统计卡片组件，支持数值展示、趋势指示和图标
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="总用户数"
 *   value={1243}
 *   trend={{ value: 12, text: "本月" }}
 *   icon={Users}
 *   iconBgColor="bg-blue-100"
 *   iconColor="text-blue-600"
 * />
 * ```
 */
export function StatCard({
  title,
  value,
  suffix = '',
  trend,
  icon: Icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  loading = false,
  onClick,
  className,
  style,
  extra,
}: StatCardProps) {
  const trendValue = trend?.value ?? 0;
  const isPositive = trendValue >= 0;

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      style={style}
      onClick={onClick}
      loading={loading}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
          </div>
          {trend && (
            <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'}
              <span className="ml-1">
                {Math.abs(trendValue)}% {trend.text}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${iconBgColor} p-3 rounded-full flex-shrink-0 ml-4`}>
            <Icon size={24} className={iconColor} />
          </div>
        )}
      </div>
      {extra && <div className="mt-4">{extra}</div>}
    </Card>
  );
}
