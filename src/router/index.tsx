import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../features/auth/Login';
import Dashboard from '../features/dashboard/Dashboard';
import MUIComponents from '../features/mui-demo/MUIComponents';
import EnvDemo from '../features/env-demo/EnvDemo';
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
        path: 'mui-demo',
        element: <MUIComponents />,
      },
      {
        path: 'env-demo',
        element: <EnvDemo />,
      },
      {
        path: 'rag',
        element: (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">RAG 知识库</h2>
            <p className="text-gray-500 mt-2">功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'user-center',
        element: (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">用户中心</h2>
            <p className="text-gray-500 mt-2">功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'scheduler',
        element: (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">任务调度</h2>
            <p className="text-gray-500 mt-2">功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'settings',
        element: (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">系统设置</h2>
            <p className="text-gray-500 mt-2">功能开发中...</p>
          </div>
        ),
      },
    ],
  },
]);
