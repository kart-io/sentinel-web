import { Input, Select, Button, Space, message } from 'antd';
import { Code2, Copy, Check, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const { TextArea } = Input;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark';
  height?: number;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  showRun?: boolean;
  onRun?: () => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'yaml', label: 'YAML' },
];

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'light',
  height = 400,
  readOnly = false,
  showLineNumbers = true,
  showCopy = true,
  showRun = false,
  onRun,
  placeholder = '输入代码...',
  className,
  style,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current && lineNumbersRef.current && showLineNumbers) {
      const lines = value.split('\n').length;
      lineNumbersRef.current.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
    }
  }, [value, showLineNumbers]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      message.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error('复制失败');
    }
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const spaces = '  ';

      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  interface HighlightPattern {
    pattern: RegExp;
    className: string;
  }

  const basicHighlight = (code: string, lang: string): string => {
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const patterns: Record<string, HighlightPattern[]> = {
      javascript: [
        { pattern: /(\/\/.*$)/gm, className: 'text-gray-500 italic' },
        { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'text-gray-500 italic' },
        { pattern: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|default|from|async|await|try|catch|finally|throw)\b/g, className: 'text-purple-600 font-bold' },
        { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600 font-bold' },
        { pattern: /(".*?"|'.*?'|`[^`]*`)/g, className: 'text-green-600' },
        { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-orange-600' },
      ],
      typescript: [
        { pattern: /(\/\/.*$)/gm, className: 'text-gray-500 italic' },
        { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'text-gray-500 italic' },
        { pattern: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|default|from|async|await|try|catch|finally|throw|interface|type|implements)\b/g, className: 'text-purple-600 font-bold' },
        { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600 font-bold' },
        { pattern: /(".*?"|'.*?'|`[^`]*`)/g, className: 'text-green-600' },
        { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-orange-600' },
      ],
      json: [
        { pattern: /(".*?"):/g, className: 'text-blue-600 font-bold' },
        { pattern: /(".*?")/g, className: 'text-green-600' },
        { pattern: /\b(true|false|null)\b/g, className: 'text-purple-600 font-bold' },
        { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-orange-600' },
      ],
      html: [
        { pattern: /(&lt;!--[\s\S]*?--&gt;)/g, className: 'text-gray-500 italic' },
        { pattern: /(&lt;\/?[\w-]+)/g, className: 'text-purple-600 font-bold' },
        { pattern: /\s([\w-]+)=/g, className: 'text-blue-600' },
        { pattern: /(".*?")/g, className: 'text-green-600' },
      ],
      css: [
        { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'text-gray-500 italic' },
        { pattern: /([.#]?[\w-]+)\s*\{/g, className: 'text-purple-600 font-bold' },
        { pattern: /([\w-]+)\s*:/g, className: 'text-blue-600' },
        { pattern: /:\s*([^;]+);/g, className: 'text-green-600' },
      ],
      python: [
        { pattern: /(#.*$)/gm, className: 'text-gray-500 italic' },
        { pattern: /\b(def|class|return|if|elif|else|for|while|try|except|finally|with|as|import|from|lambda|yield|global|nonlocal|assert|pass|break|continue|and|or|not|in|is|True|False|None)\b/g, className: 'text-purple-600 font-bold' },
        { pattern: /""".*?"""|'''.*?'''/g, className: 'text-green-600' },
        { pattern: /(".*?"|'.*?')/g, className: 'text-green-600' },
        { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-orange-600' },
      ],
      bash: [
        { pattern: /(#.*$)/gm, className: 'text-gray-500 italic' },
        { pattern: /\b(echo|cd|ls|pwd|mkdir|rm|cp|mv|cat|grep|find|sed|awk|tar|zip|unzip|chmod|chown|ps|kill|top|df|du|free|history|source|export|alias|if|then|else|fi|for|do|done|while|case|esac|function|return|exit|true|false)\b/g, className: 'text-purple-600 font-bold' },
        { pattern: /(".*?"|'.*?')/g, className: 'text-green-600' },
        { pattern: /\$[\w-]+/g, className: 'text-blue-600' },
      ],
    };

    const langPatterns = patterns[lang as keyof typeof patterns] || patterns.javascript;
    langPatterns.forEach(({ pattern, className }) => {
      highlighted = highlighted.replace(pattern, `<span class="${className}">$&</span>`);
    });

    return highlighted;
  };

  return (
    <div
      className={`rounded-lg overflow-hidden border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} ${className || ''}`}
      style={style}
    >
      <div className={`flex items-center justify-between px-4 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-b`}>
        <Space>
          <Code2 size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          <Select
            value={language}
            onChange={() => {}}
            style={{ width: 140 }}
            size="small"
            bordered={false}
          >
            {languages.map((lang) => (
              <Select.Option key={lang.value} value={lang.value}>
                {lang.label}
              </Select.Option>
            ))}
          </Select>
        </Space>

        <Space>
          {showRun && onRun && (
            <Button
              type="primary"
              size="small"
              icon={<Play size={14} />}
              onClick={onRun}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                border: 'none',
              }}
            >
              运行
            </Button>
          )}

          {showCopy && !readOnly && (
            <Button
              type="text"
              size="small"
              icon={copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              onClick={handleCopy}
            >
              {copied ? '已复制' : '复制'}
            </Button>
          )}

          <Button
            type="text"
            size="small"
            icon={isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '展开' : '收起'}
          </Button>
        </Space>
      </div>

      {!isCollapsed && (
        <div className="relative" style={{ height }}>
          {showLineNumbers && (
            <div
              ref={lineNumbersRef}
              className={`absolute left-0 top-0 bottom-0 w-12 pr-2 text-right font-mono text-sm select-none overflow-hidden ${theme === 'dark' ? 'bg-gray-800 text-gray-500 border-r border-gray-700' : 'bg-gray-50 text-gray-400 border-r border-gray-200'}`}
              style={{ paddingTop: '8px', paddingBottom: '8px' }}
            />
          )}

          <div className={`font-mono text-sm ${showLineNumbers ? 'ml-12' : 'ml-4'}`} style={{ height: '100%' }}>
            {readOnly ? (
              <pre
                className={`whitespace-pre-wrap break-words ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
                style={{ paddingTop: '8px', paddingBottom: '8px', lineHeight: '1.5' }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: basicHighlight(value, language) }}
                />
              </pre>
            ) : (
              <TextArea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleTab}
                placeholder={placeholder}
                style={{
                  height: '100%',
                  resize: 'none',
                  border: 'none',
                  background: 'transparent',
                  color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
                spellCheck={false}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
