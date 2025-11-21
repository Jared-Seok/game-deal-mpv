// 딜 데이터의 타입을 정의합니다. (TypeScript 필수)
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

    // JSON 응답을 Deal[] 타입으로 명시합니다.`
    const data: Deal[] = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return [];
  }
}
