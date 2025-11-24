"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Deal } from "../../lib/api";

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export default function SubDealCard({ deal, className = "" }: DealCardProps) {
  const [imgSrc, setImgSrc] = useState(
    deal.image_url || "/images/default_thumbnail.png"
  );

  useEffect(() => {
    setImgSrc(deal.image_url || "/images/default_thumbnail.png");
  }, [deal.image_url]);

  const handleImageError = () => {
    setImgSrc("/images/gamepass_logo.jpg");
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
          {/* Day 1 뱃지 */}
          {deal.xboxMeta?.is_day_one && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Day 1
            </div>
          )}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
            {deal.title}
          </h3>

          <div className="mt-auto">
            {/* 뱃지 목록 */}
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold text-green-800 bg-green-100 rounded-full">
                GAME PASS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-full uppercase">
                {deal.platform.includes("Xbox") ? "Xbox" : deal.platform}
              </span>
            </div>

            {/* 티어 정보 */}
            <div className="mb-2">
              <span className="text-xs font-extrabold text-green-700 uppercase block">
                {deal.xboxMeta?.game_pass_tier.replace(/,/g, " · ") ||
                  "SUBSCRIPTION"}
              </span>
            </div>

            <div className="w-full text-center bg-green-50 group-hover:bg-green-100 text-green-800 text-xs font-bold py-1.5 rounded transition-colors">
              플레이 하기
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
