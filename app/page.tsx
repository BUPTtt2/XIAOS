export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          AI 剧本创作工具
        </h1>
        <p className="text-gray-600 mb-6">
          将小说转换为结构化剧本，支持可视化编辑和 YAML 导出
        </p>
        <div className="space-y-3 text-sm text-left bg-gray-50 p-4 rounded-lg">
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span> 项目已初始化
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span> YAML Schema 已定义
          </p>
          <p className="flex items-center gap-2">
            <span className="text-yellow-500">•</span> 后续功能开发中...
          </p>
        </div>
      </div>
    </div>
  );
}
