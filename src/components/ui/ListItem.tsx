import { Avatar, Space, Checkbox } from 'antd';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ListItemProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  avatar?: string;
  avatarShape?: 'circle' | 'square';
  actions?: ReactNode[];
  selected?: boolean;
  selectable?: boolean;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  onClick?: () => void;
  extra?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ListItem({
  title,
  description,
  icon: Icon,
  avatar,
  avatarShape = 'circle',
  actions,
  selected = false,
  selectable = false,
  checked = false,
  onCheck,
  onClick,
  extra,
  className,
  style,
}: ListItemProps) {
  return (
    <div
      className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg transition-all ${
        selected
          ? 'border-violet-500 bg-violet-50'
          : 'bg-white hover:shadow-md hover:border-gray-300'
      } ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      style={style}
      onClick={onClick}
    >
      {selectable && (
        <Checkbox
          checked={checked}
          onChange={(e) => onCheck?.(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {avatar && (
        <Avatar
          src={avatar}
          shape={avatarShape}
          size={48}
          className="flex-shrink-0"
        />
      )}

      {Icon && !avatar && (
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100 text-violet-600 flex-shrink-0"
        >
          <Icon size={24} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 mb-1 truncate">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-gray-500 truncate">{description}</p>
        )}
      </div>

      {actions && (
        <Space className="flex-shrink-0">
          {actions.map((action, index) => (
            <div key={index} onClick={(e) => e.stopPropagation()}>
              {action}
            </div>
          ))}
        </Space>
      )}

      {extra && !actions && (
        <div className="flex-shrink-0 ml-auto" onClick={(e) => e.stopPropagation()}>
          {extra}
        </div>
      )}
    </div>
  );
}

interface ListItemGroupProps {
  title?: string;
  items: ListItemProps[];
  selectable?: boolean;
  checkedAll?: boolean;
  onCheckAll?: (checked: boolean) => void;
  onCheckItem?: (index: number, checked: boolean) => void;
  onItemClick?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ListItemGroup({
  title,
  items,
  selectable = false,
  checkedAll = false,
  onCheckAll,
  onCheckItem,
  onItemClick,
  className,
  style,
}: ListItemGroupProps) {
  return (
    <div className={className} style={style}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {selectable && (
            <Checkbox
              checked={checkedAll}
              onChange={(e) => onCheckAll?.(e.target.checked)}
            >
              全选
            </Checkbox>
          )}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <ListItem
            key={index}
            {...item}
            selectable={selectable || item.selectable}
            onCheck={(checked) => onCheckItem?.(index, checked)}
            onClick={() => onItemClick?.(index)}
          />
        ))}
      </div>
    </div>
  );
}
