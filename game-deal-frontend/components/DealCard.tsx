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
  // 1. [최우선] 무료 배포 게임인지 확인
  // deal_type이 Free이거나, 가격이 0원이면서 구독 서비스(GamePass)가 아닌 경우
  const isFreeGame =
    deal.deal_type === "Free" ||
    (deal.sale_price === 0 && deal.deal_type !== "GamePass") ||
    deal.epicMeta?.is_free_to_keep === true;

  if (isFreeGame) {
    return <FreeDealCard deal={deal} className={className} />;
  }

  // 2. [차순위] 구독 서비스(GamePass) 확인
  // 플랫폼 이름에 Xbox가 있거나 deal_type이 GamePass인 경우
  const isGamePass =
    deal.deal_type === "GamePass" ||
    deal.platform.includes("Xbox") ||
    deal.xboxMeta !== undefined;

  if (isGamePass) {
    return <SubDealCard deal={deal} className={className} />;
  }

  // 3. [기본] 일반 할인 게임
  return <SaleDealCard deal={deal} className={className} />;
}
