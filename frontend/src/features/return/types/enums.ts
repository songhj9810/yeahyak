export type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"

// 한글 매핑
export const RETURN_STATUS_LABEL: Record<ReturnStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "거절",
  PROCESSING: "처리",
  COMPLETED: "완료",
}
