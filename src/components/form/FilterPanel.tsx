import { Card, Button } from 'antd';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * FilterPanel Props 接口
 */
export interface FilterPanelProps {
  /**
   * 过滤器内容
   */
  children: ReactNode;

  /**
   * 是否显示过滤器面板
   */
  visible?: boolean;

  /**
   * 重置回调
   */
  onReset?: () => void;

  /**
   * 应用回调
   */
  onApply?: () => void;

  /**
   * 关闭回调
   */
  onClose?: () => void;

  /**
   * 应用按钮文本
   * @default '应用'
   */
  applyText?: string;

  /**
   * 重置按钮文本
   * @default '重置'
   */
  resetText?: string;

  /**
   * 是否显示关闭按钮
   * @default false
   */
  closable?: boolean;

  /**
   * 标题
   */
  title?: string;

  /**
   * 是否显示底部操作按钮
   * @default true
   */
  showActions?: boolean;

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
 * FilterPanel 组件
 *
 * @description 过滤面板组件，用于多条件组合过滤
 *
 * @example
 * ```tsx
 * <FilterPanel
 *   visible={showFilters}
 *   onReset={handleReset}
 *   onApply={handleApply}
 *   onClose={() => setShowFilters(false)}
 * >
 *   <Form.Item label="状态">
 *     <Select>
 *       <Select.Option value="active">活跃</Select.Option>
 *       <Select.Option value="inactive">非活跃</Select.Option>
 *     </Select>
 *   </Form.Item>
 * </FilterPanel>
 * ```
 */
export function FilterPanel({
  children,
  visible = true,
  onReset,
  onApply,
  onClose,
  applyText = '应用',
  resetText = '重置',
  closable = false,
  title = '过滤器',
  showActions = true,
  className,
  style,
}: FilterPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="font-semibold">{title}</span>
          {closable && (
            <Button
              type="text"
              icon={<X size={16} />}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            />
          )}
        </div>
      }
      className={`bg-gray-50 ${className || ''}`}
      style={style}
    >
      {children}

      {showActions && (
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onReset}>{resetText}</Button>
          <Button
            type="primary"
            onClick={onApply}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              border: 'none',
            }}
          >
            {applyText}
          </Button>
        </div>
      )}
    </Card>
  );
}
