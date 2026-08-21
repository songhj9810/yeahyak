import type { UserRole } from "@/features/auth"

import type { InvitationStatus } from "./enums"

export type InvitationResponse = {
  id: number
  email: string
  role: UserRole
  status: InvitationStatus
  createdAt: string
  expiresAt: string
  adminEmployeeId: string
  adminName: string
}

export type InvitationCreateRequest = {
  email: string
  role: UserRole
}
