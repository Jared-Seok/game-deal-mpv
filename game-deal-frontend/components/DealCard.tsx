// components/DealCard.tsx

import { useState, useEffect } from "react";
import { Deal } from "../lib/api";

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const isFree = deal.deal_type === "Free"; // Epic은 보통 Free 타입
  const isGamePass = deal.deal_type === "GamePass";

  // 1. 플랫폼별 기본 로고 결정 로직
  // public/images/ 폴더에 해당 파일들이 있어야 합니다.
  let defaultLogo = "/images/default_thumbnail.png"; // 최후의 수단

  if (deal.platform.includes("Epic") || deal.platform === "Epic Games Store") {
    defaultLogo = "/images/epic_logo.jpg";
  } else if (isGamePass || deal.platform.includes("Xbox")) {
    defaultLogo = "/images/gamepass_logo.jpg";
  }

  // 2. 이미지 상태 관리
  // 초기값: DB에 이미지 URL이 있으면 그것을, 없으면 위에서 결정한 로고를 사용
  const [imgSrc, setImgSrc] = useState(deal.image_url || defaultLogo);

  // 3. deal prop이 변경될 때마다 상태 업데이트 (리스트 렌더링 이슈 방지)
  useEffect(() => {
    setImgSrc(deal.image_url || defaultLogo);
  }, [deal.image_url, defaultLogo]);

  return (
    <a
      href={deal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
        {/* 이미지 렌더링 영역 */}
        <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
          <img
            src={imgSrc}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            // 4. 이미지 로딩 실패(엑박) 시 해당 플랫폼의 기본 로고로 교체
            onError={() => setImgSrc(defaultLogo)}
          />
        </div>

        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-4">
            {/* 플랫폼 배지 색상 구분 */}
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                isFree
                  ? "bg-gray-800 text-white" // Epic 스타일 (검정/하양)
                  : isGamePass
                  ? "bg-green-100 text-green-800" // Xbox 스타일 (초록)
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {deal.platform}
            </span>

            {/* 무료 배포 / 게임패스 태그 */}
            {isFree && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded ml-2">
                무료 배포
              </span>
            )}
            {isGamePass && (
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded ml-2">
                GAME PASS
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {deal.title}
          </h3>

          {deal.end_date && (
            <p className="text-sm text-gray-500 mb-4">
              종료일: {new Date(deal.end_date).toLocaleDateString("ko-KR")}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              ₩{deal.regular_price?.toLocaleString()}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {isFree
                ? "무료"
                : isGamePass
                ? "구독 포함"
                : `₩${deal.sale_price?.toLocaleString()}`}
            </span>
          </div>
          <span className="text-sm font-medium text-blue-600 group-hover:underline">
            보러 가기 →
          </span>
        </div>
      </div>
    </a>
  );
}
