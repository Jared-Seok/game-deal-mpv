"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

// --- 1. 타입 정의 (Type Definitions) ---

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
  deal_type: "GamePass" | "Epic" | "Sale" | "Free";
  image_url?: string;
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

// 플랫폼별로 묶인 데이터 구조
type GroupedByPlatform = Record<string, Deal[]>;

interface DashboardData {
  free: GroupedByPlatform;
  sale: GroupedByPlatform;
  sub: GroupedByPlatform;
}

// --- 2. 하위 컴포넌트: 가로 스크롤 카드 리스트 ---
const PlatformRow = ({
  platformName,
  deals,
}: {
  platformName: string;
  deals: Deal[];
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300 * 2;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getImageSrc = (deal: Deal) =>
    deal.image_url ? deal.image_url : "/default_thumb.png";

  // [수정됨] 뱃지 렌더링: 구독 정보는 텍스트로 보여주므로 Badge에서는 Day 1만 강조
  const renderBadges = (deal: Deal) => {
    if (deal.xboxMeta) {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {deal.xboxMeta.is_day_one && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-black bg-yellow-400 rounded">
              Day 1
            </span>
          )}
          {/* removal_date가 있다면 표시 가능 (예: 종료 예정) */}
        </div>
      );
    }
    if (deal.epicMeta?.is_free_to_keep) {
      return (
        <span className="px-1.5 py-0.5 text-[9px] font-bold text-white bg-blue-600 rounded mt-1 inline-block">
          Free Keep
        </span>
      );
    }
    if (deal.discount_rate > 0) {
      return (
        <span className="px-1.5 py-0.5 text-[9px] font-bold text-white bg-red-600 rounded mt-1 inline-block">
          -{deal.discount_rate}%
        </span>
      );
    }
    return null;
  };

  // [신규 추가] 가격 또는 구독 정보 렌더링 로직
  const renderPriceOrInfo = (deal: Deal) => {
    // 1. 구독 서비스 (Xbox Game Pass)인 경우 -> 티어 & 플랫폼 표시
    if (deal.xboxMeta) {
      return (
        <div className="flex flex-col items-start gap-0.5">
          {/* 티어 정보 (예: Console, PC) */}
          <span className="text-xs font-extrabold text-green-700 uppercase">
            {deal.xboxMeta.game_pass_tier.replace(/,/g, " · ")}
          </span>
          {/* 플랫폼 정보 (예: Xbox Series X|S) */}
          <span
            className="text-[10px] text-gray-500 truncate max-w-full"
            title={deal.platform}
          >
            {deal.platform.includes("Xbox") ? "Xbox Console" : deal.platform}
          </span>
        </div>
      );
    }

    // 2. 일반 딜 / 무료 배포인 경우 -> 가격 표시
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

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex justify-between items-center mb-3 px-4 md:px-0">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-gray-800 rounded-full inline-block"></span>
          {platformName}{" "}
          <span className="text-gray-400 text-sm font-normal">
            ({deals.length})
          </span>
        </h3>
        <div className="hidden md:flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full border hover:bg-gray-100 text-gray-500"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full border hover:bg-gray-100 text-gray-500"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-0 snap-x scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="flex-none w-56 snap-start bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
          >
            {/* 이미지 영역 */}
            <div className="relative w-full h-32 bg-gray-200">
              <Image
                src={getImageSrc(deal)}
                alt={deal.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized={true}
              />
            </div>

            {/* 텍스트 정보 영역 */}
            <div className="p-3 flex flex-col h-[140px]">
              <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 h-10">
                {deal.title}
              </h4>

              <div className="mt-auto">
                <div className="mb-2 min-h-[40px] flex flex-col justify-end">
                  {renderPriceOrInfo(deal)}
                  {renderBadges(deal)}
                </div>

                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded transition-colors"
                >
                  {deal.xboxMeta ? "플레이 하기" : "스토어 이동"}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3. 메인 컴포넌트 ---
export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    free: {},
    sale: {},
    sub: {},
  });
  const [loading, setLoading] = useState<boolean>(true);

  const processDeals = (allDeals: Deal[]) => {
    const grouped: DashboardData = { free: {}, sale: {}, sub: {} };

    const addToGroup = (
      category: keyof DashboardData,
      platform: string,
      deal: Deal
    ) => {
      if (!grouped[category][platform]) {
        grouped[category][platform] = [];
      }
      grouped[category][platform].push(deal);
    };

    allDeals.forEach((deal) => {
      // 1. 구독 서비스 (Xbox Game Pass)
      if (deal.platform.includes("Xbox") || deal.deal_type === "GamePass") {
        addToGroup("sub", "Xbox Game Pass", deal);
        return;
      }

      // 2. 무료 배포 (가격 0원 or Epic Free Keep)
      if (deal.sale_price === 0 || deal.epicMeta?.is_free_to_keep) {
        let platformName = deal.platform;
        if (platformName.includes("Epic")) platformName = "Epic Games";
        if (platformName.includes("Steam")) platformName = "Steam";

        addToGroup("free", platformName, deal);
      }
      // 3. 할인 (정가 > 판매가)
      else if (deal.regular_price > deal.sale_price && deal.sale_price > 0) {
        let platformName = deal.platform;
        if (platformName.includes("Epic")) platformName = "Epic Games";

        addToGroup("sale", platformName, deal);
      }
    });

    return grouped;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [xboxRes, epicRes] = await Promise.allSettled([
          axios.get<ApiResponse>("http://localhost:4000/api/v1/deals", {
            params: { platform: "Xbox", limit: 3000 },
          }),
          axios.get<ApiResponse>("http://localhost:4000/api/v1/deals", {
            params: { platform: "Epic", limit: 3000 },
          }),
        ]);

        const xboxDeals =
          xboxRes.status === "fulfilled" ? xboxRes.value.data.data : [];
        const epicDeals =
          epicRes.status === "fulfilled" ? epicRes.value.data.data : [];
        const allDeals = [...xboxDeals, ...epicDeals];

        setDashboardData(processDeals(allDeals));
      } catch (error) {
        console.error("Failed to fetch deals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const renderSection = (
    id: string,
    title: string,
    desc: string,
    data: GroupedByPlatform
  ) => {
    const platforms = Object.keys(data);
    if (platforms.length === 0) return null;

    return (
      <section id={id} className="mb-16 pt-20 -mt-20">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="text-gray-500 mt-1">{desc}</p>
        </div>
        {platforms.map((platform) => (
          <PlatformRow
            key={platform}
            platformName={platform}
            deals={data[platform]}
          />
        ))}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex flex-col gap-12 animate-pulse mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="w-56 h-64 bg-gray-200 rounded-lg shrink-0"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {renderSection(
              "free",
              "🎁 무료 배포 게임",
              "Epic Games, Steam 등 지금 바로 라이브러리에 추가하세요.",
              dashboardData.free
            )}
            {renderSection(
              "sale",
              "🔥 할인 중인 게임",
              "놓치면 후회할 역대급 할인 정보를 모았습니다.",
              dashboardData.sale
            )}
            {renderSection(
              "sub",
              "🎮 구독 서비스 카탈로그",
              "Xbox Game Pass, PS Plus 등 구독형 게임 리스트입니다.",
              dashboardData.sub
            )}

            {Object.keys(dashboardData.free).length === 0 &&
              Object.keys(dashboardData.sale).length === 0 &&
              Object.keys(dashboardData.sub).length === 0 && (
                <div className="text-center py-32">
                  <p className="text-gray-500 text-lg">
                    현재 표시할 게임 정보가 없습니다.
                  </p>
                </div>
              )}
          </>
        )}
      </main>
    </div>
  );
}
