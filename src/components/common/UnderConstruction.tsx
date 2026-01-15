import React from 'react';
import { Button } from 'antd';
import { Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageContainer, EmptyContainer } from './PageContainer';

interface UnderConstructionProps {
  title: string;
  description?: string;
}

/**
 * 功能开发中占位页面
 * 使用统一的 EmptyState 组件和容器，确保在页面底部居中显示
 */
export const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title,
  description = '该功能正在开发中，敬请期待...'
}) => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <EmptyContainer>
        <EmptyState
          title={title}
          description={description}
          icon={Construction}
          iconColor="text-primary"
          action={
            <Button type="primary" onClick={() => navigate('/dashboard')}>
              返回首页
            </Button>
          }
        />
      </EmptyContainer>
    </PageContainer>
  );
};
