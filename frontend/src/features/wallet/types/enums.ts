export type WalletEvent = "DEDUCT" | "REFUND" | "CANCEL" | "SETTLE"

// 한글 매핑
export const WALLET_EVENT_LABEL: Record<WalletEvent, string> = {
  DEDUCT: "발주 차감",
  REFUND: "반품 환불",
  CANCEL: "취소 환불",
  SETTLE: "정산",
}
