"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import axios from "axios";

// --- 1. 타입 정의 ---
interface Deal {
  id: number;
  platform: string;
  title: string;
  url: string;
  regular_price: number;
  sale_price: number;
  discount_rate: number;
  deal_type: "GamePass" | "Epic" | "Sale" | "Free";
  image_url?: string;
  xboxMeta?: { game_pass_tier: string; is_day_one: boolean };
  epicMeta?: { is_free_to_keep: boolean };
}

interface DealsPageProps {
  title: string;
  category: "free" | "sale" | "sub";
}

export default function DealsPage({ title, category }: DealsPageProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"az" | "newest">("az");

  // --- 2. 데이터 로드 ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [xboxRes, epicRes] = await Promise.allSettled([
          axios.get("http://localhost:4000/api/v1/deals", {
            params: { platform: "Xbox", limit: 3000 },
          }),
          axios.get("http://localhost:4000/api/v1/deals", {
            params: { platform: "Epic", limit: 3000 },
          }),
        ]);

        const xboxData =
          xboxRes.status === "fulfilled" ? xboxRes.value.data.data : [];
        const epicData =
          epicRes.status === "fulfilled" ? epicRes.value.data.data : [];
        const allDeals: Deal[] = [...xboxData, ...epicData];

        // 카테고리별 필터링 로직
        let targetDeals: Deal[] = [];
        if (category === "free") {
          // 무료 배포: GamePass 제외, 순수 무료(가격 0원) 또는 Epic Free Keep
          targetDeals = allDeals.filter(
            (d) =>
              d.deal_type !== "GamePass" &&
              (d.sale_price === 0 || d.epicMeta?.is_free_to_keep)
          );
        } else if (category === "sale") {
          // 할인: 정가 > 판매가이고, 무료가 아니며, GamePass가 아닌 것
          targetDeals = allDeals.filter(
            (d) =>
              d.deal_type !== "GamePass" &&
              d.regular_price > d.sale_price &&
              d.sale_price > 0
          );
        } else if (category === "sub") {
          // 구독: deal_type이 GamePass인 것 또는 Xbox 플랫폼
          targetDeals = allDeals.filter(
            (d) => d.deal_type === "GamePass" || d.platform.includes("Xbox")
          );
        }

        setDeals(targetDeals);
      } catch (error) {
        console.error("데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  // --- 3. 검색 및 정렬 ---
  const filteredDeals = useMemo(() => {
    let result = deals.filter((deal) =>
      deal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "az") {
      result.sort((a, b) => {
        const titleA = a.title;
        const titleB = b.title;
        const isKoA = /[가-힣]/.test(titleA.charAt(0));
        const isKoB = /[가-힣]/.test(titleB.charAt(0));

        if (isKoA === isKoB) {
          return titleA.localeCompare(titleB, "ko-KR", { numeric: true });
        }
        return isKoA ? -1 : 1;
      });
    }
    return result;
  }, [deals, searchTerm, sortOrder]);

  const getImageSrc = (deal: Deal) => deal.image_url || "/default_thumb.png";

  // --- 4. 렌더링 헬퍼 ---

  const renderPriceOrInfo = (deal: Deal) => {
    if (deal.xboxMeta || deal.deal_type === "GamePass") {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-xs font-extrabold text-green-700 uppercase">
            {deal.xboxMeta?.game_pass_tier
              ? deal.xboxMeta.game_pass_tier.replace(/,/g, " · ")
              : "GAME PASS"}
          </span>
          <span className="text-[10px] text-gray-500 truncate max-w-full">
            구독 서비스 포함
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-start">
        {deal.regular_price > deal.sale_price && deal.regular_price > 0 && (
          <span className="text-[10px] text-gray-400 line-through">
            ₩{deal.regular_price.toLocaleString()}
          </span>
        )}
        <span className="text-blue-600 font-bold text-sm">
          {deal.sale_price === 0
            ? "무료"
            : `₩${deal.sale_price.toLocaleString()}`}
        </span>
      </div>
    );
  };

  const renderBadges = (deal: Deal) => {
    if (deal.xboxMeta?.is_day_one) {
      return (
        <span className="px-1.5 py-0.5 text-[9px] font-bold text-black bg-yellow-400 rounded">
          Day 1
        </span>
      );
    }
    if (deal.epicMeta?.is_free_to_keep) {
      return (
        <span className="px-1.5 py-0.5 text-[9px] font-bold text-white bg-blue-600 rounded">
          Free Keep
        </span>
      );
    }
    if (deal.deal_type !== "GamePass" && deal.discount_rate > 0) {
      return (
        <span className="px-1.5 py-0.5 text-[9px] font-bold text-white bg-red-600 rounded">
          -{deal.discount_rate}%
        </span>
      );
    }
    return null;
  };

  return (
    // [수정] 배경색 적용을 위한 래퍼 추가 (bg-gray-50)
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* --- 상단 컨트롤러 --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
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

        {/* --- 메인 그리드 영역 --- */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p className="text-gray-500">조건에 맞는 게임이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col w-full"
              >
                {/* 이미지 영역 */}
                <div className="relative w-full aspect-[16/9] bg-gray-200">
                  <Image
                    src={getImageSrc(deal)}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {deal.platform.includes("Xbox") ? "Xbox" : deal.platform}
                  </div>
                </div>

                {/* 텍스트 정보 영역 */}
                <div className="p-3 flex flex-col h-[140px]">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 h-10 group-hover:text-blue-600 transition-colors">
                    {deal.title}
                  </h4>

                  <div className="mt-auto">
                    <div className="mb-2 min-h-[40px] flex flex-col justify-end">
                      <div className="flex justify-between items-end w-full">
                        {renderPriceOrInfo(deal)}
                        {renderBadges(deal)}
                      </div>
                    </div>

                    <a
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded transition-colors"
                    >
                      {deal.deal_type === "GamePass" || deal.xboxMeta
                        ? "플레이 하기"
                        : "스토어 이동"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
