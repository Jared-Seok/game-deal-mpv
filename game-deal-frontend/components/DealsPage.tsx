// game-deal-frontend/components/DealsPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
// 🚨 [수정 1] Deal 타입은 lib/api.ts에서 가져옵니다.
import { fetchDeals, Deal } from "../lib/api";
import DealCard from "./DealCard";

interface DealsPageProps {
  title: string;
  category: "free" | "sale" | "sub";
}

export default function DealsPage({ title, category }: DealsPageProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"az" | "newest">("az");

  // Tab and tier filtering for subscription page
  const [activeTab, setActiveTab] = useState<"all" | "xbox" | "ea">("all");
  const [activeTier, setActiveTier] = useState<string>("all");

  // [핵심] 메인 페이지와 동일한 데이터 페칭 로직
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 🚨 [수정 2] 메타데이터를 포함하도록 옵션 객체 수정: include_meta: 'true' 추가
        // API는 category와 options 객체를 받습니다.
        const data = await fetchDeals(category, {
          limit: 1000,
          include_meta: "true",
        });
        setDeals(data);
      } catch (error) {
        console.error("상세 페이지 데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [category]);

  // Reset tier filter when tab changes
  useEffect(() => {
    setActiveTier("all");
  }, [activeTab]);

  // Extract available tiers based on active tab
  const availableTiers = useMemo(() => {
    if (category !== "sub") return [];

    const tierSet = new Set<string>();

    deals.forEach((deal) => {
      if (activeTab === "all" || activeTab === "xbox") {
        if (deal.deal_type === "GamePass" && deal.xboxMeta?.game_pass_tier) {
          deal.xboxMeta.game_pass_tier.split(",").forEach((tier) => {
            tierSet.add(tier.trim());
          });
        }
      }
      if (activeTab === "all" || activeTab === "ea") {
        if (deal.deal_type === "Subscription" && deal.eaPlayMeta?.ea_play_tier) {
          deal.eaPlayMeta.ea_play_tier.split(",").forEach((tier) => {
            tierSet.add(tier.trim());
          });
        }
      }
    });

    return Array.from(tierSet).sort();
  }, [deals, activeTab, category]);

  // 클라이언트 사이드 검색, 탭, 티어, 정렬
  const filteredDeals = useMemo(() => {
    let result = deals;

    // Tab filtering (subscription page only)
    if (category === "sub") {
      if (activeTab === "xbox") {
        result = result.filter((d) => d.deal_type === "GamePass");
      } else if (activeTab === "ea") {
        result = result.filter((d) => d.deal_type === "Subscription");
      }
    }

    // Tier filtering (subscription page only)
    if (category === "sub" && activeTier !== "all") {
      result = result.filter((deal) => {
        if (deal.deal_type === "GamePass") {
          return deal.xboxMeta?.game_pass_tier?.includes(activeTier);
        } else if (deal.deal_type === "Subscription") {
          return deal.eaPlayMeta?.ea_play_tier?.includes(activeTier);
        }
        return false;
      });
    }

    // Search filtering
    result = result.filter((deal) =>
      deal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
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
  }, [deals, searchTerm, sortOrder, activeTab, activeTier, category]);

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

        {/* Tab Navigation (Subscription Page Only) */}
        {category === "sub" && (
          <div className="mb-6">
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === "all"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setActiveTab("xbox")}
                className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === "xbox"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                🎮 Xbox Game Pass
              </button>
              <button
                onClick={() => setActiveTab("ea")}
                className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === "ea"
                    ? "border-orange-600 text-orange-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                🎯 EA Play
              </button>
            </div>
          </div>
        )}

        {/* Tier Filtering Pills (Subscription Page Only) */}
        {category === "sub" && availableTiers.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTier("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeTier === "all"
                    ? activeTab === "xbox"
                      ? "bg-green-600 text-white"
                      : activeTab === "ea"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                전체 티어
              </button>
              {availableTiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors uppercase ${
                    activeTier === tier
                      ? activeTab === "xbox"
                        ? "bg-green-600 text-white"
                        : activeTab === "ea"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        )}

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
