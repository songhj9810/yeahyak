import { apiClient } from "@/shared/api/client"

import type { QuotaResetRequest } from "../types/dto"

export const resetQuota = async (
  pharmacyId: number,
  body: QuotaResetRequest
): Promise<void> => {
  await apiClient.patch(`/wallets/${pharmacyId}/quota`, body)
}
