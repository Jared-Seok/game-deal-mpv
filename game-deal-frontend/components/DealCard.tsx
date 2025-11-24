// game-deal-frontend/components/DealCard.tsx

"use client";

// 🚨 [수정 1] Deal 타입은 lib/api에서 가져옵니다.
import { Deal } from "../lib/api";
import FreeDealCard from "./cards/FreeDealCard";
import SubDealCard from "./cards/SubDealCard";
import SaleDealCard from "./cards/SaleDealCard";

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export default function DealCard({ deal, className = "" }: DealCardProps) {
  // 1. [최우선] 무료 배포 게임인지 확인
  // 🚨 [수정 2] deal.epicMeta -> deal.epic_meta 로 속성명 통일
  const isFreeGame =
    deal.deal_type === "Free" ||
    (deal.sale_price === 0 && deal.deal_type !== "GamePass") ||
    deal.epic_meta?.is_free_to_keep === true; // <- epic_meta로 변경

  if (isFreeGame) {
    return <FreeDealCard deal={deal} className={className} />;
  }

  // 2. [차순위] 구독 서비스(GamePass) 확인
  // 🚨 [수정 3] deal.xboxMeta -> deal.xbox_meta 로 속성명 통일
  const isGamePass =
    deal.deal_type === "GamePass" ||
    deal.platform.includes("Xbox") ||
    deal.xbox_meta !== undefined; // <- xbox_meta로 변경

  if (isGamePass) {
    return <SubDealCard deal={deal} className={className} />;
  }

  // 3. [기본] 일반 할인 게임
  return <SaleDealCard deal={deal} className={className} />;
}
