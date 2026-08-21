import { apiClient } from "@/shared/api/client"

import type { AdminUpdateRequest } from "../types/dto"

export const updateAdmin = async (body: AdminUpdateRequest): Promise<void> => {
  await apiClient.patch("/admins/me", body)
}
