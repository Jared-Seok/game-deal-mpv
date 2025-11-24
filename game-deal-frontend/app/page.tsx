"use client";

import { useState, useEffect, useRef } from "react";
import { fetchDeals, Deal } from "../lib/api";
import DealCard from "../components/DealCard";

// --- 섹션 컴포넌트 ---
const SectionRow = ({
  title,
  desc,
  deals,
}: {
  title: string;
  desc: string;
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

  if (deals.length === 0) return null;

  return (
    <section className="mb-16 pt-20 -mt-20">
      <div className="mb-6 border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
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

// --- 메인 페이지 ---
export default function Home() {
  const [freeDeals, setFreeDeals] = useState<Deal[]>([]);
  const [subDeals, setSubDeals] = useState<Deal[]>([]);
  const [saleDeals, setSaleDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // API에서 카테고리별로 데이터를 병렬 요청
        const [freeData, subData, saleData] = await Promise.all([
          fetchDeals({ type: "free", limit: 10 }),
          fetchDeals({ type: "sub", limit: 10 }),
          fetchDeals({ type: "sale", limit: 10 }),
        ]);

        setFreeDeals(freeData);
        setSubDeals(subData);
        setSaleDeals(saleData);
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
            <SectionRow
              title="🎮 구독 서비스 카탈로그"
              desc="Xbox Game Pass 등 구독형 게임 리스트입니다."
              deals={subDeals}
            />

            {freeDeals.length === 0 &&
              subDeals.length === 0 &&
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
