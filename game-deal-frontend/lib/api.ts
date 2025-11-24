// game-deal-frontend/lib/api.ts

export interface XboxMetadata {
  game_pass_tier: string;
  is_day_one: boolean;
  removal_date?: string;
}

export interface EpicMetadata {
  is_free_to_keep: boolean;
}

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
  xboxMeta?: XboxMetadata;
  epicMeta?: EpicMetadata;
}

interface FetchDealsParams {
  page?: number;
  limit?: number;
  type?: "free" | "sub" | "sale"; // 카테고리 필터 추가
  platform?: string;
  search?: string;
}

export async function fetchDeals(
  params: FetchDealsParams = {}
): Promise<Deal[]> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const url = new URL(`${API_BASE_URL}/api/v1/deals`);

  if (params.page) url.searchParams.append("page", params.page.toString());
  if (params.limit) url.searchParams.append("limit", params.limit.toString());
  if (params.type) url.searchParams.append("type", params.type);
  if (params.platform) url.searchParams.append("platform", params.platform);
  if (params.search) url.searchParams.append("search", params.search);

  console.log(`Fetching deals from: ${url.toString()}`);

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });

    if (!res.ok) {
      console.error("API Fetch Error:", res.statusText);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return [];
  }
}
