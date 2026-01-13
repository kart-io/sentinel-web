import { Timeline as AntTimeline, Card } from 'antd';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string | Date;
  icon?: LucideIcon;
  color?: string;
  extra?: ReactNode;
  details?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  mode?: 'left' | 'right' | 'alternate';
  showExtra?: boolean;
  collapsible?: boolean;
  onClick?: (item: TimelineItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Timeline({
  items,
  mode = 'left',
  showExtra = true,
  collapsible = false,
  onClick,
  className,
  style,
}: TimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatTimestamp = (timestamp: string | Date): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timelineItems = items.map((item) => {
    const hasDetails = item.details && collapsible;
    const isExpanded = expandedItems.has(item.id);
    const isClickable = onClick || hasDetails;

    return {
      color: item.color,
      dot: item.icon ? (
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            item.color
              ? 'text-white'
              : 'bg-violet-500 text-white'
          }`}
          style={
            item.color
              ? { backgroundColor: item.color }
              : { backgroundColor: '#8b5cf6' }
          }
        >
          <item.icon size={16} />
        </div>
      ) : undefined,
      children: (
        <Card
          className={`shadow-sm ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          style={{ marginBottom: 16 }}
          onClick={() => {
            if (isClickable && !collapsible) {
              onClick?.(item);
            }
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
              )}
              <p className="text-xs text-gray-400">
                {formatTimestamp(item.timestamp)}
              </p>
            </div>
            {showExtra && item.extra && (
              <div className="ml-4">{item.extra}</div>
            )}
          </div>

          {hasDetails && (
            <div
              className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center text-violet-500 hover:text-violet-600 cursor-pointer text-sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
            >
              {isExpanded ? (
                <>
                  <span>收起详情</span>
                  <ChevronUp size={16} className="ml-1" />
                </>
              ) : (
                <>
                  <span>查看详情</span>
                  <ChevronDown size={16} className="ml-1" />
                </>
              )}
            </div>
          )}

          {hasDetails && isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {item.details}
            </div>
          )}
        </Card>
      ),
    };
  });

  return (
    <div className={className} style={style}>
      <AntTimeline mode={mode} items={timelineItems} />
    </div>
  );
}

interface CompactTimelineProps {
  items: TimelineItem[];
  onClick?: (item: TimelineItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function CompactTimeline({
  items,
  onClick,
  className,
  style,
}: CompactTimelineProps) {
  const timelineItems = items.map((item) => ({
    color: item.color,
    dot: item.icon ? (
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500 text-white"
      >
        <item.icon size={12} />
      </div>
    ) : undefined,
    children: (
      <div
        className={`flex justify-between items-center py-1 ${onClick ? 'cursor-pointer hover:bg-gray-50 px-2 rounded' : ''}`}
        onClick={() => onClick?.(item)}
      >
        <div>
          <span className="text-sm font-medium text-gray-900">
            {item.title}
          </span>
          {item.description && (
            <span className="text-xs text-gray-500 ml-2">
              {item.description}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {formatTimestamp(item.timestamp)}
        </span>
      </div>
    ),
  }));

  function formatTimestamp(timestamp: string | Date): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN');
  }

  return (
    <AntTimeline className={className} style={style} items={timelineItems} />
  );
}
