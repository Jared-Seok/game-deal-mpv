// game-deal-frontend/components/DealsPage.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchDeals, Deal, ApiResponseMeta } from "../lib/api";
import DealCard from "./DealCard";

// --- 페이지네이션 컴포넌트 ---
const Pagination = ({
  meta,
  onPageChange,
}: {
  meta: ApiResponseMeta;
  onPageChange: (page: number) => void;
}) => {
  if (meta.totalPages <= 1) return null;

  const handlePrev = () => {
    if (meta.currentPage > 1) {
      onPageChange(meta.currentPage - 1);
    }
  };

  const handleNext = () => {
    if (meta.currentPage < meta.totalPages) {
      onPageChange(meta.currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button
        onClick={handlePrev}
        disabled={meta.currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        이전
      </button>
      <span className="text-sm text-gray-600">
        Page{" "}
        <span className="font-bold text-gray-900">{meta.currentPage}</span> of{" "}
        <span className="font-bold text-gray-900">{meta.totalPages}</span>
      </span>
      <button
        onClick={handleNext}
        disabled={meta.currentPage === meta.totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        다음
      </button>
    </div>
  );
};


// --- 메인 페이지 컴포넌트 ---
interface DealsPageProps {
  title: string;
  category: "free" | "sale" | "sub";
}

export default function DealsPage({ title, category }: DealsPageProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 20 });
  const [loading, setLoading] = useState(true);
  
  // 검색 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>(category === 'sale' ? "discount" : "az");
  const [page, setPage] = useState(1);

  // 검색어 디바운싱
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // 검색어가 바뀌면 1페이지로 리셋
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // 서버 사이드 데이터 페칭
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { deals: data, meta: metaData } = await fetchDeals(category, {
          limit: 20,
          page: page,
          sort: sortOrder,
          search: debouncedSearchTerm,
        });
        setDeals(data);
        setMeta(metaData);
      } catch (error) {
        console.error("상세 페이지 데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [category, sortOrder, page, debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 mt-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500 text-sm">
              총 <span className="font-bold text-gray-900">{meta.totalItems}</span>개의 게임을 찾았습니다.
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
            {category === "sale" && (
              <select
                value={sortOrder}
                onChange={(e: any) => { setSortOrder(e.target.value); setPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none bg-white cursor-pointer"
              >
                <option value="discount">할인율 높은 순</option>
                <option value="reviews">리뷰 많은 순</option>
                <option value="positive">긍정적 평가 순</option>
                <option value="az">가나다순 (A-Z)</option>
              </select>
            )}
            {category !== "sale" && (
               <select
                value={sortOrder}
                onChange={(e: any) => { setSortOrder(e.target.value); setPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none bg-white cursor-pointer"
              >
                <option value="az">가나다순 (A-Z)</option>
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p className="text-gray-500">조건에 맞는 게임이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </main>
    </div>
  );
}
