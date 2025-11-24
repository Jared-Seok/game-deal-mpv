// game-deal-frontend/lib/utils.ts

/**
 * 숫자를 한국 원화(₩) 형식에 맞게 콤마로 포맷합니다.
 * @param price 가격 (number)
 * @returns 포맷된 문자열 (string)
 */
export const formatPrice = (price: number): string => {
  if (typeof price !== "number" || isNaN(price)) {
    return "0";
  }
  // 정수 부분에 콤마를 찍는 한국식 포맷
  return price.toLocaleString("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
