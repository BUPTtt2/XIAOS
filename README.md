# AI 剧本创作工具

基于 AI 的小说转剧本全栈应用，让小说改编剧本变得简单高效。

***

## 🎬 项目演示

[点击这里观看演示视频]（【XIAOs—AI剧本创作工具-哔哩哔哩】 https://b23.tv/1t02p70）

***

## 📖 项目简介

AI 剧本创作工具是一个为小说作者和编剧打造的智能工具，能够自动将小说文本转换为结构化的剧本格式，支持可视化编辑，大大降低剧本创作的门槛。

### ✨ 核心价值

- **降低改编门槛** - 无需专业编剧知识，一键将小说转为剧本
- **提高创作效率** - AI 自动生成初稿，人工只需要打磨优化
- **结构化数据** - 统一的 YAML 格式，方便后续处理和导出

***

## 🚀 功能特性

### 📄 文件上传

- **多格式支持** - 支持 `.txt`、`.md`、`.docx` 格式文件
- **拖拽上传** - 便捷的拖拽操作
- **文件预览** - 上传前可预览小说内容

### 🤖 AI 转换

- **DeepSeek-V4-Flash** - 使用 ModelScope 的 DeepSeek 模型进行智能转换
- **优雅降级** - API 调用失败时自动使用智能 mock 数据，确保应用可用
- **结构化输出** - 输出符合规范的 YAML 格式剧本
- **错误处理** - 详细的错误日志和提示信息

### ✏️ 可视化编辑

- **场景管理** - 添加、删除、编辑场景
- **剧本元素** - 支持对话、动作、旁白、场景转换四种元素
- **角色管理** - 设置角色和情感音调
- **实时预览** - 同步显示 YAML 源代码
- **拖拽排序** - 使用 @dnd-kit 实现场景拖拽重新排序
- **场景复制** - 一键复制场景及其所有元素
- **元素复制** - 复制单个剧本元素
- **批量操作** - 支持批量选择和删除多个剧本元素

### 💾 数据持久化

- **用户系统** - 注册、登录、个人信息管理
- **剧本保存** - 保存到数据库，随时可以继续编辑
- **历史记录** - 查看和管理已保存的所有剧本
- **本地草稿** - 自动保存本地草稿，刷新页面不丢失编辑内容
- **智能 Mock** - 基于小说内容智能生成示例数据

### 🎨 用户体验

- **加载动画** - 优雅的加载状态提示
- **Toast 通知** - 操作成功/失败的即时反馈
- **确认对话框** - 重要操作二次确认
- **响应式设计** - 适配各种屏幕尺寸

### 📥 导出功能

- **YAML 导出** - 下载标准 YAML 格式剧本
- **本地预览** - 在浏览器中直接查看源代码

***

## 🛠️ 技术栈

### 前端

- **Next.js 15** - React 全栈框架
- **React 19** - 前端 UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 现代化 CSS 框架
- **@dnd-kit/core** - 拖拽核心库
- **@dnd-kit/sortable** - 可排序列表
- **@dnd-kit/utilities** - 拖拽工具函数

### 后端

- **Node.js** - 运行时环境
- **Prisma ORM** - 数据库 ORM
- **SQLite** - 本地数据库（开发环境）
- **ModelScope API** - AI 模型服务

### 工具库

- **js-yaml** - YAML 解析和生成
- **mammoth** - DOCX 文件解析
- **bcryptjs** - 密码加密
- **OpenAI SDK** - ModelScope API 调用

***

## 📦 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 安装与运行

1. **克隆项目**

```bash
git clone https://github.com/BUPTtt2/XIAOS.git
cd XIAOS
```

1. **安装依赖**

```bash
npm install
```

1. **配置数据库**

```bash
npx prisma migrate dev
```

1. **启动开发服务器**

```bash
npm run dev
```

1. **访问应用**
   打开浏览器访问 `http://localhost:3000`

***

## 📖 使用说明

### 1. 注册账号

- 点击右上角"登录"
- 选择"注册"
- 填写邮箱和密码
- 完成注册

### 2. 上传小说

- 在首页拖拽小说文件或点击选择文件
- 支持格式：`.txt`、`.md`、`.docx`
- 确认文件内容后点击"开始转换"

### 3. AI 转换

- 等待 AI 自动分析和转换（显示加载动画）
- 转换完成后进入编辑页面
- 如遇 API 问题，会使用智能 Mock 数据
- Toast 通知会提示操作状态

### 4. 编辑剧本

- 在左侧可视化编辑器中修改
- 添加、删除场景和元素
- 拖拽场景进行排序
- 点击场景复制按钮复制整个场景
- 点击元素复制按钮复制单个元素
- 支持批量选择和删除多个元素
- 右侧实时预览 YAML 代码
- 本地草稿自动保存，刷新页面不丢失
- 点击"下载 YAML"保存到本地

### 5. 保存剧本

- 点击"保存剧本"保存到数据库（会显示确认对话框）
- 在"我的剧本"页面查看历史记录
- 点击任意剧本继续编辑

***

## 📁 项目结构

```
/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证页面
│   │   ├── login/
│   │   └── register/
│   ├── docs/                     # 文档页面
│   ├── scripts/                  # 历史剧本页面
│   ├── api/                      # API 路由
│   │   ├── auth/                 # 用户认证 API
│   │   ├── convert/              # AI 转换 API
│   │   └── scripts/              # 剧本 CRUD API
│   ├── page.tsx                  # 首页
│   └── layout.tsx
├── components/                   # React 组件
│   ├── Editor/
│   │   ├── ScriptEditor.tsx      # 剧本编辑器（带拖拽和批量操作）
│   │   └── SceneEditor.tsx       # 场景编辑器（带元素复制）
│   ├── DraggableSceneList.tsx    # 可拖拽场景列表
│   ├── BatchOperations.tsx       # 批量操作组件
│   ├── FileUpload.tsx            # 文件上传
│   ├── Navbar.tsx                # 导航栏
│   ├── LoadingSpinner.tsx        # 加载动画
│   ├── Toast.tsx                 # Toast 通知
│   └── ConfirmDialog.tsx         # 确认对话框
├── lib/                          # 工具库
│   ├── modelscope.ts             # ModelScope AI 集成
│   ├── smartMock.ts              # 智能 Mock 数据生成
│   ├── storage.ts                # 本地存储管理
│   └── types.ts                  # TypeScript 类型
├── schema/                       # Schema 定义
│   ├── script-schema.yaml        # 剧本 YAML Schema
│   └── schema-design.md          # Schema 设计文档
├── prisma/
│   └── schema.prisma             # Prisma 数据库模型
├── docs/                         # 开发文档
├── package.json
└── README.md
```

***

## 🔧 配置说明

### ModelScope API 配置

1. 注册 ModelScope 账号：<https://modelscope.cn>
2. 获取 API Key
3. 创建 `.env.local` 文件：

```env
MODELSCOPE_API_KEY=your_api_key_here
```

### 数据库配置

默认使用 SQLite，生产环境可在 `prisma/schema.prisma` 中修改为 PostgreSQL 或 MySQL。

***

## 📚 Schema 文档

### 剧本 YAML 格式

完整的剧本 Schema 定义见 [schema/script-schema.yaml](./schema/script-schema.yaml)

#### 基本结构

```yaml
meta:
  title: 剧本标题
  author: 原小说作者
  adaptedBy: 改编者
  created: 2024-01-01

characters:
  - name: 角色名
    description: 角色简介

scenes:
  - id: scene-1
    title: 场景标题
    time: 白天
    location: 地点
    elements:
      - type: dialogue
        character: 角色
        content: 对话内容
        tone: 情感音调
      - type: action
        content: 动作描述
      - type: narration
        content: 旁白内容
      - type: transition
        content: 场景转换
```

#### 元素类型

- **dialogue** - 对话：包含角色、内容、情感音调、伴随动作
- **action** - 动作：包含角色（可选）、动作描述
- **narration** - 旁白：纯文本描述
- **transition** - 转换：场景切换描述

### Schema 设计思想

详细的设计理念见 [schema/schema-design.md](./schema/schema-design.md)

***

## 🎯 开发笔记

### 分支策略

采用分 PR 迭代开发，每个 PR 专注一个小功能：

- PR1 - 项目初始化 + YAML Schema
- PR2 - 前端基础框架 + 文件上传
- PR3 - AI 转换模块
- PR4 - 可视化编辑器 + YAML 预览
- PR5 - 用户系统 + API Key 管理
- PR6 - 修复 + 文档 + 保存功能

### 已知问题与改进方向

#### 当前状态

- ✅ 核心功能完整
- ✅ 基本闭环可用
- ✅ 错误处理机制

#### 可优化方向

1. **AI 调用**
   - 添加重试机制
   - 支持更多模型选择
   - 增加 token 使用统计
2. **编辑器**
   - 场景拖拽排序
   - 角色预设和管理
   - 富文本编辑支持
   - 批量操作功能
3. **用户体验**
   - 加载动画和骨架屏
   - 更友好的错误提示
   - 快捷键支持
   - 主题切换
4. **导出功能**
   - 支持 PDF、Word 导出
   - 剧本格式化打印
   - 多种导出模板
5. **安全与性能**
   - JWT 认证优化
   - API 速率限制
   - 数据缓存
   - 图片上传支持

***

## 📄 License

MIT License

***

## 🤝 贡献

欢迎提出 Issue 和 PR！

***

## 👨‍💻 作者

AI 剧本创作工具团队
