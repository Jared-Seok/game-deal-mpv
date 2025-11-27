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

export interface EAPlayMetadata {
  is_ea_play: boolean;
  ea_play_tier: string;
  platform_availability: string;
  removal_date: string | null;
}

export interface Deal {
  id: number;
  platform: string;
  title: string;
  url: string;
  regular_price: number;
  sale_price: number;
  discount_rate: number;
  deal_type: "Free" | "Sale" | "GamePass" | "Subscription" | string;
  image_url: string;
  end_date: string | null;
  is_active: boolean;
  epicMeta?: EpicMetadata;
  xboxMeta?: XboxMetadata;
  steamMeta?: SteamMetadata;
  ubiMeta?: UbisoftMetadata;
  eaPlayMeta?: EAPlayMetadata;
}

// 백엔드 응답 구조 타입 정의
export interface ApiResponseMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface ApiResponse {
  meta: ApiResponseMeta;
  data: Deal[];
}

export interface FetchDealsOptions {
  limit?: number;
  page?: number;
  sort?: string;
  search?: string;
  min_reviews?: number; // 최소 리뷰 수 필터링 옵션 추가
}

export async function fetchDeals(
  category: string,
  options: FetchDealsOptions = {}
): Promise<{ deals: Deal[]; meta: ApiResponseMeta }> {
  const safeCategory = category ? category.toLowerCase().trim() : "";

  const params: Record<string, string> = {
    type: safeCategory,
    limit: options.limit ? options.limit.toString() : "20",
  };

  if (options.sort) {
    params.sort = options.sort;
  }
  if (options.page) {
    params.page = options.page.toString();
  }
  if (options.search) {
    params.search = options.search;
  }
  // min_reviews 옵션이 있으면 파라미터에 추가
  if (options.min_reviews) {
    params.min_reviews = options.min_reviews.toString();
  }

  const url = `${API_BASE_URL}/deals?${new URLSearchParams(params).toString()}`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`);
    }

    const jsonResponse: ApiResponse = await response.json();
    // 데이터와 메타 정보를 함께 반환
    return {
      deals: jsonResponse.data || [],
      meta: jsonResponse.meta || { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 20 },
    };
  } catch (error) {
    console.error("Fetch deals error:", error);
    return {
      deals: [],
      meta: { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 20 },
    };
  }
}
