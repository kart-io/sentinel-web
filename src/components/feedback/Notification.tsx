import { notification } from 'antd';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface NotificationConfig {
  message: string;
  description?: string;
  duration?: number;
  key?: string;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  onClose?: () => void;
  icon?: ReactNode;
  btn?: ReactNode;
}

const Notification = {
  success(config: NotificationConfig) {
    notification.success({
      message: config.message,
      description: config.description,
      duration: config.duration,
      key: config.key,
      placement: config.placement,
      onClose: config.onClose,
      icon: config.icon || <CheckCircle size={24} className="text-green-500" />,
      btn: config.btn,
    });
  },

  error(config: NotificationConfig) {
    notification.error({
      message: config.message,
      description: config.description,
      duration: config.duration,
      key: config.key,
      placement: config.placement,
      onClose: config.onClose,
      icon: config.icon || <XCircle size={24} className="text-red-500" />,
      btn: config.btn,
    });
  },

  warning(config: NotificationConfig) {
    notification.warning({
      message: config.message,
      description: config.description,
      duration: config.duration,
      key: config.key,
      placement: config.placement,
      onClose: config.onClose,
      icon: config.icon || <AlertCircle size={24} className="text-yellow-500" />,
      btn: config.btn,
    });
  },

  info(config: NotificationConfig) {
    notification.info({
      message: config.message,
      description: config.description,
      duration: config.duration,
      key: config.key,
      placement: config.placement,
      onClose: config.onClose,
      icon: config.icon || <Info size={24} className="text-blue-500" />,
      btn: config.btn,
    });
  },

  open(config: NotificationConfig) {
    notification.open({
      message: config.message,
      description: config.description,
      duration: config.duration,
      key: config.key,
      placement: config.placement,
      onClose: config.onClose,
      icon: config.icon,
      btn: config.btn,
    });
  },

  destroy(key?: string) {
    if (key) {
      notification.destroy(key);
    } else {
      notification.destroy();
    }
  },
};

export default Notification;

interface NotificationCardProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  onClose?: () => void;
  action?: ReactNode;
}

export function NotificationCard({
  type,
  message,
  description,
  onClose,
  action,
}: NotificationCardProps) {
  const icons = {
    success: <CheckCircle size={24} className="text-green-500" />,
    error: <XCircle size={24} className="text-red-500" />,
    warning: <AlertCircle size={24} className="text-yellow-500" />,
    info: <Info size={24} className="text-blue-500" />,
  };

  const colors = {
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    info: 'border-blue-500 bg-blue-50',
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg border-l-4 mb-2 ${colors[type]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 mb-1">{message}</div>
          {description && (
            <div className="text-sm text-gray-600">{description}</div>
          )}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
