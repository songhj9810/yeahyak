export type AdminDepartment =
  | "MANAGEMENT"
  | "PHARMACY"
  | "LOGISTICS"
  | "FINANCE"
  | "IT"

// 한글 매핑
export const ADMIN_DEPARTMENT_LABEL: Record<AdminDepartment, string> = {
  MANAGEMENT: "경영관리",
  PHARMACY: "약무관리",
  LOGISTICS: "물류유통",
  FINANCE: "재무회계",
  IT: "IT지원",
}
