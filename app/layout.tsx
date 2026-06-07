import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 剧本创作工具 - 将小说转换为精彩剧本",
  description: "使用 AI 技术自动分析小说内容，快速生成结构化剧本初稿",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
