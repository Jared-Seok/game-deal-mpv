"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Deal } from "../../lib/api";

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export default function SubDealCard({ deal, className = "" }: DealCardProps) {
  // Determine subscription service type
  const isXboxGamePass = deal.deal_type === "GamePass";
  const isEAPlay = deal.deal_type === "Subscription" && deal.eaPlayMeta;

  // Get appropriate placeholder image
  const placeholderImage = isXboxGamePass
    ? "/images/gamepass_logo.jpg"
    : isEAPlay
    ? "/images/ea_play_logo.jpeg"
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

  // Get tier information
  const tierInfo = isXboxGamePass
    ? deal.xboxMeta?.game_pass_tier
    : deal.eaPlayMeta?.ea_play_tier;

  // Get service badge info
  const serviceBadge = isXboxGamePass
    ? { text: "GAME PASS", color: "green" }
    : { text: "EA PLAY", color: "orange" };

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

          {/* Tier badges on image */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {/* Day 1 badge for Xbox */}
            {isXboxGamePass && deal.xboxMeta?.is_day_one && (
              <div className="bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                Day 1
              </div>
            )}

            {/* Tier badges for EA Play */}
            {isEAPlay && deal.eaPlayMeta?.ea_play_tier && (
              <div className="flex flex-col gap-1">
                {deal.eaPlayMeta.ea_play_tier.split(',').map((tier, idx) => (
                  <div
                    key={idx}
                    className="bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm"
                  >
                    {tier.trim().toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className={`text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2 transition-colors ${
            serviceBadge.color === "green"
              ? "group-hover:text-green-600"
              : "group-hover:text-orange-600"
          }`}>
            {deal.title}
          </h3>

          <div className="mt-auto">
            {/* Service badge */}
            <div className="flex flex-wrap gap-1 mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                serviceBadge.color === "green"
                  ? "text-green-800 bg-green-100"
                  : "text-orange-800 bg-orange-100"
              }`}>
                {serviceBadge.text}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-full uppercase">
                {deal.platform}
              </span>
            </div>

            {/* Tier info */}
            <div className="mb-2">
              <span className={`text-xs font-extrabold uppercase block ${
                serviceBadge.color === "green"
                  ? "text-green-700"
                  : "text-orange-700"
              }`}>
                {tierInfo?.replace(/,/g, " · ") || "SUBSCRIPTION"}
              </span>
            </div>

            <div className={`w-full text-center text-xs font-bold py-1.5 rounded transition-colors ${
              serviceBadge.color === "green"
                ? "bg-green-50 group-hover:bg-green-100 text-green-800"
                : "bg-orange-50 group-hover:bg-orange-100 text-orange-800"
            }`}>
              플레이 하기
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
