import { apiClient } from "@/shared/api/client"

import type { ReturnCreateRequest } from "../types/dto"

export const createReturn = async (
  body: ReturnCreateRequest
): Promise<void> => {
  await apiClient.post("/returns", body)
}
