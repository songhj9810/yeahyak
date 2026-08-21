import { apiClient } from "@/shared/api/client"

import type { InvitationCreateRequest } from "../types/dto"

export const invite = async (body: InvitationCreateRequest): Promise<void> => {
  await apiClient.post("/invitations", body)
}
