// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Next.js 練習',
  description: 'App Router の学習',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* ナビゲーション（全ページ共通） */}
        <nav className="border-b px-8 py-4 flex gap-6">
          <Link href="/" className="font-bold hover:text-blue-600">
            ホーム
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/blog" className="hover:text-blue-600">
            ブログ
          </Link>
          <Link href="/users" className="hover:text-blue-600">
            ユーザー
          </Link>
        </nav>

        {/* ここに各ページの内容が入る */}
        {children}

        <Analytics />        {/* ページビュー計測 */}
        <SpeedInsights />    {/* パフォーマンス計測 */}
      </body>
    </html>
  );
}