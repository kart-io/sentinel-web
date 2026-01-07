export interface Document {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  status?: 'processing' | 'completed' | 'failed';
  vectorized?: boolean;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QueryRequest {
  query: string;
  knowledgeBaseId: string;
  topK?: number;
  temperature?: number;
}

export interface QueryResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
}

export interface SearchResult {
  documentId: string;
  title: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface UploadDocumentRequest {
  knowledgeBaseId: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface CreateKnowledgeBaseRequest {
  name: string;
  description: string;
}

export interface KnowledgeBaseStats {
  totalDocuments: number;
  totalVectors: number;
  avgDocumentLength: number;
  lastQueryTime?: string;
  totalQueries: number;
  topTags: Array<{ tag: string; count: number }>;
}

export interface KnowledgeBaseDetail extends KnowledgeBase {
  stats: KnowledgeBaseStats;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  metadata?: Record<string, unknown>;
}

export interface BatchUploadRequest {
  knowledgeBaseId: string;
  documents: Array<{
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
  }>;
}
