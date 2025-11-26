// game-deal-frontend/components/cards/SaleDealCard.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface DealProps {
  id: number;
  platform: string;
  title: string;
  url: string;
  regular_price: number;
  sale_price: number;
  discount_rate: number;
  image_url: string;
  end_date: string | null;
  steamMeta?: {
    review_summary: string;
    positive_review_percent: number;
    total_reviews: number;
  };
}

// 🚨 [수정 1] DealProps 외에 className을 받도록 타입을 정의합니다.
interface SaleDealCardProps {
  deal: DealProps;
  className?: string; // <- 이 부분을 추가/확인합니다.
}

const SaleDealCard = ({ deal, className = "" }: SaleDealCardProps) => {
  const isSteam = deal.platform === "Steam";

  // Steam 게임인 경우 steam_logo.jpg를 placeholder로 사용
  const placeholderImage = isSteam
    ? "/images/steam_logo.jpg"
    : "/images/default_thumbnail.png";

  const [imgSrc, setImgSrc] = useState(
    deal.image_url || placeholderImage
  );

  useEffect(() => {
    setImgSrc(deal.image_url || placeholderImage);
  }, [deal.image_url, placeholderImage]);

  const handleImageError = () => {
    setImgSrc(placeholderImage);
  };

  // 할인 종료일자 포맷 함수
  const formatEndDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return null;
    }
  };

  // 리뷰 점수 텍스트 포맷 함수
  const getReviewText = (meta: DealProps["steamMeta"]) => {
    if (!meta || meta.total_reviews === 0) return null;
    return `${meta.positive_review_percent}% - ${meta.review_summary} (${formatPrice(
      meta.total_reviews
    )}개)`;
  };

  // 할인율에 따른 뱃지 색상 결정
  const getDiscountBadgeColor = (rate: number) => {
    if (rate >= 75) return "bg-purple-600";
    if (rate >= 50) return "bg-red-600";
    if (rate >= 25) return "bg-orange-500";
    return "bg-blue-500";
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

          {/* 플랫폼 뱃지 (좌측 상단) */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide z-10">
            {deal.platform}
          </div>

          {/* 할인율 뱃지 (우측 상단) */}
          <div
            className={`absolute top-2 right-2 ${getDiscountBadgeColor(
              deal.discount_rate
            )} text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg z-10`}
          >
            -{deal.discount_rate}%
          </div>
        </div>

        {/* 텍스트 정보 영역 */}
        <div className="p-3 flex flex-col flex-grow">
          {/* 타이틀 */}
          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-3 group-hover:text-red-600 transition-colors">
            {deal.title}
          </h3>

          {/* Steam 리뷰 */}
          {isSteam && deal.steamMeta && getReviewText(deal.steamMeta) && (
            <div className="mb-2 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
              <span className="font-semibold text-blue-600">리뷰: </span>
              {getReviewText(deal.steamMeta)}
            </div>
          )}

          <div className="mt-auto">
            {/* 가격 정보 */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-gray-400 line-through">
                  ₩{formatPrice(deal.regular_price)}
                </span>
                <span className="text-red-600 font-bold text-xs bg-red-50 px-1.5 py-0.5 rounded">
                  {deal.discount_rate}% 할인
                </span>
              </div>
              <div className="text-xl font-extrabold text-green-600">
                ₩{formatPrice(deal.sale_price)}
              </div>
            </div>

            {/* 종료일 */}
            {deal.end_date && formatEndDate(deal.end_date) && (
              <div className="text-[10px] text-gray-500 mb-2">
                <span className="font-semibold text-red-500">할인 종료: </span>
                {formatEndDate(deal.end_date)}
              </div>
            )}

            {/* 버튼 */}
            <div className="w-full text-center bg-red-50 group-hover:bg-red-100 text-red-700 text-xs font-bold py-2.5 rounded transition-colors">
              할인가로 구매하기
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default SaleDealCard;
