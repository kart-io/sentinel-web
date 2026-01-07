import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Spin, Tag, Collapse, Select, message } from 'antd';
import { SendOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { ragService } from '@/services/ragService';
import type { KnowledgeBase, QueryResponse } from '@/types/rag';

const { TextArea } = Input;
const { Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface RAGQueryProps {
  knowledgeBases: KnowledgeBase[];
}

export default function RAGQuery({ knowledgeBases }: RAGQueryProps) {
  const [query, setQuery] = useState('');
  const [selectedKB, setSelectedKB] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);

  const handleQuery = async () => {
    if (!query.trim()) {
      message.warning('请输入查询问题');
      return;
    }

    if (!selectedKB) {
      message.warning('请选择知识库');
      return;
    }

    setLoading(true);
    try {
      const result = await ragService.query({
        query: query.trim(),
        knowledgeBaseId: selectedKB,
        topK: 5,
        temperature: 0.7,
      });
      setResponse(result);
    } catch (error) {
      message.error('查询失败，请重试');
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 查询输入区 */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>选择知识库</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="选择要查询的知识库"
              value={selectedKB}
              onChange={setSelectedKB}
              size="large"
            >
              {knowledgeBases.map((kb) => (
                <Select.Option key={kb.id} value={kb.id}>
                  <Space>
                    <FileTextOutlined />
                    <span>{kb.name}</span>
                    <Tag color="blue">{kb.documentCount} 篇文档</Tag>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>输入您的问题</Text>
            <TextArea
              placeholder="请输入您想要查询的问题，例如：Docker 容器化的最佳实践是什么？"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onPressEnter={(e) => {
                if (e.shiftKey) return;
                e.preventDefault();
                handleQuery();
              }}
              autoSize={{ minRows: 3, maxRows: 6 }}
              style={{ marginTop: 8 }}
              size="large"
            />
          </div>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleQuery}
            loading={loading}
            size="large"
            block
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              border: 'none',
            }}
          >
            {loading ? '查询中...' : '查询'}
          </Button>
        </Space>
      </Card>

      {/* 查询结果 */}
      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <Paragraph style={{ marginTop: 16, color: '#8b5cf6' }}>
              AI 正在分析您的问题并检索相关知识...
            </Paragraph>
          </div>
        </Card>
      )}

      {!loading && response && (
        <div className="space-y-4">
          {/* AI 回答 */}
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#8b5cf6' }} />
                <span>AI 回答</span>
                <Tag color="success">置信度: {(response.confidence * 100).toFixed(1)}%</Tag>
              </Space>
            }
          >
            <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: 1.8 }}>
              {response.answer}
            </Paragraph>
          </Card>

          {/* 相关文档来源 */}
          {response.sources && response.sources.length > 0 && (
            <Card title={<Space><FileTextOutlined />相关文档来源</Space>}>
              <Collapse accordion>
                {response.sources.map((source) => (
                  <Panel
                    header={
                      <Space>
                        <Tag color="purple">匹配度 {(source.score * 100).toFixed(1)}%</Tag>
                        <Text strong>{source.title}</Text>
                      </Space>
                    }
                    key={source.documentId}
                  >
                    <Paragraph>{source.content}</Paragraph>
                    {source.metadata && source.metadata.tags && Array.isArray(source.metadata.tags) ? (
                      <div style={{ marginTop: 8 }}>
                        {source.metadata.tags.map((tag: string) => (
                          <Tag key={tag} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    ) : null}
                  </Panel>
                ))}
              </Collapse>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
