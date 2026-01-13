import { Drawer as AntDrawer, Button } from 'antd';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number | string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  maskClosable?: boolean;
  closable?: boolean;
  destroyOnClose?: boolean;
  footer?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Drawer({
  open,
  onClose,
  title,
  width = 520,
  placement = 'right',
  maskClosable = true,
  closable = true,
  destroyOnClose = false,
  footer,
  extra,
  children,
  className,
  style,
}: DrawerProps) {
  return (
    <AntDrawer
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">{title}</span>
          {extra}
        </div>
      }
      placement={placement}
      width={width}
      open={open}
      onClose={onClose}
      maskClosable={maskClosable}
      closable={closable}
      destroyOnClose={destroyOnClose}
      footer={
        footer ? (
          <div className="flex justify-end gap-3 pt-4 border-t">
            {footer}
          </div>
        ) : (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                onClose();
              }}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                border: 'none',
              }}
            >
              确定
            </Button>
          </div>
        )
      }
      className={className}
      style={style}
      closeIcon={<X size={20} />}
    >
      {children}
    </AntDrawer>
  );
}

interface DrawerConfirmProps extends DrawerProps {
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  danger?: boolean;
}

export function DrawerConfirm({
  onConfirm,
  confirmText = '确定',
  cancelText = '取消',
  confirmLoading = false,
  danger = false,
  ...props
}: DrawerConfirmProps) {
  return (
    <Drawer
      {...props}
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={props.onClose}>{cancelText}</Button>
          <Button
            type={danger ? 'primary' : 'default'}
            danger={danger}
            onClick={onConfirm}
            loading={confirmLoading}
            style={
              !danger
                ? {
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                    border: 'none',
                  }
                : undefined
            }
          >
            {confirmText}
          </Button>
        </div>
      }
    />
  );
}
