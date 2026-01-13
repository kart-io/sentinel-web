import { Button } from 'antd';

/**
 * FormActions Props 接口
 */
export interface FormActionsProps {
  /**
   * 取消按钮文本
   * @default '取消'
   */
  cancelText?: string;

  /**
   * 取消按钮回调
   */
  onCancel?: () => void;

  /**
   * 确认按钮文本
   * @default '确定'
   */
  okText?: string;

  /**
   * 确认按钮回调
   */
  onOk?: () => void | Promise<void>;

  /**
   * 加载状态
   */
  loading?: boolean;

  /**
   * 确认按钮类型
   * @default 'primary'
   */
  okButtonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';

  /**
   * 是否显示取消按钮
   * @default true
   */
  showCancel?: boolean;

  /**
   * 对齐方式
   * @default 'right'
   */
  align?: 'left' | 'center' | 'right';

  /**
   * 按钮大小
   * @default 'middle'
   */
  size?: 'large' | 'middle' | 'small';

  /**
   * 禁用状态
   */
  disabled?: boolean;

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
 * FormActions 组件
 *
 * @description 表单操作按钮组，统一表单底部操作样式
 *
 * @example
 * ```tsx
 * <FormActions
 *   okText="提交"
 *   cancelText="取消"
 *   onOk={handleSubmit}
 *   onCancel={handleCancel}
 *   loading={loading}
 * />
 * ```
 */
export function FormActions({
  cancelText = '取消',
  onCancel,
  okText = '确定',
  onOk,
  loading = false,
  okButtonType = 'primary',
  showCancel = true,
  align = 'right',
  size = 'middle',
  disabled = false,
  className,
  style,
}: FormActionsProps) {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  return (
    <div className={`flex ${alignClass} gap-3 ${className || ''}`} style={style}>
      {showCancel && (
        <Button onClick={onCancel} size={size} disabled={disabled}>
          {cancelText}
        </Button>
      )}

      <Button
        type={okButtonType}
        onClick={onOk}
        loading={loading}
        size={size}
        disabled={disabled}
        style={{
          background:
            okButtonType === 'primary'
              ? 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)'
              : undefined,
          border: okButtonType === 'primary' ? 'none' : undefined,
        }}
      >
        {okText}
      </Button>
    </div>
  );
}
