import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Tag, Space, Button, App, Spin } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { ragService } from '@/services/ragService';
import type { Document } from '@/types/rag';

const { TextArea } = Input;

interface DocumentViewEditModalProps {
  documentId: string;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function DocumentViewEditModal({
  documentId,
  open,
  onClose,
  onUpdate,
}: DocumentViewEditModalProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const fetchDocument = useCallback(async () => {
    setLoading(true);
    try {
      const doc = await ragService.getDocument(documentId);
      setDocument(doc);
      form.setFieldsValue({
        title: doc.title,
        content: doc.content,
      });
    } catch (error) {
      message.error('获取文档失败');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [documentId, form]);

  useEffect(() => {
    if (open && documentId) {
      fetchDocument();
    }
  }, [open, documentId, fetchDocument]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      await ragService.updateDocument(documentId, {
        title: values.title,
        content: values.content,
      });

      message.success('文档更新成功');
      setEditing(false);
      fetchDocument();
      onUpdate();
    } catch (error) {
      message.error('更新失败，请重试');
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editing) {
      form.setFieldsValue({
        title: document?.title,
        content: document?.content,
      });
      setEditing(false);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      title={
        editing ? (
          <Space>
            <EditOutlined />
            编辑文档
          </Space>
        ) : (
          '文档详情'
        )
      }
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={
        editing ? (
          <Space>
            <Button icon={<CloseOutlined />} onClick={handleCancel}>
              取消
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                border: 'none',
              }}
            >
              保存
            </Button>
          </Space>
        ) : (
          <Space>
            <Button onClick={onClose}>关闭</Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                border: 'none',
              }}
            >
              编辑
            </Button>
          </Space>
        )
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title">
            <Input size="large" disabled={!editing} />
          </Form.Item>

          <Form.Item label="内容" name="content">
            <TextArea rows={16} disabled={!editing} size="large" />
          </Form.Item>

          {document?.metadata && document.metadata.tags && Array.isArray(document.metadata.tags) ? (
            <Form.Item label="标签">
              <Space wrap>
                {document.metadata.tags.map((tag: string) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </Space>
            </Form.Item>
          ) : null}

          {document && (
            <Form.Item label="元信息">
              <Space direction="vertical">
                <div>
                  <span style={{ color: '#888' }}>创建时间：</span>
                  {new Date(document.createdAt).toLocaleString('zh-CN')}
                </div>
                <div>
                  <span style={{ color: '#888' }}>更新时间：</span>
                  {new Date(document.updatedAt).toLocaleString('zh-CN')}
                </div>
                {document.status && (
                  <div>
                    <span style={{ color: '#888' }}>状态：</span>
                    <Tag
                      color={
                        document.status === 'completed'
                          ? 'success'
                          : document.status === 'processing'
                          ? 'processing'
                          : 'error'
                      }
                    >
                      {document.status === 'completed'
                        ? '已完成'
                        : document.status === 'processing'
                        ? '处理中'
                        : '失败'}
                    </Tag>
                  </div>
                )}
              </Space>
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
