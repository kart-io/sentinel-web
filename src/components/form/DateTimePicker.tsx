import { DatePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { Calendar, X } from 'lucide-react';

interface ShortcutOption {
  label: string;
  value: dayjs.Dayjs;
}

interface DateTimePickerProps {
  value: dayjs.Dayjs | null;
  onChange: (date: dayjs.Dayjs | null) => void;
  showTime?: boolean;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  shortcuts?: ShortcutOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DateTimePicker({
  value,
  onChange,
  showTime = true,
  disabledDate,
  shortcuts,
  placeholder = '选择日期时间',
  label,
  className,
  style,
}: DateTimePickerProps) {
  const handleShortcut = (shortcut: ShortcutOption) => {
    onChange(shortcut.value);
  };

  const disabledDates = (date: dayjs.Dayjs) => {
    if (disabledDate) {
      return disabledDate(date);
    }
    return false;
  };

  return (
    <div className={className} style={style}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        {shortcuts && shortcuts.length > 0 && (
          <Space size="small">
            {shortcuts.map((shortcut, index) => (
              <Button
                key={index}
                size="small"
                type="text"
                onClick={() => handleShortcut(shortcut)}
                className="text-gray-600 hover:text-violet-600"
              >
                {shortcut.label}
              </Button>
            ))}
          </Space>
        )}

        <DatePicker
          value={value}
          onChange={onChange}
          showTime={showTime}
          format={showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
          disabledDate={disabledDates}
          placeholder={placeholder}
          style={{ width: '100%' }}
          suffixIcon={<Calendar size={16} className="text-gray-400" />}
          clearIcon={<X size={14} />}
        />
      </Space>
    </div>
  );
}

interface RangePickerProps {
  value: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
  onChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => void;
  showTime?: boolean;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  shortcuts?: DateRange[];
  placeholder?: [string, string];
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface DateRange {
  label: string;
  value: [dayjs.Dayjs, dayjs.Dayjs];
}

export function RangePicker({
  value,
  onChange,
  showTime = true,
  disabledDate,
  shortcuts,
  placeholder = ['开始日期', '结束日期'],
  label,
  className,
  style,
}: RangePickerProps) {
  const { RangePicker: AntRangePicker } = DatePicker;

  const handleRangeShortcut = (shortcut: DateRange) => {
    onChange(shortcut.value);
  };

  const disabledDates = (date: dayjs.Dayjs) => {
    if (disabledDate) {
      return disabledDate(date);
    }
    return false;
  };

  return (
    <div className={className} style={style}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        {shortcuts && shortcuts.length > 0 && (
          <Space size="small">
            {shortcuts.map((shortcut, index) => (
              <Button
                key={index}
                size="small"
                type="text"
                onClick={() => handleRangeShortcut(shortcut as DateRange)}
                className="text-gray-600 hover:text-violet-600"
              >
                {shortcut.label}
              </Button>
            ))}
          </Space>
        )}

        <AntRangePicker
          value={value}
          onChange={onChange}
          showTime={showTime}
          format={showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
          disabledDate={disabledDates}
          placeholder={placeholder}
          style={{ width: '100%' }}
          className="w-full"
          separator="~"
        />
      </Space>
    </div>
  );
}

export const DateRangeShortcuts: DateRange[] = [
  {
    label: '今天',
    value: [dayjs().startOf('day'), dayjs().endOf('day')],
  },
  {
    label: '昨天',
    value: [
      dayjs().subtract(1, 'day').startOf('day'),
      dayjs().subtract(1, 'day').endOf('day'),
    ],
  },
  {
    label: '最近7天',
    value: [dayjs().subtract(7, 'day'), dayjs()],
  },
  {
    label: '最近30天',
    value: [dayjs().subtract(30, 'day'), dayjs()],
  },
  {
    label: '最近90天',
    value: [dayjs().subtract(90, 'day'), dayjs()],
  },
  {
    label: '本周',
    value: [dayjs().startOf('week'), dayjs().endOf('week')],
  },
  {
    label: '上周',
    value: [
      dayjs().subtract(1, 'week').startOf('week'),
      dayjs().subtract(1, 'week').endOf('week'),
    ],
  },
  {
    label: '本月',
    value: [dayjs().startOf('month'), dayjs().endOf('month')],
  },
  {
    label: '上月',
    value: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
  },
  {
    label: '本年',
    value: [dayjs().startOf('year'), dayjs().endOf('year')],
  },
];
