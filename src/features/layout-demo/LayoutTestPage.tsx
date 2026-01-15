import { Card, Button, Space, Tag, Alert, Divider, Descriptions, Switch } from 'antd';
import {
  LayoutDashboard,
  Monitor,
  SlidersHorizontal,
  Palette,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useLayoutStore, type LayoutType } from '@/store/layoutStore';

/**
 * 布局模式测试页面
 * 用于测试和演示所有 7 种布局模式
 */
export default function LayoutTestPage() {
  const app = useLayoutStore((state) => state.app);
  const sidebar = useLayoutStore((state) => state.sidebar);
  const tabbar = useLayoutStore((state) => state.tabbar);
  const footer = useLayoutStore((state) => state.footer);
  const theme = useLayoutStore((state) => state.theme);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const toggleSidebarCollapse = useLayoutStore((state) => state.toggleSidebarCollapse);
  const toggleTabbar = useLayoutStore((state) => state.toggleTabbar);
  const toggleFooter = useLayoutStore((state) => state.toggleFooter);
  const toggleThemeMode = useLayoutStore((state) => state.toggleThemeMode);

  const layoutConfigs: Array<{
    key: LayoutType;
    name: string;
    description: string;
    status: 'complete' | 'basic' | 'pending';
    features: string[];
    icon: React.ReactNode;
  }> = [
    {
      key: 'sidebar-nav',
      name: '侧边导航布局',
      description: '默认布局模式，左侧垂直菜单，右侧内容区域',
      status: 'complete',
      features: ['垂直侧边栏', '可折叠', '悬停展开', '固定定位'],
      icon: <LayoutDashboard size={20} />,
    },
    {
      key: 'header-nav',
      name: '顶部导航布局',
      description: '顶部横向菜单，适合菜单项较少的场景',
      status: 'complete',
      features: ['横向菜单', '全宽布局', '响应式', '自动隐藏'],
      icon: <Monitor size={20} />,
    },
    {
      key: 'mixed-nav',
      name: '混合导航布局',
      description: '顶部显示一级菜单，左侧显示二级菜单',
      status: 'complete',
      features: ['顶部一级菜单', '侧边二级菜单', '动态切换', '两级联动'],
      icon: <SlidersHorizontal size={20} />,
    },
    {
      key: 'sidebar-mixed-nav',
      name: '侧边混合布局',
      description: '双列侧边栏，左列一级菜单(图标)，右列二级菜单',
      status: 'complete',
      features: ['双列侧边栏', '图标导航', '二级展开', '空间高效'],
      icon: <LayoutDashboard size={20} />,
    },
    {
      key: 'header-mixed-nav',
      name: '顶部混合布局',
      description: '顶部双行菜单，第一行一级菜单，第二行二级菜单',
      status: 'complete',
      features: ['双行菜单', '顶部集中', '无侧边栏', '宽屏优化'],
      icon: <Monitor size={20} />,
    },
    {
      key: 'header-sidebar-nav',
      name: '顶部通栏+侧边布局',
      description: 'Header 全宽不分割，侧边栏在 Header 下方',
      status: 'complete',
      features: ['全宽顶栏', '侧边菜单', '独立区域', '经典布局'],
      icon: <LayoutDashboard size={20} />,
    },
    {
      key: 'full-content',
      name: '全屏内容布局',
      description: '纯内容展示，无任何导航和边栏元素',
      status: 'complete',
      features: ['全屏展示', '无边栏', '无顶栏', '沉浸式'],
      icon: <Palette size={20} />,
    },
  ];

  const getStatusTag = (status: string) => {
    const config = {
      complete: { color: 'success', text: '完整' },
      basic: { color: 'processing', text: '基础' },
      pending: { color: 'warning', text: '待完善' },
    }[status] || { color: 'default', text: '未知' };

    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleLayoutChange = (layout: LayoutType) => {
    setLayout(layout);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <LayoutDashboard size={28} className="text-primary" />
            布局模式测试中心
          </h1>
          <p className="text-muted-foreground mt-2">
            测试和演示 Vben Admin 的 7 种布局模式，支持实时切换预览
          </p>
        </div>
      </div>

      {/* 当前布局状态 */}
      <Alert
        message={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info size={16} />
              <span className="font-semibold">当前布局模式：</span>
              <Tag color="blue" className="text-base px-3 py-1">
                {layoutConfigs.find((c) => c.key === app.layout)?.name || app.layout}
              </Tag>
            </div>
            <Space>
              <span className="text-xs text-muted-foreground">侧边栏折叠:</span>
              <Switch checked={sidebar.collapsed} onChange={toggleSidebarCollapse} size="small" />
              <Divider type="vertical" />
              <span className="text-xs text-muted-foreground">标签页:</span>
              <Switch checked={tabbar.enable} onChange={toggleTabbar} size="small" />
              <Divider type="vertical" />
              <span className="text-xs text-muted-foreground">页脚:</span>
              <Switch checked={footer.enable} onChange={toggleFooter} size="small" />
              <Divider type="vertical" />
              <span className="text-xs text-muted-foreground">主题:</span>
              <Switch
                checked={theme.mode === 'dark'}
                onChange={toggleThemeMode}
                size="small"
                checkedChildren="🌙"
                unCheckedChildren="☀️"
              />
            </Space>
          </div>
        }
        type="info"
        showIcon={false}
      />

      {/* 布局模式卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layoutConfigs.map((config) => (
          <Card
            key={config.key}
            className={`
              transition-all duration-300 hover:shadow-lg cursor-pointer
              ${app.layout === config.key ? 'ring-2 ring-primary shadow-md' : ''}
            `}
            onClick={() => handleLayoutChange(config.key)}
          >
            <div className="space-y-4">
              {/* 标题行 */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{config.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.key}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusTag(config.status)}
                  {app.layout === config.key && (
                    <CheckCircle2 size={18} className="text-success" />
                  )}
                </div>
              </div>

              {/* 描述 */}
              <p className="text-sm text-foreground/80">{config.description}</p>

              {/* 特性标签 */}
              <div className="flex flex-wrap gap-2">
                {config.features.map((feature) => (
                  <Tag key={feature} className="text-xs">
                    {feature}
                  </Tag>
                ))}
              </div>

              {/* 操作按钮 */}
              <Button
                type={app.layout === config.key ? 'primary' : 'default'}
                block
                onClick={(e) => {
                  e.stopPropagation();
                  handleLayoutChange(config.key);
                }}
              >
                {app.layout === config.key ? '当前布局' : '切换至此布局'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 当前布局详细信息 */}
      <Card title="当前布局详细配置" className="mt-6">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="布局模式">
            {layoutConfigs.find((c) => c.key === app.layout)?.name || app.layout}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {getStatusTag(
              layoutConfigs.find((c) => c.key === app.layout)?.status || 'pending'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="侧边栏宽度">
            {sidebar.collapsed ? sidebar.collapsedWidth : sidebar.width}px
          </Descriptions.Item>
          <Descriptions.Item label="侧边栏状态">
            {sidebar.collapsed ? '已折叠' : '展开'}
            {sidebar.expandOnHover && ' (悬停展开)'}
          </Descriptions.Item>
          <Descriptions.Item label="顶栏高度">{header.height}px</Descriptions.Item>
          <Descriptions.Item label="顶栏模式">{header.mode}</Descriptions.Item>
          <Descriptions.Item label="标签页">
            {tabbar.enable ? `启用 (${tabbar.height}px)` : '禁用'}
          </Descriptions.Item>
          <Descriptions.Item label="页脚">{footer.enable ? '启用' : '禁用'}</Descriptions.Item>
          <Descriptions.Item label="主题模式">{theme.mode}</Descriptions.Item>
          <Descriptions.Item label="主题色">{theme.colorPrimaryKey}</Descriptions.Item>
          <Descriptions.Item label="移动端">{app.isMobile ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="布局动画">
            {transition.enable ? '启用' : '禁用'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 使用说明 */}
      <Card title="💡 使用说明">
        <div className="space-y-3 text-sm">
          <p>
            <strong>1. 布局切换：</strong>
            点击上方的布局卡片可以实时切换不同的布局模式，体验各种布局的效果。
          </p>
          <p>
            <strong>2. 配置调整：</strong>
            使用顶部的开关可以快速切换侧边栏折叠、标签页、页脚和主题模式。
          </p>
          <p>
            <strong>3. 全局设置：</strong>
            点击右上角的设置图标可以打开偏好设置抽屉，进行更详细的配置。
          </p>
          <p>
            <strong>4. 响应式：</strong>
            所有布局模式都支持响应式设计，可以在移动端、平板和桌面端自适应显示。
          </p>
          <p>
            <strong>5. 持久化：</strong>
            所有布局配置都会自动保存到本地存储，刷新页面后配置保持不变。
          </p>
        </div>
      </Card>
    </div>
  );
}
