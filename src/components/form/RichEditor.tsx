import { Input } from 'antd';
import { useState } from 'react';
import { Bold, Italic, Underline, List, Code, Link, Image, Eye, Edit } from 'lucide-react';

const { TextArea } = Input;

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  mode?: 'edit' | 'preview' | 'live';
  hideToolbar?: boolean;
  toolbar?: React.ReactNode;
  showWordCount?: boolean;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function RichEditor({
  value,
  onChange,
  placeholder = '开始输入...',
  height = 300,
  mode = 'edit',
  hideToolbar = false,
  toolbar,
  showWordCount = true,
  maxLength,
  className,
  style,
}: RichEditorProps) {
  const [internalMode, setInternalMode] = useState<'edit' | 'preview'>(mode === 'preview' ? 'preview' : 'edit');

  const currentMode = mode === 'live' ? 'live' : internalMode;

  const handleFormat = (format: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || '粗体文本'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || '斜体文本'}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText || '下划线文本'}</u>`;
        break;
      case 'code':
        formattedText = `\`${selectedText || '代码'}\``;
        break;
      case 'link':
        formattedText = `[${selectedText || '链接文本'}](url)`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || '列表项'}`;
        break;
      case 'image':
        formattedText = `
![图片描述](image_url)
`;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;
    }, 0);
  };

  const wordCount = value.length;
  const charCount = value.replace(/\s/g, '').length;

  const defaultToolbar = (
    <div className="flex items-center gap-2 pb-3 border-b mb-3">
      <button
        type="button"
        onClick={() => handleFormat('bold')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="粗体"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleFormat('italic')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="斜体"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleFormat('underline')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="下划线"
      >
        <Underline size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => handleFormat('list')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="列表"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleFormat('code')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="代码"
      >
        <Code size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleFormat('link')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="链接"
      >
        <Link size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleFormat('image')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="图片"
      >
        <Image size={18} />
      </button>
    </div>
  );

  const renderPreview = () => {
    const lines = value.split('\n');

    return (
      <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
        {lines.map((line, index) => {
          if (!line.trim()) return <br key={index} />;

          let formatted = line;

          formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
          formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
          formatted = formatted.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
          formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank">$1</a>');
          formatted = formatted.replace(/^-(.*)/g, '<li class="ml-4">$1</li>');
          formatted = formatted.replace(/^!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />');
          formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
          formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
          formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className || ''}`} style={style}>
      {!hideToolbar && (
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            {mode !== 'live' && (
              <button
                type="button"
                onClick={() => setInternalMode('edit')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors ${
                  currentMode === 'edit' ? 'bg-violet-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                <Edit size={16} />
                <span>编辑</span>
              </button>
            )}
            {mode !== 'live' && (
              <button
                type="button"
                onClick={() => setInternalMode('preview')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors ${
                  currentMode === 'preview' ? 'bg-violet-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                <Eye size={16} />
                <span>预览</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ height }}>
        {(currentMode === 'edit' || mode === 'live') && (
          <div style={{ display: mode === 'live' ? 'block' : 'none' }}>
            {!hideToolbar && <div>{toolbar || defaultToolbar}</div>}
            <TextArea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              autoSize={{ minRows: 10 }}
              style={{
                border: 'none',
                resize: 'none',
                height: height - 80,
              }}
              maxLength={maxLength}
            />
          </div>
        )}

        {(currentMode === 'preview' || mode === 'live') && (
          <div
            style={{
              display: mode === 'live' ? 'block' : 'none',
              height: height - 60,
              overflowY: 'auto',
              padding: '16px',
            }}
          >
            {renderPreview()}
          </div>
        )}
      </div>

      {showWordCount && (
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-t text-xs text-gray-500">
          <span>{wordCount} 字</span>
          <span>{charCount} 字符</span>
          {maxLength && (
            <span>
              {wordCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
