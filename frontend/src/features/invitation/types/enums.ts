export type InvitationStatus = "PENDING" | "USED" | "EXPIRED"

// 한글 매핑
export const INVITATION_STATUS_LABEL: Record<InvitationStatus, string> = {
  PENDING: "대기중",
  USED: "사용됨",
  EXPIRED: "만료됨", // 프론트엔드에서 직접 계산
}
