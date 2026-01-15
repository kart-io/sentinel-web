import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../features/auth/Login';
import Dashboard from '../features/dashboard/Dashboard';
import MUIComponents from '../features/mui-demo/MUIComponents';
import EnvDemo from '../features/env-demo/EnvDemo';
import RAGPage from '../features/rag/RAGPage';
import LayoutTestPage from '../features/layout-demo/LayoutTestPage';
import { UnderConstruction } from '@/components/common/UnderConstruction';
import { ProtectedRoute, PublicRoute } from '@/components/common/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'dashboard/analytics',
        element: <UnderConstruction title="数据分析" description="数据分析功能开发中..." />,
      },
      {
        path: 'rag',
        element: <RAGPage />,
      },
      {
        path: 'rag/documents',
        element: <UnderConstruction title="文档管理" description="文档管理功能开发中..." />,
      },
      {
        path: 'rag/query',
        element: <UnderConstruction title="智能问答" description="智能问答功能开发中..." />,
      },
      {
        path: 'user-center',
        element: <UnderConstruction title="用户中心" description="用户中心功能开发中..." />,
      },
      {
        path: 'user/list',
        element: <UnderConstruction title="用户列表" description="用户列表功能开发中..." />,
      },
      {
        path: 'user/roles',
        element: <UnderConstruction title="角色权限" description="角色权限功能开发中..." />,
      },
      {
        path: 'scheduler',
        element: <UnderConstruction title="任务调度" description="任务调度功能开发中..." />,
      },
      {
        path: 'scheduler/workflows',
        element: <UnderConstruction title="工作流" description="工作流功能开发中..." />,
      },
      {
        path: 'settings',
        element: <UnderConstruction title="系统设置" description="系统设置功能开发中..." />,
      },
      {
        path: 'layout-test',
        element: <LayoutTestPage />,
      },
      {
        path: 'system/logs',
        element: <UnderConstruction title="系统日志" description="系统日志功能开发中..." />,
      },
      {
        path: 'system/monitor',
        element: <UnderConstruction title="系统监控" description="系统监控功能开发中..." />,
      },
      {
        path: 'system/storage',
        element: <UnderConstruction title="存储管理" description="存储管理功能开发中..." />,
      },
      {
        path: 'notifications',
        element: <UnderConstruction title="通知中心" description="通知中心功能开发中..." />,
      },
      {
        path: 'mui-demo',
        element: <MUIComponents />,
      },
      {
        path: 'env-demo',
        element: <EnvDemo />,
      },
    ],
  },
]);
