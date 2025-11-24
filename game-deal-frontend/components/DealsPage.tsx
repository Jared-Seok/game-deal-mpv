"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DealCard from "./DealCard"; // 컴포넌트 사용
import { Deal } from "../lib/api";

interface DealsPageProps {
  title: string;
  category: "free" | "sale" | "sub";
}

export default function DealsPage({ title, category }: DealsPageProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"az" | "newest">("az");

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

        let targetDeals: Deal[] = [];
        if (category === "free") {
          targetDeals = allDeals.filter(
            (d) =>
              d.deal_type !== "GamePass" &&
              (d.sale_price === 0 || d.epicMeta?.is_free_to_keep)
          );
        } else if (category === "sale") {
          targetDeals = allDeals.filter(
            (d) =>
              d.deal_type !== "GamePass" &&
              d.regular_price > d.sale_price &&
              d.sale_price > 0
          );
        } else if (category === "sub") {
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

  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* [수정] 컴포넌트로 렌더링 위임 */}
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
