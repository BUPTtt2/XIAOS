'use client';

import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import ScriptEditor from '@/components/Editor/ScriptEditor';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useState, useEffect, useCallback } from 'react';
import type { Script } from '@/lib/types';
import yaml from 'js-yaml';
import { useToast } from '@/components/Toast';
import { saveDraft, getDraft, deleteDraft } from '@/lib/storage';

type Status = 'idle' | 'uploaded' | 'converting' | 'editing';

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [selectedFile, setSelectedFile] = useState<{ content: string; filename: string } | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { addToast } = useToast();

  // 检查是否有保存的草稿
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user'));
    
    const draft = getDraft();
    if (draft) {
      const shouldRestore = confirm('发现未保存的剧本草稿，是否恢复？');
      if (shouldRestore) {
        setScript(draft.script);
        setSelectedFile({ content: draft.fileContent, filename: draft.fileName });
        setStatus('editing');
        addToast('已恢复上次的剧本草稿', 'info');
      } else {
        deleteDraft();
      }
    }
  }, []);

  // 自动保存草稿
  const handleScriptUpdate = useCallback((updatedScript: Script) => {
    setScript(updatedScript);
    
    // 如果有文件内容和剧本，自动保存草稿
    if (selectedFile && updatedScript) {
      saveDraft({
        script: updatedScript,
        fileContent: selectedFile.content,
        fileName: selectedFile.filename,
        savedAt: new Date().toISOString(),
      });
    }
  }, [selectedFile]);

  // 当剧本更新时自动保存
  useEffect(() => {
    if (script && selectedFile && status === 'editing') {
      saveDraft({
        script,
        fileContent: selectedFile.content,
        fileName: selectedFile.filename,
        savedAt: new Date().toISOString(),
      });
    }
  }, [script, selectedFile, status]);

  const handleFileSelect = (content: string, filename: string) => {
    setSelectedFile({ content, filename });
    setStatus('uploaded');
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    
    setStatus('converting');
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: selectedFile.content }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setScript(result.script);
        setStatus('editing');
        if (result.isMock) {
          addToast(result.error || '当前使用示例数据，AI API调用失败', 'warning');
        } else {
          addToast('剧本转换成功！', 'success');
        }
      } else {
        addToast(result.error || '转换失败', 'error');
        setStatus('uploaded');
      }
    } catch (error) {
      console.error('Convert error:', error);
      addToast('网络错误，请稍后重试', 'error');
      setStatus('uploaded');
    }
  };

  const handleDownload = () => {
    if (!script) return;
    
    const yamlContent = yaml.dump(script, { indent: 2 });
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.meta.title || '剧本'}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!script || !isLoggedIn) return;
    
    setSaveStatus('saving');
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, userId: user.id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 成功保存到数据库后，删除本地草稿
        deleteDraft();
        setSaveStatus('saved');
        addToast('剧本保存成功！', 'success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        addToast(result.error || '保存失败', 'error');
        setSaveStatus('idle');
      }
    } catch (error) {
      console.error('Save error:', error);
      addToast('网络错误，请稍后重试', 'error');
      setSaveStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {status === 'editing' && script && (
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">剧本编辑器</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setStatus('uploaded')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                返回上传
              </button>
              {isLoggedIn ? (
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`px-4 py-2 rounded-lg hover:opacity-80 transition-colors flex items-center gap-2 ${
                    saveStatus === 'saved'
                      ? 'bg-green-600 text-white'
                      : saveStatus === 'saving'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {saveStatus === 'saved' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      已保存
                    </>
                  ) : saveStatus === 'saving' ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      保存中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      保存剧本
                    </>
                  )}
                </button>
              ) : (
                <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg">
                  <a href="/login" className="text-blue-600 hover:underline">登录</a> 后保存
                </span>
              )}
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载 YAML
              </button>
            </div>
          </div>
        )}

        {status !== 'editing' && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              将小说转换为精彩剧本
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              使用 AI 技术自动分析您的小说内容，快速生成结构化剧本初稿，让您专注于创作本身
            </p>
          </div>
        )}

        {status === 'editing' && script ? (
          <ScriptEditor script={script} onUpdate={handleScriptUpdate} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  上传小说文件
                </h2>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>

              {selectedFile && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    {status === 'converting' ? (
                      <>
                        <LoadingSpinner size="md" />
                        正在转换...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        文件上传成功
                      </>
                    )}
                  </h2>
                  
                  {status === 'converting' && (
                    <div className="text-center py-8">
                      <LoadingSpinner size="xl" />
                      <p className="mt-4 text-gray-600">AI 正在分析您的小说内容，请稍候...</p>
                    </div>
                  )}
                  
                  {status !== 'converting' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">文件名: {selectedFile.filename}</p>
                      <p className="text-sm text-gray-500">字符数: {selectedFile.content.length}</p>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={handleConvert}
                          disabled={status === 'converting'}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          开始转换
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setStatus('idle');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          重新选择
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!selectedFile && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">剧本预览区域</h2>
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p>上传小说文件后，剧本将在这里显示</p>
                </div>
              </div>
            )}
          </div>
        )}

        {status !== 'editing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">智能分析</h3>
              <p className="text-sm text-gray-600">AI 自动识别章节、人物和情节</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">结构化输出</h3>
              <p className="text-sm text-gray-600">生成标准 YAML 格式剧本</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">高效创作</h3>
              <p className="text-sm text-gray-600">大幅降低剧本改编门槛</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
