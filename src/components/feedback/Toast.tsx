import { message } from 'antd';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';

interface ToastInstance {
  success(content: string, duration?: number): void;
  error(content: string, duration?: number): void;
  warning(content: string, duration?: number): void;
  info(content: string, duration?: number): void;
  loading(content: string): void;
  destroy(key?: string): void;
  config(options: { duration?: number; maxCount?: number; top?: number }): void;
}

const Toast: ToastInstance = {
  success(content: string, duration = 3) {
    message.success({
      content,
      duration,
      icon: <CheckCircle size={20} className="text-green-500" />,
    });
  },

  error(content: string, duration = 4) {
    message.error({
      content,
      duration,
      icon: <XCircle size={20} className="text-red-500" />,
    });
  },

  warning(content: string, duration = 3) {
    message.warning({
      content,
      duration,
      icon: <AlertCircle size={20} className="text-yellow-500" />,
    });
  },

  info(content: string, duration = 3) {
    message.info({
      content,
      duration,
      icon: <Info size={20} className="text-blue-500" />,
    });
  },

  loading(content: string) {
    message.loading({
      content,
      icon: <Loader2 size={20} className="animate-spin text-blue-500" />,
      duration: 0,
    });
  },

  destroy(key?: string) {
    if (key) {
      message.destroy(key);
    } else {
      message.destroy();
    }
  },

  config(options: { duration?: number; maxCount?: number; top?: number }) {
    message.config(options);
  },
};

Toast.destroy = () => message.destroy();

export default Toast;

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  content: string;
  duration?: number;
  onClose?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function ToastMessage({
  type,
  content,
  duration,
  onClose,
  icon,
  className,
}: ToastProps) {
  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    warning: <AlertCircle size={20} className="text-yellow-500" />,
    info: <Info size={20} className="text-blue-500" />,
    loading: <Loader2 size={20} className="animate-spin text-blue-500" />,
  };

  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration || 3000);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    visible && (
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg mb-2 min-w-[300px] ${className || ''}`}
        style={{
          backgroundColor:
            type === 'error'
              ? '#fef2f2'
              : type === 'warning'
                ? '#fffbeb'
                : type === 'success'
                  ? '#f0fdf4'
                  : '#eff6ff',
          borderLeftWidth: '4px',
          borderLeftColor:
            type === 'error'
              ? '#ef4444'
              : type === 'warning'
                ? '#f59e0b'
                : type === 'success'
                  ? '#22c55e'
                  : '#3b82f6',
        }}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon || icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">{content}</div>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    )
  );
}
