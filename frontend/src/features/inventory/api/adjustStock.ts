import { apiClient } from "@/shared/api/client"

import type { StockAdjustRequest } from "../types/dto"

export const adjustHqStock = async (
  hqStockId: number,
  body: StockAdjustRequest
): Promise<void> => {
  await apiClient.patch(`/stocks/hq/${hqStockId}/adjust`, body)
}

export const adjustPharmacyStock = async (
  pharmacyStockId: number,
  body: StockAdjustRequest
): Promise<void> => {
  await apiClient.patch(`/stocks/me/${pharmacyStockId}/adjust`, body)
}
