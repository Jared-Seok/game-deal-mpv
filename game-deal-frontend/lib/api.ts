// game-deal-frontend/lib/api.ts

// 메타데이터 인터페이스 정의
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

// 🚨 Deal 핵심 인터페이스 정의
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

  // 플랫폼별 메타데이터 (백엔드 필드명과 동일한 snake_case 사용)
  epic_meta?: EpicMetadata;
  xbox_meta?: XboxMetadata;
  steam_meta?: SteamMetadata;
  ubi_meta?: UbisoftMetadata;
}

interface FetchDealsOptions {
  limit?: number;
  include_meta?: "true" | "false" | string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// 🚨 [수정] API 호출 함수: 메타데이터 옵션 처리 로직 포함
export async function fetchDeals(
  category: string,
  options: FetchDealsOptions = {}
): Promise<Deal[]> {
  const params = new URLSearchParams({
    type: category,
    limit: options.limit ? options.limit.toString() : "1000",
    // include_meta=true를 쿼리 파라미터로 전달
    include_meta: options.include_meta || "false",
  });

  const url = `${API_BASE_URL}/deals?${params.toString()}`;

  const response = await fetch(url, { next: { revalidate: 60 * 60 } }); // 1시간마다 데이터 갱신 시도

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`);
  }

  const data: Deal[] = await response.json();
  return data;
}
