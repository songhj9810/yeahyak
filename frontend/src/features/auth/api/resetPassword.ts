import { apiClient } from "@/shared/api/client"

import type { PasswordResetRequest } from "../types/dto"

export const resetPassword = async (
  body: PasswordResetRequest
): Promise<void> => {
  await apiClient.patch("/auth/password", body)
}
