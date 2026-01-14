import { globalMessage } from '@/utils/messageHolder';
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
    globalMessage.success(content, duration);
  },

  error(content: string, duration = 4) {
    globalMessage.error(content, duration);
  },

  warning(content: string, duration = 3) {
    globalMessage.warning(content, duration);
  },

  info(content: string, duration = 3) {
    globalMessage.info(content, duration);
  },

  loading(content: string) {
    globalMessage.loading(content, 0);
  },

  destroy(key?: string) {
    globalMessage.destroy(key);
  },

  config(_options: { duration?: number; maxCount?: number; top?: number }) {
    // Configuration is handled by Ant Design App component
    console.warn('[Toast] config() is deprecated. Use Ant Design App component configuration instead.');
  },
};

Toast.destroy = (key?: string) => globalMessage.destroy(key);

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
