export type NoticeCategory = "GENERAL" | "PRODUCT" | "REGULATION" | "EPIDEMIC"

// 한글 매핑
export const NOTICE_CATEGORY_LABEL: Record<NoticeCategory, string> = {
  GENERAL: "안내",
  PRODUCT: "상품",
  REGULATION: "법령",
  EPIDEMIC: "감염병",
}
