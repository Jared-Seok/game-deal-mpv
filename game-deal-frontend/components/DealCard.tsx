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
  // 1. 구독(GamePass/Xbox) 여부 확인
  const isGamePass =
    deal.deal_type === "GamePass" ||
    deal.platform.includes("Xbox") ||
    deal.xboxMeta !== undefined;

  if (isGamePass) {
    return <SubDealCard deal={deal} className={className} />;
  }

  // 2. 무료 배포 게임 여부 확인 (GamePass 제외)
  const isFreeGame =
    deal.deal_type === "Free" ||
    deal.sale_price === 0 ||
    deal.epicMeta?.is_free_to_keep === true;

  if (isFreeGame) {
    return <FreeDealCard deal={deal} className={className} />;
  }

  // 3. 그 외는 일반 할인/판매 게임
  return <SaleDealCard deal={deal} className={className} />;
}
