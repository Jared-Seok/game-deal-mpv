// game-deal-frontend/components/cards/SaleDealCard.tsx

import Link from "next/link";
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
  steam_meta?: {
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
  // <- props 구조 분해 할당 수정
  const isSteam = deal.platform === "Steam";

  // 할인 종료일자 포맷 함수 (생략)
  const formatEndDate = (dateStr: string | null) => {
    if (!dateStr) return "종료일 미정";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "날짜 형식 오류";
    }
  };

  // 리뷰 점수 텍스트 포맷 함수 (생략)
  const getReviewText = (meta: DealProps["steam_meta"]) => {
    if (!meta || meta.total_reviews === 0) return "리뷰 정보 없음";
    return `${meta.positive_review_percent}% - ${
      meta.review_summary
    } (${formatPrice(meta.total_reviews)}개)`;
  };

  return (
    // 🚨 [수정 2] 최상위 div에 className을 적용하여 DealCard로부터 받은 스타일을 사용합니다.
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl ${className}`}
    >
      <div className="relative h-40">
        <img
          src={deal.image_url}
          alt={deal.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          -{deal.discount_rate}%
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
          {deal.title}
        </h3>

        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
            정가: ₩{formatPrice(deal.regular_price)}
          </p>
          <p className="text-2xl font-extrabold text-green-500">
            ₩{formatPrice(deal.sale_price)}
          </p>
        </div>

        {isSteam && (
          <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-blue-500">유저 리뷰: </span>
            {getReviewText(deal.steam_meta)}
          </div>
        )}

        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-red-500">종료일: </span>
          {formatEndDate(deal.end_date)}
        </div>

        <div className="mt-auto">
          <Link
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            {deal.platform} 페이지 바로가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SaleDealCard;
