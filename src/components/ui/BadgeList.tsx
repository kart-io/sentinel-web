import { Tag, Space, Tooltip } from 'antd';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export type TagColor =
  | 'default'
  | 'magenta'
  | 'red'
  | 'volcano'
  | 'orange'
  | 'gold'
  | 'lime'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'geekblue'
  | 'purple';

/**
 * 标签项接口
 */
export interface BadgeItem {
  /**
   * 标签文本
   */
  text: string;

  /**
   * 标签值
   */
  value: string | number;

  /**
   * 标签颜色
   * @default 'default'
   */
  color?: TagColor;

  /**
   * 是否可删除
   * @default false
   */
  closable?: boolean;

  /**
   * 标签图标
   */
  icon?: ReactNode;
}

/**
 * BadgeList Props 接口
 */
export interface BadgeListProps {
  /**
   * 标签列表
   */
  items: BadgeItem[];

  /**
   * 删除回调
   */
  onDelete?: (value: string | number) => void;

  /**
   * 点击回调
   */
  onClick?: (value: string | number) => void;

  /**
   * 最大显示数量，超出显示 +N
   */
  maxCount?: number;

  /**
   * 是否水平排列
   * @default true
   */
  horizontal?: boolean;

  /**
   * 是否紧凑模式
   * @default false
   */
  compact?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

/**
 * BadgeList 组件
 *
 * @description 标签列表组件，支持颜色、删除和点击
 *
 * @example
 * ```tsx
 * <BadgeList
 *   items={[
 *     { text: '活跃', value: 'active', color: 'green' },
 *     { text: '管理员', value: 'admin', color: 'blue', closable: true }
 *   ]}
 *   onDelete={handleDelete}
 *   onClick={handleClick}
 * />
 * ```
 */
export function BadgeList({
  items,
  onDelete,
  onClick,
  maxCount,
  horizontal = true,
  compact = false,
  className,
  style,
}: BadgeListProps) {
  const displayItems = maxCount ? items.slice(0, maxCount) : items;
  const hiddenCount = maxCount ? items.length - maxCount : 0;

  const spaceProps = horizontal
    ? { size: [0, 8] as [number, number], wrap: true }
    : { direction: 'vertical' as const, size: 8 };

  const tagStyle = compact ? { margin: 0 } : undefined;

  return (
    <div className={className} style={style}>
      <Space {...spaceProps}>
        {displayItems.map((item) => (
          <Tooltip key={item.value} title={item.text}>
            <Tag
              color={item.color}
              closable={item.closable}
              onClose={(e) => {
                e.stopPropagation();
                onDelete?.(item.value);
              }}
              onClick={() => onClick?.(item.value)}
              style={{
                cursor: onClick ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                ...tagStyle,
              }}
              icon={item.icon}
            >
              {item.text}
              {item.closable && <X size={12} />}
            </Tag>
          </Tooltip>
        ))}

        {hiddenCount > 0 && (
          <Tag>+{hiddenCount}</Tag>
        )}
      </Space>
    </div>
  );
}
