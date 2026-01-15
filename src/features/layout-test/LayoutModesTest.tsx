import React from 'react';
import { Card, Button, Space, Tag, Alert } from 'antd';
import { useLayoutStore, useLayoutComputed, type LayoutType } from '@/store/layoutStore';

/**
 * 布局模式测试页面
 * 用于快速切换和验证所有 7 种布局模式
 */
const LayoutModesTest: React.FC = () => {
  const layout = useLayoutStore((state) => state.app.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const computed = useLayoutComputed();

  const layoutModes: Array<{
    type: LayoutType;
    name: string;
    description: string;
    features: string[];
  }> = [
    {
      type: 'sidebar-nav',
      name: '侧边导航',
      description: '经典的侧边栏布局，Logo 在侧边栏顶部',
      features: [
        'Logo 在 Sidebar 顶部',
        'Sidebar 从 top: 0 开始',
        'Header 有左边距',
        '折叠时显示图标，展开时显示图标+文字',
      ],
    },
    {
      type: 'sidebar-mixed-nav',
      name: '侧边混合',
      description: '双列侧边栏布局',
      features: [
        '左列：一级菜单（仅图标，72px）+ Logo 图标',
        '右列：二级菜单（200px，可折叠）+ Logo 文字',
        'Sidebar 从 top: 0 开始',
        'Header 有左边距',
      ],
    },
    {
      type: 'header-nav',
      name: '顶部导航',
      description: '所有菜单在顶部',
      features: [
        'Logo 在 Header 左侧',
        '无侧边栏',
        '菜单水平排列',
        'Header 全宽',
      ],
    },
    {
      type: 'header-sidebar-nav',
      name: '顶部通栏+侧边',
      description: 'Header 全宽显示一级菜单，Sidebar 显示二级菜单',
      features: [
        'Logo 在 Sidebar 顶部',
        'Header 全宽',
        'Sidebar 从 Header 下方开始',
        'Header 显示一级菜单',
        'Sidebar 显示二级菜单',
      ],
    },
    {
      type: 'mixed-nav',
      name: '混合导航',
      description: '顶部一级菜单 + 侧边二级菜单',
      features: [
        'Logo 在 Header 左侧或顶部一级菜单中',
        '顶部：一级菜单（全宽）',
        'Sidebar：Logo + 二级菜单',
        'Sidebar 从顶部菜单下方开始',
      ],
    },
    {
      type: 'header-mixed-nav',
      name: '顶部混合',
      description: '顶部双行菜单',
      features: [
        'Logo 在 Header 左侧',
        '第一行：一级菜单',
        '第二行：二级菜单',
        '无侧边栏',
      ],
    },
    {
      type: 'full-content',
      name: '全屏内容',
      description: '纯内容展示，无导航',
      features: [
        '无 Header',
        '无 Sidebar',
        '浮动设置按钮',
        '适合大屏展示',
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">布局模式验证</h1>
          <p className="text-muted-foreground mt-2">
            快速切换所有 7 种布局模式，验证与 vben-admin 的一致性
          </p>
        </div>
        <Tag color="blue" className="text-sm">
          当前: {layout}
        </Tag>
      </div>

      {/* 当前状态显示 */}
      <Alert
        type="info"
        message="当前布局状态"
        description={
          <div className="space-y-1 text-xs">
            <div>布局模式: <code>{layout}</code></div>
            <div>显示侧边栏: {computed.showSidebar ? '✅' : '❌'}</div>
            <div>显示顶部菜单: {computed.showHeaderMenu ? '✅' : '❌'}</div>
            <div>Logo 在 Header: {computed.showHeaderLogo ? '✅' : '❌'}</div>
            <div>Logo 在 Sidebar: {computed.showSidebarLogo ? '✅' : '❌'}</div>
          </div>
        }
      />

      {/* 布局模式列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layoutModes.map((mode) => (
          <Card
            key={mode.type}
            title={
              <div className="flex items-center justify-between">
                <span>{mode.name}</span>
                {layout === mode.type && (
                  <Tag color="green" className="ml-2">
                    当前
                  </Tag>
                )}
              </div>
            }
            extra={
              <Button
                type={layout === mode.type ? 'primary' : 'default'}
                size="small"
                onClick={() => setLayout(mode.type)}
              >
                切换
              </Button>
            }
            className="h-full"
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{mode.description}</p>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground">特性：</div>
                <ul className="text-xs space-y-1 text-muted-foreground pl-4">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="list-disc">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 验证指南 */}
      <Card title="验证指南">
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">验证步骤：</h4>
            <ol className="space-y-2 pl-5">
              <li className="list-decimal">点击上方卡片的"切换"按钮，切换到对应的布局模式</li>
              <li className="list-decimal">观察 Logo 的显示位置和状态</li>
              <li className="list-decimal">检查侧边栏、Header、菜单的布局</li>
              <li className="list-decimal">测试折叠/展开功能</li>
              <li className="list-decimal">对比 vben-admin 的效果</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">检查要点：</h4>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                <strong>Logo 位置：</strong>
                <span className="text-muted-foreground ml-2">
                  sidebar-nav/sidebar-mixed-nav/header-sidebar-nav 在 Sidebar，
                  其他模式在 Header
                </span>
              </li>
              <li className="list-disc">
                <strong>侧边栏显示：</strong>
                <span className="text-muted-foreground ml-2">
                  header-nav/header-mixed-nav/full-content 无侧边栏
                </span>
              </li>
              <li className="list-disc">
                <strong>Header 宽度：</strong>
                <span className="text-muted-foreground ml-2">
                  有侧边栏时 Header 有左边距，无侧边栏时 Header 全宽
                </span>
              </li>
              <li className="list-disc">
                <strong>菜单位置：</strong>
                <span className="text-muted-foreground ml-2">
                  注意顶部菜单和侧边菜单的显示位置
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LayoutModesTest;
