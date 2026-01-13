import { Tag, Input, AutoComplete, Space, Popover } from 'antd';
import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export type TagColor =
  | 'default'
  | 'magenta'
  | 'red'
  | 'volcano'
  | 'orange'
  | 'gold'
  | 'lime'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'geekblue'
  | 'purple';

interface TagOption {
  label: string;
  value: string;
  color?: TagColor;
  icon?: ReactNode;
}

interface TagSelectProps {
  options: TagOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  mode?: 'single' | 'multiple';
  allowCustom?: boolean;
  searchable?: boolean;
  placeholder?: string;
  maxTags?: number;
  closable?: boolean;
  customColor?: TagColor;
  className?: string;
  style?: React.CSSProperties;
}

export function TagSelect({
  options,
  value,
  onChange,
  mode = 'multiple',
  allowCustom = false,
  searchable = false,
  placeholder = '选择或创建标签',
  maxTags,
  closable = true,
  customColor = 'blue',
  className,
  style,
}: TagSelectProps) {
  const [customTagInput, setCustomTagInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const isMultiple = mode === 'multiple';
  const selectedValues = isMultiple
    ? (value as string[]) || []
    : value
      ? [value as string]
      : [];

  const getTagOption = (val: string): TagOption | undefined => {
    return options.find((opt) => opt.value === val);
  };

  const handleDelete = (val: string) => {
    if (isMultiple) {
      const newValues = selectedValues.filter((v) => v !== val);
      onChange?.(newValues);
    } else {
      onChange?.('');
    }
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) {
      setShowCustomInput(false);
      return;
    }

    const newTagValue = customTagInput.trim();
    const existingOption = options.find((opt) => opt.label === newTagValue);

    let newValue = existingOption?.value;
    if (!newValue && allowCustom) {
      newValue = `custom_${Date.now()}`;
      const newOption: TagOption = {
        label: newTagValue,
        value: newValue,
        color: customColor,
      };
      options.push(newOption);
    }

    if (newValue) {
      if (isMultiple) {
        if (!selectedValues.includes(newValue) && (!maxTags || selectedValues.length < maxTags)) {
          onChange?.([...selectedValues, newValue]);
        }
      } else {
        onChange?.(newValue);
      }
    }

    setCustomTagInput('');
    setShowCustomInput(false);
  };

  const handleSearch = (searchText: string) => {
    if (isMultiple) {
      const matchedOption = options.find((opt) => opt.label === searchText);
      if (matchedOption && !selectedValues.includes(matchedOption.value)) {
        if (!maxTags || selectedValues.length < maxTags) {
          onChange?.([...selectedValues, matchedOption.value]);
        }
      } else if (allowCustom && searchText.trim()) {
        setCustomTagInput(searchText);
        setShowCustomInput(false);
      }
    }
  };

  const selectedTags = selectedValues.map((val) => {
    const option = getTagOption(val);
    const label = option?.label || val;
    const color = option?.color;

    return (
      <Tag
        key={val}
        color={color}
        closable={closable}
        onClose={(e) => {
          e.preventDefault();
          handleDelete(val);
        }}
        className="mb-2"
        icon={option?.icon}
      >
        {label}
      </Tag>
    );
  });

  const customInputPopover = (
    <div className="p-2 min-w-[200px]">
      <Input
        size="small"
        placeholder="输入标签名称"
        value={customTagInput}
        onChange={(e) => setCustomTagInput(e.target.value)}
        onPressEnter={handleAddCustomTag}
        autoFocus
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={() => {
            setCustomTagInput('');
            setShowCustomInput(false);
          }}
          className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleAddCustomTag}
          className="px-3 py-1 text-sm bg-violet-500 text-white rounded hover:bg-violet-600"
        >
          添加
        </button>
      </div>
    </div>
  );

  const searchOptions = options
    .filter((opt) => !selectedValues.includes(opt.value))
    .map((opt) => ({
      label: opt.label,
      value: opt.value,
    }));

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ''}`} style={style}>
      {selectedTags}

      {!isMultiple && selectedValues.length > 0
        ? null
        : searchable && (
            <AutoComplete
              options={searchOptions}
              onSearch={handleSearch}
              placeholder={selectedValues.length === 0 ? placeholder : ''}
              value=""
              style={{ minWidth: 150 }}
              size="small"
              allowClear
              filterOption={(inputValue, option) =>
                (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          )}

      {allowCustom && (!maxTags || selectedValues.length < maxTags) && (
        <Popover
          open={showCustomInput}
          onOpenChange={setShowCustomInput}
          content={customInputPopover}
          trigger="click"
          placement="bottomLeft"
        >
          <Tag
            className="cursor-pointer hover:bg-gray-100 transition-colors mb-2"
            style={{ borderStyle: 'dashed' }}
            onClick={() => {
              if (searchable) {
                setCustomTagInput('');
              }
            }}
          >
            <Space size={4}>
              <Plus size={14} />
              <span>{searchable ? '搜索或创建' : '新建标签'}</span>
            </Space>
          </Tag>
        </Popover>
      )}

      {!allowCustom && !searchable && (!maxTags || selectedValues.length < maxTags) && (
        <Tag
          className="cursor-pointer hover:bg-gray-100 transition-colors mb-2 text-gray-400"
        >
          <Space size={4}>
            <Plus size={14} />
            <span>添加标签</span>
          </Space>
        </Tag>
      )}
    </div>
  );
}
