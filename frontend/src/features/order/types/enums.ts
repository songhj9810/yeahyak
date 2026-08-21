export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELED"

export type OrderCanceledBy = "HQ" | "PHARMACY"

// 한글 매핑
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "대기",
  PROCESSING: "처리",
  COMPLETED: "완료",
  CANCELED: "취소",
}

export const ORDER_CANCELED_BY_LABEL: Record<OrderCanceledBy, string> = {
  HQ: "본사",
  PHARMACY: "약국",
}
