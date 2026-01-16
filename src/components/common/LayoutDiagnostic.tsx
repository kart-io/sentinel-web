import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Descriptions } from 'antd';
import { useLayoutStore, useLayoutComputed } from '@/store/layoutStore';

/**
 * 布局诊断工具
 * 用于诊断和修复布局显示问题
 */
const LayoutDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const sidebar = useLayoutStore((state) => state.sidebar);
  const updateSidebar = useLayoutStore((state) => state.updateSidebar);
  const computed = useLayoutComputed();

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = () => {
    const layoutPrefs = localStorage.getItem('layout-preferences');
    let storedConfig = null;

    if (layoutPrefs) {
      try {
        storedConfig = JSON.parse(layoutPrefs);
      } catch (e) {
        console.error('解析 localStorage 失败:', e);
      }
    }

    const issues: string[] = [];

    // 检查 sidebar.hidden
    if (sidebar.hidden) {
      issues.push('sidebar.hidden 被设置为 true');
    }

    // 检查 showSidebar 计算结果
    if (!computed.showSidebar) {
      issues.push('showSidebar 计算结果为 false');
    }

    // 检查 DOM
    const sidebarElement = document.querySelector('.ant-layout-sider');
    if (!sidebarElement) {
      issues.push('侧边栏 DOM 元素未找到');
    }

    setDiagnostics({
      store: sidebar,
      computed,
      storedConfig: storedConfig?.state?.sidebar,
      issues,
      hasIssues: issues.length > 0,
    });
  };

  const fixSidebarHidden = () => {
    if (import.meta.env.DEV) {
      console.log('修复 sidebar.hidden...');
    }
    updateSidebar({ hidden: false });
    setTimeout(() => {
      runDiagnostics();
      window.location.reload();
    }, 100);
  };

  const resetLayoutPreferences = () => {
    if (confirm('确定要重置所有布局配置吗？')) {
      localStorage.removeItem('layout-preferences');
      window.location.reload();
    }
  };

  if (!diagnostics) {
    return <div>加载中...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">布局诊断工具</h1>

      {/* 问题警报 */}
      {diagnostics.hasIssues && (
        <Alert
          type="error"
          message="检测到布局问题"
          description={
            <div className="space-y-2">
              <div>发现以下问题：</div>
              <ul className="list-disc list-inside">
                {diagnostics.issues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          }
        />
      )}

      {!diagnostics.hasIssues && (
        <Alert
          type="success"
          message="布局配置正常"
          description="未检测到明显的配置问题"
        />
      )}

      {/* 当前配置 */}
      <Card title="当前 Store 配置">
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="hidden">{String(diagnostics.store.hidden)}</Descriptions.Item>
          <Descriptions.Item label="collapsed">{String(diagnostics.store.collapsed)}</Descriptions.Item>
          <Descriptions.Item label="width">{diagnostics.store.width}</Descriptions.Item>
          <Descriptions.Item label="collapsedWidth">{diagnostics.store.collapsedWidth}</Descriptions.Item>
          <Descriptions.Item label="expandOnHover">{String(diagnostics.store.expandOnHover)}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 计算属性 */}
      <Card title="计算属性">
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="showSidebar">{String(diagnostics.computed.showSidebar)}</Descriptions.Item>
          <Descriptions.Item label="isSidebarNav">{String(diagnostics.computed.isSidebarNav)}</Descriptions.Item>
          <Descriptions.Item label="isFullContent">{String(diagnostics.computed.isFullContent)}</Descriptions.Item>
          <Descriptions.Item label="sidebarWidth">{diagnostics.computed.sidebarWidth}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* LocalStorage 配置 */}
      <Card title="LocalStorage 存储配置">
        {diagnostics.storedConfig ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="hidden">{String(diagnostics.storedConfig.hidden)}</Descriptions.Item>
            <Descriptions.Item label="collapsed">{String(diagnostics.storedConfig.collapsed)}</Descriptions.Item>
            <Descriptions.Item label="width">{diagnostics.storedConfig.width}</Descriptions.Item>
          </Descriptions>
        ) : (
          <div>未找到存储配置</div>
        )}
      </Card>

      {/* 修复按钮 */}
      <div className="flex gap-2">
        <Button type="primary" onClick={runDiagnostics}>
          重新诊断
        </Button>
        {diagnostics.store.hidden && (
          <Button type="primary" danger onClick={fixSidebarHidden}>
            修复 sidebar.hidden
          </Button>
        )}
        <Button onClick={resetLayoutPreferences}>
          重置所有配置
        </Button>
      </div>
    </div>
  );
};

export default LayoutDiagnostic;
