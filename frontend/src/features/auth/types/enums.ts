export type UserRole = "ADMIN" | "PHARMACY"

// 한글 매핑
export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "관리자",
  PHARMACY: "약국",
}
