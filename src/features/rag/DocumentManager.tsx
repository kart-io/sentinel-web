import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Popconfirm,
  Select,
  Typography,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { Document, KnowledgeBase } from '@/types/rag';
import { ragService } from '@/services/ragService';
import DocumentViewEditModal from './DocumentViewEditModal';

const { TextArea } = Input;
const { Text } = Typography;

interface DocumentManagerProps {
  knowledgeBases: KnowledgeBase[];
}

export default function DocumentManager({ knowledgeBases }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedKB, setSelectedKB] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedKB) {
      fetchDocuments();
    }
  }, [selectedKB]);

  const fetchDocuments = async () => {
    if (!selectedKB) return;

    setFetchLoading(true);
    try {
      const docs = await ragService.getDocuments(selectedKB);
      setDocuments(docs);
    } catch (error) {
      message.error('获取文档列表失败');
      console.error('Fetch error:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleUpload = async (values: { title: string; content: string }) => {
    if (!selectedKB) {
      message.warning('请先选择知识库');
      return;
    }

    setLoading(true);
    try {
      await ragService.uploadDocument({
        knowledgeBaseId: selectedKB,
        title: values.title,
        content: values.content,
      });
      message.success('文档上传成功');
      form.resetFields();
      setIsModalOpen(false);
      fetchDocuments();
    } catch (error) {
      message.error('上传失败，请重试');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ragService.deleteDocument(id);
      message.success('文档已删除');
      fetchDocuments();
    } catch (error) {
      message.error('删除失败，请重试');
      console.error('Delete error:', error);
    }
  };

  const columns = [
    {
      title: '文档标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#8b5cf6' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <Text ellipsis style={{ maxWidth: 300 }}>
          {text.substring(0, 100)}...
        </Text>
      ),
    },
    {
      title: '标签',
      dataIndex: 'metadata',
      key: 'tags',
      render: (metadata?: Record<string, unknown>) => {
        if (!metadata || !metadata.tags) return null;
        return (
          <Space>
            {(metadata.tags as string[]).map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Space>
          <ClockCircleOutlined />
          {new Date(date).toLocaleString('zh-CN')}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Document) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedDocId(record.id)}
          >
            查看
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除文档"${record.title}"吗？`}
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

  return (
    <>
      <Card
        title={
          <Space>
            <span>文档管理</span>
            <Select
              style={{ width: 250 }}
              placeholder="选择知识库"
              value={selectedKB}
              onChange={setSelectedKB}
            >
              {knowledgeBases.map((kb) => (
                <Select.Option key={kb.id} value={kb.id}>
                  {kb.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedKB}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              border: 'none',
            }}
          >
            上传文档
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={documents}
          rowKey="id"
          loading={fetchLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 篇文档`,
          }}
        />
      </Card>

      <Modal
        title="上传文档"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            label="文档标题"
            name="title"
            rules={[{ required: true, message: '请输入文档标题' }]}
          >
            <Input placeholder="例如：Docker 容器化最佳实践" size="large" />
          </Form.Item>

          <Form.Item
            label="文档内容"
            name="content"
            rules={[{ required: true, message: '请输入文档内容' }]}
          >
            <TextArea
              placeholder="输入或粘贴文档内容"
              rows={12}
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
                上传
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 文档查看/编辑弹窗 */}
      {selectedDocId && (
        <DocumentViewEditModal
          documentId={selectedDocId}
          open={!!selectedDocId}
          onClose={() => setSelectedDocId(null)}
          onUpdate={fetchDocuments}
        />
      )}
    </>
  );
}
