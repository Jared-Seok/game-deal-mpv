// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header"; // 헤더 import

export const metadata: Metadata = {
  title: "Game Deal Tracker",
  description: "Track free games and sales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 font-sans">
        <Header /> {/* 헤더 추가 */}
        {children}
      </body>
    </html>
  );
}
