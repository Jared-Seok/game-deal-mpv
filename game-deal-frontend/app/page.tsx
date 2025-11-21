"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

// --- 1. 타입 정의 (Type Definitions) ---
// API에서 받아올 데이터의 구조를 정의합니다.

interface XboxMetadata {
  game_pass_tier: string;
  is_day_one: boolean;
  removal_date?: string;
}

interface EpicMetadata {
  is_free_to_keep: boolean;
}

interface Deal {
  id: number;
  platform: string;
  title: string;
  url: string;
  regular_price: number;
  sale_price: number;
  discount_rate: number;
  deal_type: "GamePass" | "Epic";
  image_url?: string; // DB에 현재 없지만 추후 확장을 위해 옵셔널로 정의

  // 관계형 데이터 (Optional)
  xboxMeta?: XboxMetadata;
  epicMeta?: EpicMetadata;
}

interface ApiResponse {
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  data: Deal[];
}

type TabType = "Xbox" | "Epic";

// --- 2. 메인 컴포넌트 ---
export default function Home() {
  // --- State 관리 ---
  // useState에 제네릭(<Type>)을 사용하여 타입을 명시합니다.
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>("Xbox");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // --- 검색어 디바운스 ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- 데이터 가져오기 ---
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        // axios.get에 응답 타입(ApiResponse)을 지정하여 자동 완성을 지원받습니다.
        const response = await axios.get<ApiResponse>(
          "http://localhost:4000/api/v1/deals",
          {
            params: {
              page: page,
              limit: 18,
              platform: activeTab,
              search: debouncedSearch,
            },
          }
        );
        setDeals(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [activeTab, debouncedSearch, page]);

  // --- 렌더링 헬퍼: 뱃지 ---
  const renderBadges = (deal: Deal) => {
    if (deal.deal_type === "GamePass" && deal.xboxMeta) {
      const tiers = deal.xboxMeta.game_pass_tier || "";
      return (
        <div className="flex flex-wrap gap-1 mt-2">
          {tiers.split(",").map((tier, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-[10px] font-bold text-white bg-green-600 rounded uppercase"
            >
              {tier.trim()}
            </span>
          ))}
          {deal.xboxMeta.is_day_one && (
            <span className="px-2 py-1 text-[10px] font-bold text-black bg-yellow-400 rounded uppercase">
              Day 1
            </span>
          )}
        </div>
      );
    }
    if (deal.deal_type === "Epic" && deal.epicMeta) {
      return deal.epicMeta.is_free_to_keep ? (
        <span className="px-2 py-1 text-[10px] font-bold text-white bg-blue-600 rounded mt-2 inline-block uppercase">
          Free Keep
        </span>
      ) : null;
    }
    return null;
  };

  // --- 렌더링 헬퍼: 이미지 ---
  const getImageSrc = (deal: Deal) => {
    // DB 필드 부재로 인한 Fallback 이미지 처리
    return deal.image_url ? deal.image_url : "/default_thumb.png";
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Game Deal Tracker
          </h1>
          <p className="text-gray-500">
            놓치지 말아야 할 게임 패스 & 무료 배포 정보
          </p>
        </header>

        {/* 컨트롤 바 (탭 & 검색) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* 탭 버튼 */}
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex">
            {(["Xbox", "Epic"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {tab === "Xbox" ? "Xbox Game Pass" : "Epic Games"}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="게임 제목 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 게임 리스트 그리드 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">
              조건에 맞는 게임을 찾을 수 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* 썸네일 이미지 영역 */}
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={getImageSrc(deal)}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={true} // 외부 URL 이미지가 아니라 로컬/fallback이라도 안전하게 처리
                  />
                  {/* 플랫폼 라벨 */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    {deal.platform.replace(/, /g, " · ")}
                  </div>
                </div>

                {/* 텍스트 정보 영역 */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                    {deal.title}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                    <div className="flex flex-col">
                      {deal.regular_price > 0 && (
                        <span className="text-xs text-gray-400 line-through mb-0.5">
                          ₩{deal.regular_price.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold text-sm">
                          {deal.sale_price === 0
                            ? deal.deal_type === "GamePass"
                              ? "구독 포함"
                              : "무료 배포"
                            : `₩${deal.sale_price.toLocaleString()}`}
                        </span>
                      </div>
                      {renderBadges(deal)}
                    </div>

                    <a
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      스토어 →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {deals.length > 0 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
