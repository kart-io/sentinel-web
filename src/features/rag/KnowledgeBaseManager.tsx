import { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  App,
  Tag,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { KnowledgeBase } from '@/types/rag';
import { ragService } from '@/services/ragService';
import KnowledgeBaseDetailView from './KnowledgeBaseDetailView';

const { TextArea } = Input;
const { Text } = Typography;

interface KnowledgeBaseManagerProps {
  knowledgeBases: KnowledgeBase[];
  onUpdate: () => void;
}

export default function KnowledgeBaseManager({ knowledgeBases, onUpdate }: KnowledgeBaseManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedKBId, setSelectedKBId] = useState<string | null>(null);
  const { message } = App.useApp();

  const handleCreate = async (values: { name: string; description: string }) => {
    setLoading(true);
    try {
      await ragService.createKnowledgeBase(values);
      message.success('知识库创建成功');
      form.resetFields();
      setIsModalOpen(false);
      onUpdate();
    } catch (error) {
      message.error('创建失败，请重试');
      console.error('Create error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ragService.deleteKnowledgeBase(id);
      message.success('知识库已删除');
      onUpdate();
    } catch (error) {
      message.error('删除失败，请重试');
      console.error('Delete error:', error);
    }
  };

  const columns = [
    {
      title: '知识库名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#8b5cf6' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '文档数量',
      dataIndex: 'documentCount',
      key: 'documentCount',
      render: (count: number) => <Tag color="blue">{count} 篇</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Space>
          <ClockCircleOutlined />
          {new Date(date).toLocaleDateString('zh-CN')}
        </Space>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: KnowledgeBase) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedKBId(record.id)}
          >
            查看详情
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除知识库"${record.name}"吗？此操作不可恢复。`}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 如果选中了知识库，显示详情页面
  if (selectedKBId) {
    return (
      <KnowledgeBaseDetailView
        knowledgeBaseId={selectedKBId}
        onBack={() => setSelectedKBId(null)}
      />
    );
  }

  return (
    <>
      <Card
        title="知识库管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              border: 'none',
            }}
          >
            创建知识库
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={knowledgeBases}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个知识库`,
          }}
        />
      </Card>

      <Modal
        title="创建知识库"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="知识库名称"
            name="name"
            rules={[{ required: true, message: '请输入知识库名称' }]}
          >
            <Input placeholder="例如：DevOps 最佳实践" size="large" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入知识库描述' }]}
          >
            <TextArea
              placeholder="简要描述该知识库的内容和用途"
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                  border: 'none',
                }}
              >
                创建
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
