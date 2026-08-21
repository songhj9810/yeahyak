export type HqStockEvent =
  | "ORDER_OUT"
  | "CANCEL_IN"
  | "RETURN_ORDER_IN"
  | "ADJUST"

export type PharmacyStockEvent =
  | "ORDER_IN"
  | "RETURN_ORDER_OUT"
  | "SALE_OUT"
  | "ADJUST"

// 한글 매핑
export const HQ_STOCK_EVENT_LABEL: Record<HqStockEvent, string> = {
  ORDER_OUT: "출고",
  CANCEL_IN: "취소 입고",
  RETURN_ORDER_IN: "반품 입고",
  ADJUST: "조정",
}

export const PHARMACY_STOCK_EVENT_LABEL: Record<PharmacyStockEvent, string> = {
  ORDER_IN: "입고",
  RETURN_ORDER_OUT: "반품 출고",
  SALE_OUT: "판매 출고",
  ADJUST: "조정",
}
