import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tag, List, Spin, Button, Space, Typography } from 'antd';
import {
  FileTextOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { ragService } from '@/services/ragService';
import type { KnowledgeBaseDetail } from '@/types/rag';

const { Title, Text } = Typography;

interface KnowledgeBaseDetailViewProps {
  knowledgeBaseId: string;
  onBack: () => void;
}

export default function KnowledgeBaseDetailView({
  knowledgeBaseId,
  onBack,
}: KnowledgeBaseDetailViewProps) {
  const [detail, setDetail] = useState<KnowledgeBaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [knowledgeBaseId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await ragService.getKnowledgeBaseDetail(knowledgeBaseId);
      setDetail(data);
    } catch (error) {
      console.error('Failed to fetch detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!detail) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Text type="secondary">未找到知识库信息</Text>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            返回列表
          </Button>

          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              <DatabaseOutlined style={{ color: '#8b5cf6', marginRight: 12 }} />
              {detail.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {detail.description}
            </Text>
          </div>

          <Space size="large">
            <div>
              <Text type="secondary">创建时间：</Text>
              <Text>{new Date(detail.createdAt).toLocaleString('zh-CN')}</Text>
            </div>
            <div>
              <Text type="secondary">更新时间：</Text>
              <Text>{new Date(detail.updatedAt).toLocaleString('zh-CN')}</Text>
            </div>
          </Space>
        </Space>
      </Card>

      {/* 统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="文档总数"
              value={detail.stats.totalDocuments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="向量总数"
              value={detail.stats.totalVectors}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#d946ef' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="查询总次数"
              value={detail.stats.totalQueries}
              valueStyle={{ color: '#06b6d4' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均文档长度"
              value={detail.stats.avgDocumentLength}
              suffix="字符"
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近查询时间 */}
      {detail.stats.lastQueryTime && (
        <Card title={<Space><ClockCircleOutlined />最近查询时间</Space>}>
          <Text>{new Date(detail.stats.lastQueryTime).toLocaleString('zh-CN')}</Text>
        </Card>
      )}

      {/* 热门标签 */}
      <Card title="热门标签 Top 5">
        <List
          dataSource={detail.stats.topTags}
          renderItem={(item) => (
            <List.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                  {item.tag}
                </Tag>
                <Text strong>{item.count} 个文档</Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
