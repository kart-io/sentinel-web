import { Card, Row, Col, Table, Progress, Button, Tag, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Users,
  Activity,
  MoreHorizontal,
  FileText,
  Clock,
  Shield,
  Download,
  TrendingUp,
  TrendingDown,
  Layers,
  BarChart2
} from 'lucide-react';

interface TaskData {
  key: string;
  name: string;
  status: string;
  progress: number;
  time: string;
  id: string;
}

const taskColumns: ColumnsType<TaskData> = [
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => (
      <div className="flex items-center gap-2">
        <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{text}</span>
      </div>
    ),
  },
  {
    title: '任务ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => (
      <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
        {text}
      </span>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let color = 'default';
      if (status === '运行中') color = 'processing';
      if (status === '已完成') color = 'success';
      if (status === '等待中') color = 'warning';

      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    width: 200,
    render: (progress: number) => (
      <Progress
        percent={progress}
        size="small"
        strokeColor="#0960bd"
        railColor="#f5f5f5"
      />
    ),
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
    render: (text) => (
      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
        <Clock size={12} />
        <span>{text}</span>
      </div>
    ),
  },
];

const taskData: TaskData[] = [
  {
    key: '1',
    id: 'TSK-2023-001',
    name: '数据同步任务',
    status: '运行中',
    progress: 65,
    time: '2分钟前',
  },
  {
    key: '2',
    id: 'TSK-2023-002',
    name: 'RAG 索引构建',
    status: '已完成',
    progress: 100,
    time: '10分钟前',
  },
  {
    key: '3',
    id: 'TSK-2023-003',
    name: '报表生成',
    status: '等待中',
    progress: 0,
    time: '15分钟前',
  },
  {
    key: '4',
    id: 'TSK-2023-004',
    name: '数据备份',
    status: '已完成',
    progress: 100,
    time: '1小时前',
  },
];

interface AnalysisCardProps {
  title: string;
  value: string | number;
  icon: any;
  total: string;
  trend: string;
  trendUp: boolean;
}

const AnalysisCard = ({
  title,
  value,
  icon: Icon,
  total,
  trend,
  trendUp
}: AnalysisCardProps) => (
  <div
    className="bg-white p-5 transition-all duration-300 hover:shadow-md cursor-pointer group"
    style={{
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border-secondary)'
    }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex flex-col">
        <span className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          {title}
        </span>
        <h3
          className="text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--color-text-primary)', marginBottom: 0 }}
        >
          {value}
        </h3>
      </div>
      <div
        className="p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: 'rgba(9, 96, 189, 0.08)' }}
      >
        <Icon size={22} style={{ color: 'var(--color-primary)' }} />
      </div>
    </div>

    <div
      className="flex items-center justify-between pt-3"
      style={{ borderTop: '1px solid var(--color-border-secondary)' }}
    >
      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
        {total}
      </span>
      <div
        className="flex items-center text-xs font-medium"
        style={{ color: trendUp ? '#52c41a' : '#ff4d4f' }}
      >
        {trend}
        {trendUp ? (
          <TrendingUp size={14} className="ml-1" />
        ) : (
          <TrendingDown size={14} className="ml-1" />
        )}
      </div>
    </div>
  </div>
);

interface QuickNavItemProps {
  label: string;
  icon: any;
  color: string;
}

const QuickNavItem = ({ label, icon: Icon, color }: QuickNavItemProps) => (
  <div
    className="flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-200 group"
    style={{ borderRadius: 'var(--border-radius)' }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'var(--color-border-secondary)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}
  >
    <Icon
      size={24}
      className="mb-2 transition-transform duration-200 group-hover:scale-110"
      style={{ color }}
    />
    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
      {label}
    </span>
  </div>
);

interface TeamActivityItemProps {
  index: number;
}

const TeamActivityItem = ({ index }: TeamActivityItemProps) => (
  <div
    className="flex items-start gap-3 pb-3 last:pb-0"
    style={{ borderBottom: index < 2 ? '1px solid var(--color-border-secondary)' : 'none' }}
  >
    <Avatar
      size={36}
      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${index + 1}`}
      style={{ flexShrink: 0 }}
    />
    <div className="flex-1 min-w-0">
      <p className="text-xs mb-1" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
        <span className="font-semibold">用户{index + 1}</span>
        {' '}更新了{' '}
        <span style={{ color: 'var(--color-primary)' }}>README.md</span>
      </p>
      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)', margin: 0 }}>
        2小时前
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <Card
        variant="borderless"
        className="shadow-sm"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              size={72}
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              style={{ backgroundColor: 'var(--color-primary)', flexShrink: 0 }}
            />
            <div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)', margin: 0, marginBottom: '8px' }}
              >
                早安, Admin, 开始您的一天吧！
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)', margin: 0 }}
              >
                今日多云转晴，20℃ - 25℃
              </p>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-10">
            <div className="text-center lg:text-right">
              <p
                className="text-xs mb-1"
                style={{ color: 'var(--color-text-tertiary)', margin: 0, marginBottom: '4px' }}
              >
                项目数
              </p>
              <h3
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)', margin: 0 }}
              >
                12
              </h3>
            </div>
            <div className="text-center lg:text-right">
              <p
                className="text-xs mb-1"
                style={{ color: 'var(--color-text-tertiary)', margin: 0, marginBottom: '4px' }}
              >
                待办
              </p>
              <h3
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)', margin: 0 }}
              >
                3/24
              </h3>
            </div>
            <div className="text-center lg:text-right">
              <p
                className="text-xs mb-1"
                style={{ color: 'var(--color-text-tertiary)', margin: 0, marginBottom: '4px' }}
              >
                消息
              </p>
              <h3
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)', margin: 0 }}
              >
                2,345
              </h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <AnalysisCard
            title="访问量"
            value="25,890"
            icon={Activity}
            total="总访问量 120,000"
            trend="12%"
            trendUp={true}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnalysisCard
            title="销售额"
            value="¥12,423"
            icon={BarChart2}
            total="总销售额 ¥680,000"
            trend="5%"
            trendUp={false}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnalysisCard
            title="订单量"
            value="1,680"
            icon={Layers}
            total="转化率 60%"
            trend="8%"
            trendUp={true}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnalysisCard
            title="新增用户"
            value="125"
            icon={Users}
            total="总用户 12,345"
            trend="2%"
            trendUp={true}
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                最新任务动态
              </span>
            }
            bordered={false}
            className="shadow-sm h-full"
            style={{ borderRadius: 'var(--border-radius)' }}
            styles={{
              header: {
                borderBottom: '1px solid var(--color-border-secondary)',
                minHeight: '52px',
                padding: '16px 24px'
              },
              body: { padding: 0 }
            }}
            extra={
              <Button
                type="link"
                size="small"
                style={{ color: 'var(--color-primary)' }}
              >
                更多
              </Button>
            }
          >
            <Table
              columns={taskColumns}
              dataSource={taskData}
              pagination={false}
              size="middle"
              className="dashboard-table"
              rowClassName={(_, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
              style={{
                '--hover-bg': 'rgba(9, 96, 189, 0.04)'
              } as React.CSSProperties}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                快捷导航
              </span>
            }
            bordered={false}
            className="shadow-sm h-full"
            style={{ borderRadius: 'var(--border-radius)' }}
            styles={{
              header: {
                borderBottom: '1px solid var(--color-border-secondary)',
                minHeight: '52px',
                padding: '16px 24px'
              },
              body: { padding: '24px' }
            }}
          >
            <div className="grid grid-cols-3 gap-2 mb-6">
              <QuickNavItem label="用户管理" icon={Users} color="#0960bd" />
              <QuickNavItem label="系统分析" icon={Activity} color="#10b981" />
              <QuickNavItem label="权限配置" icon={Shield} color="#f59e0b" />
              <QuickNavItem label="文件管理" icon={FileText} color="#8b5cf6" />
              <QuickNavItem label="数据导出" icon={Download} color="#ef4444" />
              <QuickNavItem label="系统设置" icon={MoreHorizontal} color="#6b7280" />
            </div>

            <div
              className="pt-5"
              style={{ borderTop: '1px solid var(--color-border-secondary)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  团队动态
                </span>
                <Button
                  type="link"
                  size="small"
                  style={{ color: 'var(--color-primary)', padding: 0 }}
                >
                  查看全部
                </Button>
              </div>
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <TeamActivityItem key={i} index={i} />
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
