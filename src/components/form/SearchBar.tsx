import { Input, Button } from 'antd';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * SearchBar Props 接口
 */
export interface SearchBarProps {
  /**
   * 搜索关键词
   */
  value?: string;

  /**
   * 搜索回调
   */
  onSearch?: (value: string) => void;

  /**
   * 输入变化回调
   */
  onChange?: (value: string) => void;

  /**
   * 占位符文本
   * @default '搜索...'
   */
  placeholder?: string;

  /**
   * 是否支持高级搜索
   * @default false
   */
  allowAdvanced?: boolean;

  /**
   * 高级搜索面板内容
   */
  advancedContent?: ReactNode;

  /**
   * 是否默认展开高级搜索
   * @default false
   */
  defaultAdvanced?: boolean;

  /**
   * 搜索按钮文本
   * @default '搜索'
   */
  searchButtonText?: string;

  /**
   * 重置按钮文本
   * @default '重置'
   */
  resetButtonText?: string;

  /**
   * 是否显示重置按钮
   * @default true
   */
  showReset?: boolean;

  /**
   * 加载状态
   */
  loading?: boolean;

  /**
   * 输入框大小
   * @default 'middle'
   */
  size?: 'large' | 'middle' | 'small';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

/**
 * SearchBar 组件
 *
 * @description 搜索栏组件，支持基础搜索和高级搜索展开
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchValue}
 *   onSearch={handleSearch}
 *   allowAdvanced
 *   advancedContent={<AdvancedFilters />}
 * />
 * ```
 */
export function SearchBar({
  value: controlledValue,
  onSearch,
  onChange,
  placeholder = '搜索...',
  allowAdvanced = false,
  advancedContent,
  defaultAdvanced = false,
  searchButtonText = '搜索',
  resetButtonText = '重置',
  showReset = true,
  loading = false,
  size = 'middle',
  className,
  style,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(defaultAdvanced);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleSearch = () => {
    onSearch?.(currentValue);
  };

  const handleReset = () => {
    const newValue = '';
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
    onSearch?.(newValue);
  };

  return (
    <div className={`space-y-3 ${className || ''}`} style={style}>
      <div className="flex gap-2">
        <Input
          value={currentValue}
          onChange={(e) => {
            if (isControlled) {
              onChange?.(e.target.value);
            } else {
              setInternalValue(e.target.value);
            }
          }}
          onPressEnter={handleSearch}
          placeholder={placeholder}
          size={size}
          suffix={<Search size={16} className="text-gray-400" />}
          allowClear
        />
        <Button
          type="primary"
          onClick={handleSearch}
          loading={loading}
          size={size}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
            border: 'none',
          }}
        >
          {searchButtonText}
        </Button>
        {allowAdvanced && (
          <Button
            onClick={() => setIsAdvanced(!isAdvanced)}
            size={size}
            icon={isAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          >
            {isAdvanced ? '收起' : '高级'}
          </Button>
        )}
      </div>

      {allowAdvanced && isAdvanced && advancedContent && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          {advancedContent}
          {showReset && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleReset}>{resetButtonText}</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
