// components/DealsPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchDeals, Deal } from "../lib/api"; // API 유틸리티 사용
import DealCard from "./DealCard"; // 통합된 DealCard 컴포넌트

interface DealsPageProps {
  title: string;
  category: "free" | "sale" | "sub";
}

export default function DealsPage({ title, category }: DealsPageProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"az" | "newest">("az");

  // [핵심] 메인 페이지와 동일한 데이터 페칭 로직
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // API에 직접 category(type)를 전달하여 필요한 데이터만 요청
        const data = await fetchDeals({ type: category, limit: 1000 });
        setDeals(data);
      } catch (error) {
        console.error("상세 페이지 데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [category]);

  // 클라이언트 사이드 검색 및 정렬
  const filteredDeals = useMemo(() => {
    let result = deals.filter((deal) =>
      deal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "az") {
      result.sort((a, b) => {
        // 한글 > 영어 순 정렬 로직
        const isKoA = /[가-힣]/.test(a.title);
        const isKoB = /[가-힣]/.test(b.title);
        if (isKoA === isKoB) return a.title.localeCompare(b.title);
        return isKoA ? -1 : 1;
      });
    }
    // 필요 시 'newest' 정렬 추가 가능

    return result;
  }, [deals, searchTerm, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* 헤더 및 검색바 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 mt-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-500 text-sm">
              총{" "}
              <span className="font-bold text-gray-900">
                {filteredDeals.length}
              </span>
              개의 게임을 찾았습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="게임 제목 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-shadow"
            />
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none bg-white cursor-pointer"
            >
              <option value="az">가나다순 (A-Z)</option>
            </select>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p className="text-gray-500">조건에 맞는 게임이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
