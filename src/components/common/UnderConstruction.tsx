import React from 'react';
import { Card, Empty, Button } from 'antd';
import { Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnderConstructionProps {
  title: string;
  description?: string;
}

/**
 * 功能开发中占位页面
 */
export const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title,
  description = '该功能正在开发中，敬请期待...'
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center shadow-lg">
        <Empty
          image={<Construction size={64} className="mx-auto text-primary opacity-60" />}
          imageStyle={{ height: 80 }}
          description={
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
          }
        >
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回首页
          </Button>
        </Empty>
      </Card>
    </div>
  );
};
