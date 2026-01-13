import { Breadcrumb as AntBreadcrumb } from 'antd';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * 面包屑项接口
 */
export interface BreadcrumbItem {
  /**
   * 标签文本
   */
  label: string;

  /**
   * 路由路径（可选，有值则可点击）
   */
  path?: string;

  /**
   * 图标组件
   */
  icon?: LucideIcon;

  /**
   * 自定义额外内容
   */
  extra?: ReactNode;
}

/**
 * Breadcrumb Props 接口
 */
export interface BreadcrumbProps {
  /**
   * 面包屑项列表
   */
  items: BreadcrumbItem[];

  /**
   * 自定义分隔符
   * @default ChevronRight 图标
   */
  separator?: string | ReactNode;

  /**
   * 是否显示首页图标
   * @default true
   */
  showHome?: boolean;

  /**
   * 点击回调
   */
  onClick?: (item: BreadcrumbItem) => void;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 最大显示项数，超出显示省略
   */
  maxItems?: number;
}

/**
 * Breadcrumb 面包屑导航组件
 *
 * @description 支持路由跳转、自定义分隔符、图标的面包屑导航
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: '首页', path: '/' },
 *     { label: '用户中心', path: '/user-center' },
 *     { label: '用户列表' }
 *   ]}
 * />
 *
 * // 自定义分隔符
 * <Breadcrumb
 *   separator="/"
 *   items={[...]}
 * />
 * ```
 */
export function Breadcrumb({
  items,
  separator,
  showHome = true,
  onClick,
  className,
  style,
  maxItems,
}: BreadcrumbProps) {
  const navigate = useNavigate();

  const handleClick = (item: BreadcrumbItem) => {
    if (item.path) {
      navigate(item.path);
    }
    onClick?.(item);
  };

  let displayItems = [...items];

  if (showHome && (!items.length || items[0]?.label !== '首页')) {
    displayItems = [
      {
        label: '首页',
        path: '/',
        icon: Home,
      },
      ...items,
    ];
  }

  if (maxItems && displayItems.length > maxItems) {
    const homeItem = displayItems[0];
    const lastItem = displayItems[displayItems.length - 1];

    displayItems = [
      homeItem,
      {
        label: '...',
        path: undefined,
      },
      lastItem,
    ];
  }

  // 转换为 Ant Design Breadcrumb 格式
  const breadcrumbItems = displayItems.map((item, index) => {
    const isLast = index === displayItems.length - 1;

    return {
      title: (
        <div className="flex items-center gap-1">
          {item.icon && <item.icon size={14} className="text-gray-400" />}
          <span
            className={
              isLast
                ? 'text-gray-900 font-medium'
                : 'text-gray-600 hover:text-violet-600 transition-colors cursor-pointer'
            }
          >
            {item.label}
          </span>
          {item.extra && <span className="ml-1">{item.extra}</span>}
        </div>
      ),
      onClick: () => {
        if (!isLast && item.path) {
          handleClick(item);
        }
      },
    };
  });

  return (
    <AntBreadcrumb
      separator={separator || <ChevronRight size={14} className="text-gray-400" />}
      className={className}
      style={style}
      items={breadcrumbItems}
    />
  );
}

/**
 * 自动根据当前路由生成面包屑
 */
interface AutoBreadcrumbProps extends Omit<BreadcrumbProps, 'items'> {
  /**
   * 路由映射表
   */
  routeMap: Record<string, string>;

  /**
   * 自定义面包屑项处理器
   */
  customItemProcessor?: (path: string, label: string) => BreadcrumbItem | null;
}

export function AutoBreadcrumb({
  routeMap,
  customItemProcessor,
  ...props
}: AutoBreadcrumbProps) {
  const location = useLocation();

  // 将当前路径拆分为路径段
  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => `/${segment}`);

  // 构建面包屑项
  const breadcrumbItems: BreadcrumbItem[] = pathSegments.map((path, index) => {
    const fullPath = pathSegments.slice(0, index + 1).join('');
    const label = routeMap[fullPath] || routeMap[path] || path.replace('/', '');

    if (customItemProcessor) {
      const customItem = customItemProcessor(fullPath, label);
      if (customItem) return customItem;
    }

    return {
      label,
      path: fullPath,
    };
  });

  return <Breadcrumb {...props} items={breadcrumbItems} />;
}
