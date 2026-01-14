import React, { useState } from 'react';
import { Drawer, Tabs, List, Avatar, Badge, Button, Empty, Typography } from 'antd';
import { Bell, MessageSquare, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'message' | 'system' | 'todo';
  title: string;
  content: string;
  time: string;
  read: boolean;
  avatar?: string;
}

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: '系统消息',
    content: '您有一条新的系统通知，请及时查看。',
    time: '5分钟前',
    read: false,
  },
  {
    id: '2',
    type: 'system',
    title: '系统更新',
    content: '系统将于今晚 22:00 进行维护升级。',
    time: '1小时前',
    read: false,
  },
  {
    id: '3',
    type: 'todo',
    title: '待办提醒',
    content: '您有 3 个待处理的任务即将到期。',
    time: '2小时前',
    read: true,
  },
  {
    id: '4',
    type: 'message',
    title: '新用户注册',
    content: '用户 张三 完成了注册。',
    time: '昨天',
    read: true,
  },
];

/**
 * 通知中心组件
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  // 过滤通知
  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.type === activeTab);
  };

  // 标记为已读
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // 标记全部已读
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 删除通知
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 清空通知
  const clearAll = () => {
    setNotifications([]);
  };

  // 获取未读数量
  const getUnreadCount = (type?: string) => {
    if (type) {
      return notifications.filter((n) => n.type === type && !n.read).length;
    }
    return notifications.filter((n) => !n.read).length;
  };

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'system':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'todo':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const tabItems = [
    {
      key: 'all',
      label: (
        <Badge count={getUnreadCount()} size="small" offset={[8, 0]}>
          <span>全部</span>
        </Badge>
      ),
    },
    {
      key: 'message',
      label: (
        <Badge count={getUnreadCount('message')} size="small" offset={[8, 0]}>
          <span>消息</span>
        </Badge>
      ),
    },
    {
      key: 'system',
      label: (
        <Badge count={getUnreadCount('system')} size="small" offset={[8, 0]}>
          <span>系统</span>
        </Badge>
      ),
    },
    {
      key: 'todo',
      label: (
        <Badge count={getUnreadCount('todo')} size="small" offset={[8, 0]}>
          <span>待办</span>
        </Badge>
      ),
    },
  ];

  const filteredNotifications = getFilteredNotifications();

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span>通知中心</span>
          <div className="flex items-center gap-2">
            <Button type="link" size="small" onClick={markAllAsRead}>
              全部已读
            </Button>
            <Button type="link" size="small" danger onClick={clearAll}>
              清空
            </Button>
          </div>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={380}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="notification-tabs"
      />

      {filteredNotifications.length > 0 ? (
        <List
          dataSource={filteredNotifications}
          renderItem={(item) => (
            <List.Item
              className={`
                cursor-pointer transition-colors rounded-lg mb-2 px-3
                ${item.read ? 'bg-transparent' : 'bg-blue-50 dark:bg-blue-900/20'}
                hover:bg-gray-50 dark:hover:bg-gray-800
              `}
              onClick={() => markAsRead(item.id)}
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={<Trash2 size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={40}
                    icon={getNotificationIcon(item.type)}
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                }
                title={
                  <div className="flex items-center gap-2">
                    <Typography.Text
                      strong={!item.read}
                      className="dark:text-gray-200"
                    >
                      {item.title}
                    </Typography.Text>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                    )}
                  </div>
                }
                description={
                  <div>
                    <Typography.Paragraph
                      ellipsis={{ rows: 2 }}
                      className="text-gray-500 dark:text-gray-400 mb-1 !text-xs"
                    >
                      {item.content}
                    </Typography.Paragraph>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock size={12} />
                      <span>{item.time}</span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description="暂无通知"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="mt-20"
        />
      )}
    </Drawer>
  );
};

export default NotificationCenter;
