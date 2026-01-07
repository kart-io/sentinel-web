import { getEnvConfig } from '@/config/env';
import type {
  KnowledgeBase,
  Document,
  QueryRequest,
  QueryResponse,
  CreateKnowledgeBaseRequest,
  UploadDocumentRequest,
  KnowledgeBaseDetail,
  UpdateDocumentRequest,
  BatchUploadRequest,
} from '@/types/rag';

const config = getEnvConfig();
const API_BASE_URL = config.apiBaseUrl;

// Mock data for development
const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: '1',
    name: 'DevOps 最佳实践',
    description: 'DevOps 工作流程、CI/CD、容器化等最佳实践文档',
    documentCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '2',
    name: 'AI/ML 知识库',
    description: '机器学习、深度学习、模型训练相关文档',
    documentCount: 23,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Docker 容器化最佳实践',
    content: 'Docker 是一个开源的容器化平台...',
    metadata: { tags: ['docker', 'container'] },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Kubernetes 部署指南',
    content: 'Kubernetes 是一个开源的容器编排系统...',
    metadata: { tags: ['kubernetes', 'orchestration'] },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

export const ragService = {
  // 获取所有知识库
  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockKnowledgeBases;
    }

    const response = await fetch(`${API_BASE_URL}/rag/knowledge-bases`);
    if (!response.ok) throw new Error('Failed to fetch knowledge bases');
    return response.json();
  },

  // 创建知识库
  async createKnowledgeBase(data: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newKB: KnowledgeBase = {
        id: String(mockKnowledgeBases.length + 1),
        name: data.name,
        description: data.description,
        documentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockKnowledgeBases.push(newKB);
      return newKB;
    }

    const response = await fetch(`${API_BASE_URL}/rag/knowledge-bases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create knowledge base');
    return response.json();
  },

  // 删除知识库
  async deleteKnowledgeBase(id: string): Promise<void> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = mockKnowledgeBases.findIndex((kb) => kb.id === id);
      if (index > -1) {
        mockKnowledgeBases.splice(index, 1);
      }
      return;
    }

    const response = await fetch(`${API_BASE_URL}/rag/knowledge-bases/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete knowledge base');
  },

  // 获取知识库中的文档
  async getDocuments(knowledgeBaseId: string): Promise<Document[]> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDocuments;
    }

    const response = await fetch(`${API_BASE_URL}/rag/knowledge-bases/${knowledgeBaseId}/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  // 上传文档
  async uploadDocument(data: UploadDocumentRequest): Promise<Document> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newDoc: Document = {
        id: String(mockDocuments.length + 1),
        title: data.title,
        content: data.content,
        metadata: data.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDocuments.push(newDoc);
      return newDoc;
    }

    const response = await fetch(`${API_BASE_URL}/rag/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  },

  // 删除文档
  async deleteDocument(documentId: string): Promise<void> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = mockDocuments.findIndex((doc) => doc.id === documentId);
      if (index > -1) {
        mockDocuments.splice(index, 1);
      }
      return;
    }

    const response = await fetch(`${API_BASE_URL}/rag/documents/${documentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete document');
  },

  // RAG 查询
  async query(data: QueryRequest): Promise<QueryResponse> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response
      return {
        answer: `基于您的问题"${data.query}"，我找到了以下相关信息：\n\nDocker 是一个开源的容器化平台，它允许开发者将应用程序及其依赖打包到一个轻量级、可移植的容器中。使用 Docker 的最佳实践包括：\n\n1. 使用官方镜像作为基础镜像\n2. 最小化层数，合并 RUN 命令\n3. 使用 .dockerignore 文件\n4. 不要在容器中存储数据\n5. 使用多阶段构建减小镜像大小\n\n这些实践可以帮助您更好地使用 Docker 容器化技术。`,
        sources: [
          {
            documentId: '1',
            title: 'Docker 容器化最佳实践',
            content: 'Docker 是一个开源的容器化平台，它允许开发者将应用程序及其依赖打包到一个轻量级、可移植的容器中...',
            score: 0.95,
            metadata: { tags: ['docker', 'container'] },
          },
          {
            documentId: '2',
            title: 'Kubernetes 部署指南',
            content: 'Kubernetes 可以很好地与 Docker 容器配合使用...',
            score: 0.73,
            metadata: { tags: ['kubernetes', 'orchestration'] },
          },
        ],
        confidence: 0.89,
      };
    }

    const response = await fetch(`${API_BASE_URL}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to query RAG');
    return response.json();
  },

  // 获取知识库详情
  async getKnowledgeBaseDetail(id: string): Promise<KnowledgeBaseDetail> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const kb = mockKnowledgeBases.find((k) => k.id === id);
      if (!kb) throw new Error('Knowledge base not found');

      return {
        ...kb,
        stats: {
          totalDocuments: kb.documentCount,
          totalVectors: kb.documentCount * 128, // Mock: 假设每个文档128个向量
          avgDocumentLength: 1024,
          lastQueryTime: new Date().toISOString(),
          totalQueries: 156,
          topTags: [
            { tag: 'docker', count: 12 },
            { tag: 'kubernetes', count: 10 },
            { tag: 'ci/cd', count: 8 },
            { tag: 'monitoring', count: 6 },
            { tag: 'cloud', count: 5 },
          ],
        },
      };
    }

    const response = await fetch(`${API_BASE_URL}/rag/knowledge-bases/${id}/detail`);
    if (!response.ok) throw new Error('Failed to fetch knowledge base detail');
    return response.json();
  },

  // 更新文档
  async updateDocument(documentId: string, data: UpdateDocumentRequest): Promise<Document> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const doc = mockDocuments.find((d) => d.id === documentId);
      if (!doc) throw new Error('Document not found');

      const updatedDoc = {
        ...doc,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const index = mockDocuments.findIndex((d) => d.id === documentId);
      mockDocuments[index] = updatedDoc;
      return updatedDoc;
    }

    const response = await fetch(`${API_BASE_URL}/rag/documents/${documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update document');
    return response.json();
  },

  // 批量上传文档
  async batchUploadDocuments(data: BatchUploadRequest): Promise<Document[]> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newDocs = data.documents.map((doc, index) => ({
        id: String(mockDocuments.length + index + 1),
        title: doc.title,
        content: doc.content,
        metadata: doc.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'completed' as const,
        vectorized: true,
      }));

      mockDocuments.push(...newDocs);
      return newDocs;
    }

    const response = await fetch(`${API_BASE_URL}/rag/documents/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to batch upload documents');
    return response.json();
  },

  // 获取单个文档详情
  async getDocument(documentId: string): Promise<Document> {
    if (config.enableMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const doc = mockDocuments.find((d) => d.id === documentId);
      if (!doc) throw new Error('Document not found');
      return doc;
    }

    const response = await fetch(`${API_BASE_URL}/rag/documents/${documentId}`);
    if (!response.ok) throw new Error('Failed to fetch document');
    return response.json();
  },
};
