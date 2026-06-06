import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 剧本创作工具",
  description: "将小说转换为结构化剧本",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
