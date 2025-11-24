"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Deal } from "../../lib/api";

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export default function SaleDealCard({ deal, className = "" }: DealCardProps) {
  const [imgSrc, setImgSrc] = useState(
    deal.image_url || "/images/default_thumbnail.png"
  );

  useEffect(() => {
    setImgSrc(deal.image_url || "/images/default_thumbnail.png");
  }, [deal.image_url]);

  const handleImageError = () => {
    if (deal.platform.toLowerCase().includes("epic")) {
      setImgSrc("/images/epic_logo.jpg");
    } else {
      setImgSrc("/images/default_thumbnail.png");
    }
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
          {/* 할인율 뱃지 */}
          {deal.discount_rate > 0 && (
            <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              -{deal.discount_rate}%
            </div>
          )}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-gray-100 text-gray-600">
              {deal.platform}
            </span>
          </div>

          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 h-10 group-hover:text-blue-600 transition-colors">
            {deal.title}
          </h3>

          <div className="mt-auto">
            <div className="flex flex-col items-start mb-2">
              {deal.regular_price > deal.sale_price && (
                <span className="text-[10px] text-gray-400 line-through">
                  ₩{deal.regular_price.toLocaleString()}
                </span>
              )}
              <span className="text-blue-600 font-bold text-sm">
                ₩{deal.sale_price.toLocaleString()}
              </span>
            </div>

            <div className="w-full text-center bg-gray-100 group-hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded transition-colors">
              스토어 이동
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
