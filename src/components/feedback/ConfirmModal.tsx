import { Modal as AntModal, Button, Space } from 'antd';
import { AlertTriangle, Info, AlertOctagon, CheckCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface ConfirmModalProps {
  open: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  title?: string;
  content: string;
  okText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  okLoading?: boolean;
  showCancel?: boolean;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const icons = {
  warning: <AlertTriangle size={24} className="text-yellow-500" />,
  danger: <AlertOctagon size={24} className="text-red-500" />,
  info: <Info size={24} className="text-blue-500" />,
};

const colors = {
  warning: 'border-yellow-500',
  danger: 'border-red-500',
  info: 'border-blue-500',
};

export function ConfirmModal({
  open,
  onOk,
  onCancel,
  title,
  content,
  okText = '确定',
  cancelText = '取消',
  type = 'warning',
  okLoading = false,
  showCancel = true,
  icon,
  className,
  style,
}: ConfirmModalProps) {
  return (
    <AntModal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      title={
        <div className="flex items-center gap-2">
          {icon || icons[type]}
          <span>{title || '确认'}</span>
        </div>
      }
      okText={okText}
      cancelText={showCancel ? cancelText : undefined}
      okButtonProps={{
        loading: okLoading,
        danger: type === 'danger',
        style:
          type !== 'danger'
            ? {
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                border: 'none',
              }
            : undefined,
      }}
      cancelButtonProps={{
        hidden: !showCancel,
      }}
      className={className}
      style={style}
    >
      <div
        className={`text-base text-gray-700 leading-relaxed ${colors[type]} border-l-4 pl-4`}
      >
        {content}
      </div>
    </AntModal>
  );
}

interface AlertDialogProps {
  open: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  title?: string;
  content: string;
  type?: 'warning' | 'danger' | 'success' | 'info';
  okText?: string;
  showCancel?: boolean;
}

export function AlertDialog({
  open,
  onOk,
  onCancel,
  title,
  content,
  type = 'warning',
  okText = '确定',
  showCancel = true,
}: AlertDialogProps) {
  const typeIcons = {
    warning: <AlertTriangle size={48} className="text-yellow-500" />,
    danger: <AlertOctagon size={48} className="text-red-500" />,
    success: <CheckCircle size={48} className="text-green-500" />,
    info: <Info size={48} className="text-blue-500" />,
  };

  const typeColors = {
    warning: 'bg-yellow-50 border-yellow-500',
    danger: 'bg-red-50 border-red-500',
    success: 'bg-green-50 border-green-500',
    info: 'bg-blue-50 border-blue-500',
  };

  const typeTexts = {
    warning: '警告',
    danger: '错误',
    success: '成功',
    info: '信息',
  };

  return (
    <AntModal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      title={title || typeTexts[type]}
      okText={okText}
      cancelText={showCancel ? '取消' : undefined}
      cancelButtonProps={{
        hidden: !showCancel,
      }}
      footer={
        <Space>
          {showCancel && (
            <Button onClick={onCancel}>取消</Button>
          )}
          <Button
            type="primary"
            onClick={onOk}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              border: 'none',
            }}
          >
            {okText}
          </Button>
        </Space>
      }
      centered
      width={480}
    >
      <div
        className={`flex flex-col items-center justify-center py-8 ${typeColors[type]} border-4 rounded-lg`}
      >
        {typeIcons[type]}
        <p className="text-lg text-gray-700 mt-4 text-center">{content}</p>
      </div>
    </AntModal>
  );
}
