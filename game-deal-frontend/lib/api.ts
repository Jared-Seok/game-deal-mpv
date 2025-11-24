// lib/api.ts

// 1. 메타데이터 타입 정의 추가
export interface XboxMetadata {
  game_pass_tier: string;
  is_day_one: boolean;
  removal_date?: string;
}

export interface EpicMetadata {
  is_free_to_keep: boolean;
}

// 2. Deal 인터페이스에 메타데이터 속성(옵션) 추가
export interface Deal {
  id: number;
  platform: string;
  title: string;
  url: string;
  regular_price: number;
  sale_price: number;
  discount_rate: number;
  deal_type: "Sale" | "Free" | "GamePass";
  end_date: string | null;
  is_active: boolean;
  image_url?: string | null;

  // 추가된 필드
  xboxMeta?: XboxMetadata;
  epicMeta?: EpicMetadata;
}

export async function fetchAllDeals(): Promise<Deal[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const DEALS_ENDPOINT = `${API_BASE_URL}/api/v1/deals`;

  console.log(`Fetching deals from: ${DEALS_ENDPOINT}`);
  try {
    const res = await fetch(DEALS_ENDPOINT, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API Fetch Error:", res.statusText);
      return [];
    }

    const data: Deal[] = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return [];
  }
}
