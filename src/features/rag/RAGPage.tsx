import { useState, useEffect, useCallback } from 'react';
import { Tabs, App } from 'antd';
import { DatabaseOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import RAGQuery from './RAGQuery';
import KnowledgeBaseManager from './KnowledgeBaseManager';
import DocumentManager from './DocumentManager';
import { ragService } from '@/services/ragService';
import type { KnowledgeBase } from '@/types/rag';

export default function RAGPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const { message } = App.useApp();

  const fetchKnowledgeBases = useCallback(async () => {
    try {
      const kbs = await ragService.getKnowledgeBases();
      setKnowledgeBases(kbs);
    } catch (error) {
      message.error('获取知识库列表失败');
      console.error('Fetch error:', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchKnowledgeBases();
  }, [fetchKnowledgeBases]);

  const items = [
    {
      key: 'query',
      label: (
        <span>
          <SearchOutlined />
          智能问答
        </span>
      ),
      children: <RAGQuery knowledgeBases={knowledgeBases} />,
    },
    {
      key: 'knowledge-base',
      label: (
        <span>
          <DatabaseOutlined />
          知识库管理
        </span>
      ),
      children: (
        <KnowledgeBaseManager
          knowledgeBases={knowledgeBases}
          onUpdate={fetchKnowledgeBases}
        />
      ),
    },
    {
      key: 'documents',
      label: (
        <span>
          <FileTextOutlined />
          文档管理
        </span>
      ),
      children: <DocumentManager knowledgeBases={knowledgeBases} />,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RAG 知识问答</h1>
        <p className="text-gray-600">
          基于检索增强生成（RAG）技术，为您提供准确、可靠的知识问答服务
        </p>
      </div>

      <Tabs defaultActiveKey="query" items={items} size="large" />
    </div>
  );
}
