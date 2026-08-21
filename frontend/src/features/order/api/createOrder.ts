import { apiClient } from "@/shared/api/client"

import type { OrderCreateRequest } from "../types/dto"

export const createOrder = async (body: OrderCreateRequest): Promise<void> => {
  await apiClient.post("/orders", body)
}
