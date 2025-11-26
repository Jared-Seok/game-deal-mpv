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
  // deal_type을 최우선으로 체크 (DB에서 명시적으로 설정된 값)

  // 1. GamePass 구독 서비스 확인
  if (deal.deal_type === "GamePass") {
    return <SubDealCard deal={deal} className={className} />;
  }

  // 2. EA Play 및 기타 구독 서비스 확인
  if (deal.deal_type === "Subscription") {
    return <SubDealCard deal={deal} className={className} />;
  }

  // 3. 무료 배포 게임 확인
  if (deal.deal_type === "Free") {
    return <FreeDealCard deal={deal} className={className} />;
  }

  // 4. 할인 게임 확인 (Sale 타입 또는 할인율이 있는 경우)
  if (deal.deal_type === "Sale" || deal.discount_rate > 0) {
    return <SaleDealCard deal={deal} className={className} />;
  }

  // 5. 기타 경우 (폴백)
  return <SaleDealCard deal={deal} className={className} />;
}
