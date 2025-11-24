"use client";

import { Deal } from "../lib/api";
import FreeDealCard from "./cards/FreeDealCard";
import SubDealCard from "./cards/SubDealCard";
import SaleDealCard from "./cards/SaleDealCard";

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export default function DealCard({ deal, className = "" }: DealCardProps) {
  // 🚨 [우선순위 1] 무료 배포 게임 여부를 가장 먼저 확인
  // 플랫폼이 Xbox라도 가격이 0원이고 deal_type이 GamePass가 아니면 '무료 배포'로 취급
  const isFreeGame =
    deal.deal_type === "Free" ||
    (deal.sale_price === 0 && deal.deal_type !== "GamePass") ||
    deal.epicMeta?.is_free_to_keep === true;

  if (isFreeGame) {
    return <FreeDealCard deal={deal} className={className} />;
  }

  // 🚨 [우선순위 2] 그 다음 구독 서비스 확인
  const isGamePass =
    deal.deal_type === "GamePass" ||
    deal.platform.includes("Xbox") ||
    deal.xboxMeta !== undefined;

  if (isGamePass) {
    return <SubDealCard deal={deal} className={className} />;
  }

  // [우선순위 3] 나머지는 일반 할인
  return <SaleDealCard deal={deal} className={className} />;
}
