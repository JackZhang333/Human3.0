import type { Metadata } from "next";
import "./globals.css";
import SchemaMarkup from "@/components/SchemaMarkup";
import { Providers } from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL('https://human3.org'),
  title: "Human 3.0 Assessment | Multidimensional Development",
  description: "Map your Mind, Body, Spirit, and Vocation. Stop forcing balance and start systematic lifestyle integration with the Human 3.0 framework.",
  alternates: {
    canonical: 'https://human3.org',
  },
  keywords: [
    "Human 3.0",
    "Human 3.0 Assessment",
    "Multidimensionally Jacked",
    "4 Quadrants of Development",
    "Mind Body Spirit Vocation",
    "Lifestyle Integration Framework",
    "Systematic Evolution",
    "元类型",
    "心理评估",
    "发展评估",
    "个人成长",
    "Self-Development Assessment",
    "Integrated Development"
  ],
  openGraph: {
    title: "Human 3.0 Assessment | Multidimensional Development",
    description: "Map your development across Mind, Body, Spirit, and Vocation. Become multidimensionally jacked through systematic lifestyle integration.",
    type: "website",
    locale: "zh_CN",
    url: "https://human3.org",
    siteName: "Human 3.0 Assessment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Human 3.0 Assessment | Multidimensional Development",
    description: "Stop forcing balance. Start systematic integration across all 4 quadrants of life.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <GoogleAnalytics />
        <SchemaMarkup />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
