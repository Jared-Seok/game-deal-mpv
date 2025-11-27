// game-deal-frontend/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Link 컴포넌트 import
// Deal 타입과 fetchDeals 함수 import
import { fetchDeals, Deal } from "../lib/api";
import DealCard from "../components/DealCard";

// --- 섹션 컴포넌트 ---
const SectionRow = ({
  title,
  desc,
  deals,
  isSubSection = false,
}: {
  title: string;
  desc: string;
  deals: Deal[];
  isSubSection?: boolean;
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

  if (deals.length === 0) return null;

  return (
    <section className={isSubSection ? "mb-8" : "mb-16 pt-20 -mt-20"}>
      <div className="mb-6 border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
          <h2
            className={`${
              isSubSection ? "text-2xl" : "text-3xl"
            } font-extrabold text-gray-900`}
          >
            {title}
          </h2>
          <p className="text-gray-500 mt-1">{desc}</p>
        </div>
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
          <div key={deal.id} className="flex-none w-72 snap-start h-full">
            <DealCard deal={deal} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

// --- 구독 섹션 컴포넌트 ---
const SubscriptionSection = ({
  xboxDeals,
  eaPlayDeals,
}: {
  xboxDeals: Deal[];
  eaPlayDeals: Deal[];
}) => {
  return (
    <section className="mb-16 pt-20 -mt-20">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">
          구독 서비스 섹션
        </h2>
        <p className="text-gray-500 mt-1">
          Xbox Game Pass와 EA Play의 전체 카탈로그를 확인하세요.
        </p>
      </div>
      <div className="space-y-12">
        <SectionRow
          title="🎮 Xbox Game Pass 카탈로그"
          desc="Xbox Game Pass 구독형 게임 리스트입니다."
          deals={xboxDeals}
          isSubSection={true}
        />
        <SectionRow
          title="🎯 EA Play 카탈로그"
          desc="EA Play 및 EA Play Pro 구독 게임 리스트입니다."
          deals={eaPlayDeals}
          isSubSection={true}
        />
      </div>
    </section>
  );
};

// --- 메인 페이지 ---
export default function Home() {
  const [freeDeals, setFreeDeals] = useState<Deal[]>([]);
  const [xboxDeals, setXboxDeals] = useState<Deal[]>([]);
  const [eaPlayDeals, setEAPlayDeals] = useState<Deal[]>([]);
  const [saleDeals, setSaleDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // [FIX] fetchDeals가 객체를 반환하므로, 각 결과에서 deals 속성을 추출합니다.
        const [freeResult, subResult, saleResult] = await Promise.all([
          fetchDeals("free", { limit: 10 }),
          fetchDeals("sub", { limit: 1000 }), // Fetch all subscription deals
          fetchDeals("sale", { limit: 10, sort: "reviews", min_reviews: 100 }), // 리뷰 많은 순으로 10개, 최소 리뷰 100개 필터링
        ]);

        setFreeDeals(freeResult.deals);
        setSaleDeals(saleResult.deals);

        // Split subscription deals by service type from the correct array
        const allSubData = subResult.deals;
        const xbox = allSubData.filter((d) => d.deal_type === "GamePass");
        const eaPlay = allSubData.filter(
          (d) => d.deal_type === "Subscription"
        );

        setXboxDeals(xbox.slice(0, 10));
        setEAPlayDeals(eaPlay.slice(0, 10));

      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <SectionRow
              title="🎁 무료 배포 게임"
              desc="Epic Games, Steam, Ubisoft 등 지금 바로 라이브러리에 추가하세요."
              deals={freeDeals}
            />
            <SectionRow
              title="🔥 할인 중인 게임"
              desc="놓치면 후회할 역대급 할인 정보를 모았습니다."
              deals={saleDeals}
            />
            {/* "더보기" 버튼 추가 */}
            <div className="text-center -mt-8 mb-16">
              <Link
                href="/deals/sale"
                className="inline-block bg-white text-gray-700 font-semibold py-2 px-6 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                스팀 세일 게임 더보기
              </Link>
            </div>

            <SubscriptionSection
              xboxDeals={xboxDeals}
              eaPlayDeals={eaPlayDeals}
            />

            {freeDeals.length === 0 &&
              xboxDeals.length === 0 &&
              eaPlayDeals.length === 0 &&
              saleDeals.length === 0 && (
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
