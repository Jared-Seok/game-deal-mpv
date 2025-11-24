// game-deal-frontend/lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export interface EpicMetadata {
  is_free_to_keep: boolean;
}

export interface XboxMetadata {
  is_day_one: boolean;
  game_pass_tier: string;
  removal_date: string | null;
}

export interface SteamMetadata {
  review_summary: string;
  positive_review_percent: number;
  total_reviews: number;
}

export interface UbisoftMetadata {
  is_freeplay: boolean;
  has_giveaway_badge: boolean;
}

export interface Deal {
  id: number;
  platform: string;
  title: string;
  url: string;
  regular_price: number;
  sale_price: number;
  discount_rate: number;
  deal_type: "Free" | "Sale" | "GamePass" | string;
  image_url: string;
  end_date: string | null;
  is_active: boolean;
  epic_meta?: EpicMetadata;
  xbox_meta?: XboxMetadata;
  steam_meta?: SteamMetadata;
  ubi_meta?: UbisoftMetadata;
}

// 백엔드 응답 구조 타입 정의
interface ApiResponse {
  meta: any;
  data: Deal[];
}

export interface FetchDealsOptions {
  limit?: number;
  include_meta?: "true" | "false" | string;
}

export async function fetchDeals(
  category: string,
  options: FetchDealsOptions = {}
): Promise<Deal[]> {
  // [핵심 수정] category를 소문자로 강제 변환하여 전송
  const safeCategory = category ? category.toLowerCase().trim() : "";

  const params = new URLSearchParams({
    type: safeCategory,
    limit: options.limit ? options.limit.toString() : "1000",
    include_meta: options.include_meta || "false",
  });

  const url = `${API_BASE_URL}/deals?${params.toString()}`;

  try {
    // 캐시 문제 방지를 위해 revalidate 시간 조정 및 no-store 옵션 고려 가능
    const response = await fetch(url, { next: { revalidate: 0 } }); // 즉시 반영을 위해 0으로 설정 (테스트용)

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`);
    }

    const jsonResponse: ApiResponse = await response.json();
    return jsonResponse.data || [];
  } catch (error) {
    console.error("Fetch deals error:", error);
    return [];
  }
}
