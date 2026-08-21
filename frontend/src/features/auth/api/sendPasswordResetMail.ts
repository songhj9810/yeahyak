import { apiClient } from "@/shared/api/client"

import type { MailSendRequest } from "../types/dto"

export const sendPasswordResetMail = async (
  body: MailSendRequest
): Promise<void> => {
  await apiClient.post("/auth/password", body)
}
