import React from 'react';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Database,
  Users,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Workflow,
  Shield,
  Bell,
  Mail,
  HardDrive,
  Activity,
} from 'lucide-react';

/**
 * 菜单项接口
 */
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  badge?: number | string;
}

/**
 * 完整的菜单配置 - 支持多级菜单
 */
export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表板',
    icon: <LayoutDashboard size={18} />,
    path: '/dashboard',
    children: [
      {
        key: '/dashboard',
        label: '工作台',
        icon: <Activity size={16} />,
        path: '/dashboard',
      },
      {
        key: '/dashboard/analytics',
        label: '数据分析',
        icon: <BarChart3 size={16} />,
        path: '/dashboard/analytics',
      },
    ],
  },
  {
    key: 'rag',
    label: 'RAG 知识库',
    icon: <Database size={18} />,
    path: '/rag',
    children: [
      {
        key: '/rag',
        label: '知识库管理',
        path: '/rag',
      },
      {
        key: '/rag/documents',
        label: '文档管理',
        path: '/rag/documents',
      },
      {
        key: '/rag/query',
        label: '智能问答',
        path: '/rag/query',
      },
    ],
  },
  {
    key: 'user',
    label: '用户管理',
    icon: <Users size={18} />,
    children: [
      {
        key: '/user-center',
        label: '用户中心',
        path: '/user-center',
      },
      {
        key: '/user/list',
        label: '用户列表',
        path: '/user/list',
      },
      {
        key: '/user/roles',
        label: '角色权限',
        icon: <Shield size={16} />,
        path: '/user/roles',
      },
    ],
  },
  {
    key: 'scheduler',
    label: '任务调度',
    icon: <Calendar size={18} />,
    path: '/scheduler',
    children: [
      {
        key: '/scheduler',
        label: '任务列表',
        path: '/scheduler',
      },
      {
        key: '/scheduler/workflows',
        label: '工作流',
        icon: <Workflow size={16} />,
        path: '/scheduler/workflows',
      },
    ],
  },
  {
    key: 'system',
    label: '系统管理',
    icon: <Settings size={18} />,
    children: [
      {
        key: '/settings',
        label: '系统设置',
        path: '/settings',
      },
      {
        key: '/layout-test',
        label: '布局测试',
        icon: <LayoutDashboard size={16} />,
        path: '/layout-test',
      },
      {
        key: '/system/logs',
        label: '系统日志',
        icon: <FileText size={16} />,
        path: '/system/logs',
      },
      {
        key: '/system/monitor',
        label: '系统监控',
        icon: <Activity size={16} />,
        path: '/system/monitor',
      },
      {
        key: '/system/storage',
        label: '存储管理',
        icon: <HardDrive size={16} />,
        path: '/system/storage',
      },
    ],
  },
  {
    key: 'notification',
    label: '通知中心',
    icon: <Bell size={18} />,
    path: '/notifications',
    badge: 5,
  },
  {
    key: 'mui-demo',
    label: '组件演示',
    icon: <Database size={18} />,
    path: '/mui-demo',
  },
];

/**
 * 转换为 Ant Design Menu 格式 (一级菜单)
 */
export function convertToAntdMenu(items: MenuItem[]): MenuProps['items'] {
  return items.map((item) => ({
    key: item.path || item.key,
    icon: item.icon,
    label: item.label,
    children: item.children
      ? item.children.map((child) => ({
          key: child.path || child.key,
          icon: child.icon,
          label: child.label,
        }))
      : undefined,
  }));
}

/**
 * 转换为一级菜单 (用于 mixed-nav 顶部)
 */
export function getTopLevelMenu(items: MenuItem[]): MenuProps['items'] {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <span className="flex items-center gap-2">
        {item.label}
        {item.badge && (
          <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </span>
    ),
  }));
}

/**
 * 根据一级菜单 key 获取二级菜单
 */
export function getSubMenu(parentKey: string, items: MenuItem[]): MenuProps['items'] {
  const parent = items.find((item) => item.key === parentKey);
  if (!parent || !parent.children) return [];

  return parent.children.map((child) => ({
    key: child.path || child.key,
    icon: child.icon,
    label: child.label,
  }));
}

/**
 * 获取所有路径映射 (用于面包屑和标签页)
 */
export function getAllPathsMap(items: MenuItem[]): Map<string, MenuItem> {
  const map = new Map<string, MenuItem>();

  function traverse(items: MenuItem[]) {
    items.forEach((item) => {
      if (item.path) {
        map.set(item.path, item);
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  }

  traverse(items);
  return map;
}

/**
 * 根据路径获取父级菜单
 */
export function getParentKey(path: string, items: MenuItem[]): string | null {
  for (const item of items) {
    if (item.children) {
      const found = item.children.find((child) => child.path === path);
      if (found) {
        return item.key;
      }
    }
  }
  return null;
}

/**
 * 获取扁平化的所有菜单项
 */
export function getFlatMenuItems(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];

  function traverse(items: MenuItem[]) {
    items.forEach((item) => {
      result.push(item);
      if (item.children) {
        traverse(item.children);
      }
    });
  }

  traverse(items);
  return result;
}
