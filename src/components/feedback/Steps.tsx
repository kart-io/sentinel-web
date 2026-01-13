import { Steps as AntSteps } from 'antd';
import { Check, Circle, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface StepItem {
  title: string;
  description?: string;
  status?: 'wait' | 'process' | 'finish' | 'error';
  icon?: any;
  subTitle?: string;
}

interface StepsProps {
  current: number;
  items: StepItem[];
  direction?: 'horizontal' | 'vertical';
  size?: 'default' | 'small';
  status?: 'error' | 'process' | 'finish' | 'wait';
  onClick?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Steps({
  current,
  items,
  direction = 'horizontal',
  size = 'default',
  status,
  onClick,
  className,
  style,
}: StepsProps) {
  return (
    <div className={className} style={style}>
      <AntSteps
        current={current}
        onChange={onClick}
        direction={direction}
        size={size}
        status={status}
        items={items.map((item, index) => {
          void index;
          const itemStatus = item.status || getStatus(items.indexOf(item), current, status) as any;

          return {
            title: item.title,
            description: item.description,
            subTitle: item.subTitle,
            status: itemStatus,
            icon: item.icon || getStatusIcon(itemStatus),
          };
        })}
      />
    </div>
  );
}

function getStatus(index: number, current: number, globalStatus?: string): string {
  if (globalStatus) {
    return globalStatus;
  }

  if (index < current) {
    return 'finish';
  }
  if (index === current) {
    return 'process';
  }
  return 'wait';
}

function getStatusIcon(stepStatus: string): ReactNode {
  switch (stepStatus) {
    case 'finish':
      return <Check size={18} className="text-green-500" />;
    case 'process':
      return <Loader2 size={18} className="animate-spin text-blue-500" />;
    case 'error':
      return <Circle size={18} className="text-red-500" fill="none" />;
    default:
      return <Circle size={18} className="text-gray-400" />;
  }
}

interface VerticalStepsProps {
  current: number;
  items: StepItem[];
  size?: 'default' | 'small';
  status?: 'error' | 'process' | 'finish' | 'wait';
  onClickStep?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function VerticalSteps({
  current,
  items,
  size = 'default',
  status,
  onClickStep,
  className,
  style,
}: VerticalStepsProps) {
  return (
    <div className={className} style={style}>
      <AntSteps
        current={current}
        onChange={onClickStep}
        direction="vertical"
        size={size}
        status={status}
        items={items.map((item) => {
          const itemStatus = item.status || getStatus(items.indexOf(item), current, status) as any;

          return {
            title: item.title,
            description: item.description,
            subTitle: item.subTitle,
            status: itemStatus,
            icon: item.icon || getStatusIcon(itemStatus),
          };
        })}
      />
    </div>
  );
}

interface StepProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function StepProgress({ current, total, className }: StepProgressProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={`mb-4 ${className || ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          进度: {current + 1} / {total}
        </span>
        <span className="text-sm font-medium text-violet-600">
          {progress.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
