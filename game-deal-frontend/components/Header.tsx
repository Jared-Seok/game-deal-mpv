// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "무료 배포",
      href: "/deals/free",
      colorClass: "hover:text-blue-600",
    },
    {
      name: "할인 정보",
      href: "/deals/sale",
      colorClass: "hover:text-red-600",
    },
    {
      name: "구독 서비스",
      href: "/deals/sub",
      colorClass: "hover:text-green-600",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* 1. 로고 (클릭 시 대시보드 이동) */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
            G
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            Deal Tracker
          </span>
        </Link>

        {/* 2. 네비게이션 (클릭 시 리스트 페이지 이동) */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold transition-colors ${
                pathname === item.href ? "text-gray-900" : "text-gray-500"
              } ${item.colorClass}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
