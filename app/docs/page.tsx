'use client';

import Navbar from '@/components/Navbar';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">AI 剧本创作工具 - 使用文档</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              快速开始
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>注册并登录账户</li>
              <li>上传小说文件（支持 .txt、.md、.docx 格式）</li>
              <li>点击「开始转换」按钮</li>
              <li>AI 将自动分析小说并生成剧本</li>
              <li>在编辑器中修改打磨剧本</li>
              <li>下载 YAML 格式剧本文件</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              支持的文件格式
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li><strong>.txt</strong> - 纯文本文件</li>
              <li><strong>.md</strong> - Markdown 文件</li>
              <li><strong>.docx</strong> - Microsoft Word 文件</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              💡 建议上传包含至少 3 个章节的小说文本，以获得更好的转换效果。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              剧本元素说明
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">对话 (Dialogue)</h3>
                <p className="text-sm text-gray-600">人物之间的对话内容，支持情感音调标记</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">动作 (Action)</h3>
                <p className="text-sm text-gray-600">人物的动作描述</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">旁白 (Narration)</h3>
                <p className="text-sm text-gray-600">场景描述或情节说明</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">转换 (Transition)</h3>
                <p className="text-sm text-gray-600">场景之间的过渡描述</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              常见问题
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Q: 为什么转换后的剧本内容是示例数据？</h3>
                <p className="text-sm text-gray-600">A: 当 AI API 调用失败时，系统会自动生成示例剧本。请检查网络连接或稍后重试。</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Q: 如何保存我的剧本？</h3>
                <p className="text-sm text-gray-600">A: 登录后，点击「保存剧本」按钮，剧本将自动保存到您的账户中。</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Q: 可以导出哪些格式？</h3>
                <p className="text-sm text-gray-600">A: 目前支持导出 YAML 格式，后续将支持 PDF 和 Word 格式。</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
