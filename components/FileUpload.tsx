import { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (content: string, filename: string) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDocxFile = useCallback(async (file: File): Promise<string> => {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      let content = '';
      if (file.name.endsWith('.docx')) {
        content = await handleDocxFile(file);
      } else {
        const reader = new FileReader();
        content = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsText(file, 'UTF-8');
        });
      }
      onFileSelect(content, file.name);
    } catch (error) {
      console.error('Failed to read file:', error);
      alert('文件读取失败，请尝试其他文件');
    } finally {
      setIsLoading(false);
    }
  }, [handleDocxFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('text') || file.name.endsWith('.docx'))) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
        isDragging
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">正在解析文件...</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">拖拽小说文件到此处</p>
          <p className="text-sm text-gray-500 mb-4">或点击下方按钮选择文件</p>
          <label className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            选择文件
            <input
              type="file"
              accept=".txt,.md,.docx"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-4">支持 .txt、.md 和 .docx 格式，建议包含 3 个章节以上</p>
        </>
      )}
    </div>
  );
}
