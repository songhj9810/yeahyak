import type { UserRole } from "@/features/auth"

import type { InvitationStatus } from "./enums"

export type GetInvitationsParams = {
  role?: UserRole
  status?: InvitationStatus
  page?: number
  size?: number
}
