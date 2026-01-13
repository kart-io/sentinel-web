import { Transfer as AntTransfer } from 'antd';

interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

interface TransferProps {
  dataSource: TransferItem[];
  targetKeys: string[];
  onChange: (targetKeys: string[]) => void;
  titles?: [string, string];
  showSearch?: boolean;
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  render?: (item: TransferItem) => any;
  className?: string;
  style?: React.CSSProperties;
}

export function Transfer({
  dataSource,
  targetKeys,
  onChange,
  titles = ['源列表', '目标列表'],
  showSearch = true,
  filterOption,
  render,
  className,
  style,
}: TransferProps) {
  return (
    <div className={className} style={style}>
      <AntTransfer
        dataSource={dataSource}
        targetKeys={targetKeys}
        onChange={(keys) => onChange(keys as string[])}
        titles={titles}
        showSearch={showSearch}
        filterOption={(inputValue, item: any) => {
          if (filterOption) {
            return filterOption(inputValue, item as TransferItem);
          }
          return item.title.toLowerCase().includes(inputValue.toLowerCase());
        }}
        render={(item) => {
          if (render) {
            return render(item as TransferItem);
          }

          const transferItem = item as TransferItem;
          return (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {transferItem.title}
              </div>
              {transferItem.description && (
                <div className="text-sm text-gray-500 truncate">
                  {transferItem.description}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
