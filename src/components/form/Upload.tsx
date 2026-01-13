import { Upload as AntUpload, Button, Progress, Space, Image, message } from 'antd';
import type { UploadProps as AntUploadProps, UploadFile } from 'antd';
import { UploadCloud, File, X, Download } from 'lucide-react';
import { useState } from 'react';

interface UploadFileExtended extends UploadFile {
  url?: string;
}

interface UploadProps extends Omit<AntUploadProps, 'fileList' | 'onChange'> {
  value?: UploadFileExtended[];
  onChange?: (files: UploadFileExtended[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  listType?: 'text' | 'picture' | 'picture-card';
  showUploadList?: boolean;
  uploadText?: string;
  customRequest?: (options: any) => void;
  onPreview?: (file: UploadFileExtended) => void;
  onDownload?: (file: UploadFileExtended) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Upload({
  value,
  onChange,
  accept,
  maxSize = 10,
  multiple = false,
  listType = 'picture-card',
  showUploadList = true,
  uploadText = '点击或拖拽上传',
  customRequest,
  onPreview,
  onDownload,
  className,
  style,
  ...props
}: UploadProps) {
  const [fileList, setFileList] = useState<UploadFileExtended[]>(value || []);

  const beforeUpload = (file: File) => {
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;

    if (!isLtMaxSize) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }

    const isAccepted = accept ? accept.split(',').some((type) => {
      const fileType = file.type || file.name.split('.').pop();
      return type.trim().includes(fileType || '');
    }) : true;

    if (!isAccepted) {
      message.error(`不支持的文件类型`);
      return false;
    }

    return true;
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    const updatedFiles: UploadFileExtended[] = newFileList.map((file: any) => ({
      ...file,
      url: file.url || file.response?.url || file.thumbUrl,
    }));

    setFileList(updatedFiles);
    onChange?.(updatedFiles);
  };

  const handleRemove = (file: UploadFileExtended) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    onChange?.(newFileList);
  };

  const handlePreview = async (file: UploadFileExtended) => {
    if (file.url) {
      onPreview?.(file);
    } else if (file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onPreview?.({ ...file, url: preview });
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const renderUploadButton = () => {
    if (listType === 'picture-card') {
      return (
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 hover:border-violet-500 rounded-lg transition-colors cursor-pointer">
          <UploadCloud size={32} className="text-violet-500 mb-2" />
          <div className="text-sm text-gray-600">{uploadText}</div>
        </div>
      );
    }

    return (
      <Button
        icon={<UploadCloud size={16} />}
        type="primary"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
          border: 'none',
        }}
      >
        {uploadText}
      </Button>
    );
  };

  const renderFileItem = (file: UploadFileExtended) => {
    const isImage = file.type?.startsWith('image/');

    if (listType === 'picture-card') {
      return (
        <div className="relative group">
          {isImage && file.url ? (
            <Image src={file.url} alt={file.name} width={100} height={100} className="object-cover rounded" />
          ) : (
            <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded">
              <File size={32} className="text-gray-400" />
            </div>
          )}

          {file.status === 'uploading' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
              <Progress percent={file.percent || 0} strokeColor="#8b5cf6" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(file);
              }}
              className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <File size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(file);
              }}
              className="p-2 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isImage && file.url ? (
            <Image src={file.url} alt={file.name} width={48} height={48} className="object-cover rounded" />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
              <File size={20} className="text-gray-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </div>
            <div className="text-xs text-gray-500">
              {file.size ? `${(file.size / 1024).toFixed(2)} KB` : ''}
              {file.status === 'uploading' && ` - ${file.percent || 0}%`}
            </div>
          </div>

          {file.status === 'uploading' && (
            <Progress percent={file.percent || 0} size="small" strokeColor="#8b5cf6" />
          )}
        </div>

        <Space>
          {file.url && (
            <button
              type="button"
              onClick={() => onDownload?.(file)}
              className="p-2 text-gray-400 hover:text-violet-500 transition-colors"
            >
              <Download size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleRemove(file)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </Space>
      </div>
    );
  };

  return (
    <div className={className} style={style}>
      {showUploadList && fileList.length > 0 && listType !== 'picture-card' && (
        <div className="mb-4">
          {fileList.map((file) => (
            <div key={file.uid}>{renderFileItem(file)}</div>
          ))}
        </div>
      )}

      <AntUpload
        {...props}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        customRequest={customRequest}
        multiple={multiple}
        listType={listType}
        showUploadList={false}
      >
        {(!multiple || fileList.length === 0) && renderUploadButton()}
      </AntUpload>

      {showUploadList && listType === 'picture-card' && fileList.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {fileList.map((file) => (
            <div key={file.uid}>{renderFileItem(file)}</div>
          ))}
        </div>
      )}

      {accept && (
        <div className="mt-2 text-xs text-gray-500">
          支持的文件类型: {accept}
          {maxSize && ` | 最大文件大小: ${maxSize}MB`}
        </div>
      )}
    </div>
  );
}
