import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laravel + Next.js Learning Platform",
  description: "フルスタック開発を学ぶための総合的な学習プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.className}>
      <body className="min-h-screen bg-background antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
