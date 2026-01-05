import { Card, Row, Col, Statistic, Table, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Database,
  Activity,
  CheckCircle,
} from 'lucide-react';

interface TaskData {
  key: string;
  name: string;
  status: string;
  progress: number;
  time: string;
}

const taskColumns: ColumnsType<TaskData> = [
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          status === '运行中'
            ? 'bg-blue-100 text-blue-700'
            : status === '已完成'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {status}
      </span>
    ),
  },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    render: (progress: number) => <Progress percent={progress} size="small" />,
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
];

const taskData: TaskData[] = [
  {
    key: '1',
    name: '数据同步任务',
    status: '运行中',
    progress: 65,
    time: '2分钟前',
  },
  {
    key: '2',
    name: 'RAG 索引构建',
    status: '已完成',
    progress: 100,
    time: '10分钟前',
  },
  {
    key: '3',
    name: '报表生成',
    status: '等待中',
    progress: 0,
    time: '15分钟前',
  },
  {
    key: '4',
    name: '数据备份',
    status: '已完成',
    progress: 100,
    time: '1小时前',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">仪表板</h1>
        <p className="text-gray-500 mt-1">欢迎回到 Sentinel-X 管理平台</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">总用户数</p>
                <Statistic value={1243} className="mb-2" />
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight size={16} />
                  <span className="ml-1">+12% 本月</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">知识库文档</p>
                <Statistic value={8456} className="mb-2" />
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight size={16} />
                  <span className="ml-1">+5% 本周</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Database size={24} className="text-green-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">活跃任务</p>
                <Statistic value={42} className="mb-2" />
                <div className="flex items-center text-red-600 text-sm">
                  <ArrowDownRight size={16} />
                  <span className="ml-1">-3% 今日</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Activity size={24} className="text-yellow-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">完成率</p>
                <Statistic value={98.5} suffix="%" className="mb-2" />
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight size={16} />
                  <span className="ml-1">+1.2% 本周</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="最近任务" className="h-full">
            <Table
              columns={taskColumns}
              dataSource={taskData}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="系统状态" className="h-full">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">CPU 使用率</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress percent={45} strokeColor="#52c41a" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">内存使用率</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <Progress percent={68} strokeColor="#1890ff" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">磁盘使用率</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <Progress percent={32} strokeColor="#722ed1" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">网络流量</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress percent={85} strokeColor="#faad14" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
