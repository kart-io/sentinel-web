import { Input, Space, Popover, Button } from 'antd';
import { Palette, X } from 'lucide-react';
import { useState } from 'react';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
  label?: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

const defaultPresetColors = [
  '#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#73d13d',
  '#52c41a', '#13c2c2', '#36cfc9', '#40a9ff', '#1890ff', '#096dd9',
  '#0050b3', '#2f54eb', '#722ed1', '#9254de', '#eb2f96', '#f759ab',
  '#f5222d', '#fa541c', '#fa8c16', '#faad14', '#fadb14', '#a0d911',
  '#52c41a', '#13c2c2', '#1890ff', '#722ed1', '#eb2f96',
  '#8c8c8c', '#595959', '#434343', '#000000', '#ffffff',
];

export function ColorPicker({
  value = '#1890ff',
  onChange,
  presetColors = defaultPresetColors,
  label,
  placeholder = '选择颜色',
  className,
  style,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    onChange?.(color);
  };

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      handleColorChange(color);
    }
    setCustomColor(color);
  };

  return (
    <div className={className} style={style}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <Space>
        <Popover
          open={open}
          onOpenChange={setOpen}
          content={
            <div className="p-4 min-w-[280px]">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: customColor }}
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={handleCustomColor}
                    placeholder={placeholder}
                    prefix="#"
                    style={{ width: 150 }}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">预设颜色</label>
                  <div className="grid grid-cols-9 gap-1">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 hover:shadow transition-all"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  关闭
                </button>
                <Button
                  type="primary"
                  size="small"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                    border: 'none',
                  }}
                  onClick={() => setOpen(false)}
                >
                  确定
                </Button>
              </div>
            </div>
          }
          trigger="click"
          placement="bottomLeft"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: customColor }}
            />
            <div
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:border-violet-500 cursor-pointer transition-colors"
              onClick={() => setOpen(true)}
            >
              <Palette size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">{placeholder}</span>
            </div>
          </div>
        </Popover>

        {value && (
          <Button
            type="text"
            size="small"
            icon={<X size={14} />}
            onClick={() => onChange?.('')}
            className="text-gray-400 hover:text-red-500"
          >
            清除
          </Button>
        )}
      </Space>
    </div>
  );
}

interface ColorSwatchProps {
  value: string;
  onChange: (color: string) => void;
  size?: 'small' | 'default' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export function ColorSwatch({
  value,
  onChange,
  size = 'default',
  className,
  style,
}: ColorSwatchProps) {
  const sizes = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-14 h-14',
  };

  return (
    <div
      className={`rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer hover:scale-105 hover:shadow-md transition-all ${sizes[size]} ${className || ''}`}
      style={{ backgroundColor: value, ...style }}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = value;
        input.click();
        input.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          onChange?.(target.value);
        };
      }}
    />
  );
}
