import { apiClient } from "@/shared/api/client"

import type { PharmacyUpdateRequest } from "../types/dto"

export const updatePharmacy = async (
  body: PharmacyUpdateRequest
): Promise<void> => {
  await apiClient.patch("/pharmacies/me", body)
}
