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

  // --- [로직] 날짜 계산 (Ubisoft +9시간 보정) ---
  const getFormattedEndDate = () => {
    if (!deal.end_date) return null;

    let endDate = new Date(deal.end_date);

    // Ubisoft: GMT 기준이므로 KST(+9h) 보정
    // 24시 초과 시 날짜 자동 계산은 Date 객체 메서드(setHours)가 알아서 처리함
    if (deal.platform.toLowerCase().includes("ubisoft")) {
      endDate.setHours(endDate.getHours() + 9);
    }

    return endDate.toLocaleString("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 플랫폼 이름 정제 (이미지 좌측 상단용)
  const getPlatformName = () => {
    if (deal.platform.toLowerCase().includes("epic")) return "EPIC GAMES";
    if (deal.platform.toLowerCase().includes("ubisoft")) return "UBISOFT";
    if (deal.platform.toLowerCase().includes("steam")) return "STEAM";
    return deal.platform;
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
        {/* 이미지 영역 */}
        <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
          <Image
            src={imgSrc}
            alt={deal.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            unoptimized
          />

          {/* [수정 1] 좌측 상단 플랫폼 뱃지 (검정 반투명 배경) */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide z-10">
            {getPlatformName()}
          </div>
        </div>

        {/* 텍스트 정보 영역 */}
        <div className="p-3 flex flex-col flex-grow">
          {/* 타이틀 */}
          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors">
            {deal.title}
          </h3>

          <div className="mt-auto">
            <div className="flex justify-between items-end mb-3">
              {/* [수정 2] 가격 정보 (좌측) */}
              <div className="flex flex-col items-start">
                {/* 정가 (취소선) */}
                {deal.regular_price > 0 && (
                  <span className="text-xs text-gray-400 line-through mb-0.5">
                    ₩{deal.regular_price.toLocaleString()}
                  </span>
                )}
                {/* 무료 텍스트 강조 */}
                <span className="text-blue-600 font-extrabold text-xl">
                  무료
                </span>
              </div>

              {/* [수정 3] 종료 일자 (우측) */}
              {deal.end_date && (
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 mb-0.5">
                    종료 일시
                  </span>
                  <span className="text-[11px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                    ~ {getFormattedEndDate()}
                  </span>
                </div>
              )}
            </div>

            {/* [수정 4] 버튼 통일 */}
            <div className="w-full text-center bg-gray-100 group-hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded transition-colors">
              스토어로 이동
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
