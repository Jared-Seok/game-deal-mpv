"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Deal } from "../../lib/api";

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export default function FreeDealCard({ deal, className = "" }: DealCardProps) {
  const [imgSrc, setImgSrc] = useState(
    deal.image_url || "/images/default_thumbnail.png"
  );

  useEffect(() => {
    setImgSrc(deal.image_url || "/images/default_thumbnail.png");
  }, [deal.image_url]);

  const handleImageError = () => {
    setImgSrc("/images/epic_logo.jpg");
  };

  // Ubisoft 및 날짜 포맷팅 (GMT -> KST +9)
  const getFormattedEndDate = () => {
    if (!deal.end_date) return null;
    let endDate = new Date(deal.end_date);
    if (deal.platform.toLowerCase().includes("ubisoft")) {
      endDate = new Date(endDate.getTime() + 9 * 60 * 60 * 1000);
    }

    // 날짜 형식을 "12월 31일 14:00" 형태로 간소화
    return endDate.toLocaleString("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      className={`block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`}
    >
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col h-full"
      >
        {/* --- [1] 이미지 영역 --- */}
        <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
          <Image
            src={imgSrc}
            alt={deal.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            unoptimized
          />

          {/* Free Keep 뱃지 (좌측 상단 고정) */}
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
            Free Keep
          </div>
        </div>

        {/* --- 텍스트/정보 영역 --- */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
            {deal.title}
          </h3>

          <div className="mt-auto">
            {/* 가격 및 종료일 정보 행 */}
            <div className="flex justify-between items-end mb-2">
              {/* 가격 정보 (좌측) */}
              <div className="flex flex-col items-start">
                {deal.regular_price > 0 && (
                  <span className="text-[11px] text-gray-400 line-through mb-0.5">
                    ₩{deal.regular_price.toLocaleString()}
                  </span>
                )}
                {/* [3] 무료 폰트 크기 확대 (text-2xl) */}
                <span className="text-blue-600 font-extrabold text-2xl leading-none">
                  무료
                </span>
              </div>

              {/* [2] 종료 일자 (우측 하단) */}
              {deal.end_date && (
                <div className="text-right pb-0.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">배포 종료</p>
                  <p className="text-[11px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded inline-block">
                    {getFormattedEndDate()}
                  </p>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="w-full text-center bg-gray-100 group-hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 rounded transition-colors">
              스토어 이동
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
