import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Database,
  Users,
  Calendar,
  Settings,
  Bell,
  LogOut,
  User,
  Menu as MenuIcon,
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: '仪表板',
    },
    {
      key: '/rag',
      icon: <Database size={18} />,
      label: 'RAG 知识库',
    },
    {
      key: '/user-center',
      icon: <Users size={18} />,
      label: '用户中心',
    },
    {
      key: '/scheduler',
      icon: <Calendar size={18} />,
      label: '任务调度',
    },
    {
      key: '/settings',
      icon: <Settings size={18} />,
      label: '系统设置',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="shadow-lg"
        theme="light"
        width={240}
      >
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className={`font-bold text-xl ${collapsed ? 'hidden' : 'block'}`}>
            Sentinel-X
          </h1>
          {collapsed && <span className="font-bold text-xl">SX</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="bg-white px-6 shadow-sm flex items-center justify-between">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MenuIcon size={20} />
          </button>

          <div className="flex items-center gap-6">
            <Badge count={5} className="cursor-pointer">
              <Bell size={20} className="text-gray-600" />
            </Badge>

            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  size="default"
                  style={{ backgroundColor: '#1890ff' }}
                >
                  Admin
                </Avatar>
                <span className="text-sm font-medium">管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
