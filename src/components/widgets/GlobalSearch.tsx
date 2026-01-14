import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, List, Typography, Tag, Spin } from 'antd';
import { Search, FileText, Settings, Database, Users, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  type: 'menu' | 'page' | 'action';
  title: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

// 模拟搜索数据
const searchData: SearchResult[] = [
  { type: 'menu', title: '仪表板', path: '/dashboard', icon: <LayoutDashboard size={16} />, description: '系统概览' },
  { type: 'menu', title: 'RAG 知识库', path: '/rag', icon: <Database size={16} />, description: '知识问答系统' },
  { type: 'menu', title: '用户中心', path: '/user-center', icon: <Users size={16} />, description: '用户管理' },
  { type: 'menu', title: '系统设置', path: '/settings', icon: <Settings size={16} />, description: '系统配置' },
  { type: 'page', title: '组件演示', path: '/mui-demo', icon: <FileText size={16} />, description: 'UI组件展示' },
];

/**
 * 全局搜索组件
 */
const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<any>(null);
  const navigate = useNavigate();

  // 搜索逻辑
  useEffect(() => {
    if (!keyword.trim()) {
      setResults(searchData.slice(0, 5)); // 显示热门结果
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.description?.toLowerCase().includes(keyword.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [keyword]);

  // 打开时聚焦
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 处理选择
  const handleSelect = (item: SearchResult) => {
    navigate(item.path);
    onClose();
    setKeyword('');
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={600}
      className="global-search-modal"
      styles={{
        body: { padding: 0 },
        mask: { backdropFilter: 'blur(4px)' },
      }}
    >
      <div className="p-4" onKeyDown={handleKeyDown}>
        {/* 搜索输入框 */}
        <Input
          ref={inputRef}
          size="large"
          placeholder="搜索菜单、页面..."
          prefix={<Search size={18} className="text-gray-400" />}
          suffix={
            <Tag className="text-xs">ESC 关闭</Tag>
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="rounded-lg"
          allowClear
        />

        {/* 搜索结果 */}
        <div className="mt-4 max-h-[400px] overflow-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin />
            </div>
          ) : results.length > 0 ? (
            <List
              dataSource={results}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3 transition-colors"
                  onClick={() => handleSelect(item)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <Typography.Text strong className="dark:text-gray-200">
                        {item.title}
                      </Typography.Text>
                      {item.description && (
                        <Typography.Text type="secondary" className="text-xs block">
                          {item.description}
                        </Typography.Text>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              未找到相关结果
            </div>
          )}
        </div>

        {/* 快捷键提示 */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded ml-1">↓</kbd>
              <span className="ml-2">导航</span>
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd>
              <span className="ml-2">选择</span>
            </span>
          </div>
          <span>Powered by Sentinel</span>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSearch;
