'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ScriptEditor from '@/components/Editor/ScriptEditor';
import type { Script } from '@/lib/types';

interface ScriptItem {
  id: string;
  title: string;
  createdAt: string;
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/login';
      return;
    }

    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`/api/scripts?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setScripts(result.scripts);
      } else {
        setError(result.error || '获取剧本列表失败');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectScript = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scripts/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setSelectedScript(result.script.content);
      } else {
        setError(result.error || '获取剧本失败');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScript = async (id: string) => {
    if (!confirm('确定要删除这个剧本吗？')) return;
    
    try {
      const response = await fetch(`/api/scripts?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setScripts(scripts.filter(s => s.id !== id));
        if (selectedScript && selectedScript.meta?.title === scripts.find(s => s.id === id)?.title) {
          setSelectedScript(null);
        }
      } else {
        setError(result.error || '删除失败');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    }
  };

  const handleUpdateScript = (updatedScript: Script) => {
    setSelectedScript(updatedScript);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">我的剧本</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建剧本
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">剧本列表</h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <p className="text-red-600 text-center py-8">{error}</p>
              ) : scripts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p>暂无保存的剧本</p>
                  <p className="text-sm">点击上方按钮创建新剧本</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {scripts.map(script => (
                    <div
                      key={script.id}
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedScript?.meta?.title === script.title
                          ? 'bg-purple-50 border border-purple-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSelectScript(script.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 truncate">{script.title}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(script.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScript(script.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedScript ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">{selectedScript.meta?.title}</h2>
                </div>
                <ScriptEditor script={selectedScript} onUpdate={handleUpdateScript} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-2">选择一个剧本</h3>
                <p className="text-gray-400">从左侧列表中选择一个剧本进行编辑</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
