import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Human 3.0 发展评估 | 发现你的元类型",
  description: "基于 Human 3.0 模型的心理发展评估系统。通过自适应访谈评估你在心智、身体、精神、使命四个象限的发展状态，获取个性化成长策略。",
  keywords: ["Human 3.0", "心理评估", "发展评估", "元类型", "个人成长", "四象限"],
  openGraph: {
    title: "Human 3.0 发展评估",
    description: "发现你的元类型，开启多维度人生升级之旅",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
