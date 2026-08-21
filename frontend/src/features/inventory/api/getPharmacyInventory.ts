import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type {
  PharmacyStockResponse,
  PharmacyStockTxResponse,
} from "../types/dto"
import type {
  GetPharmacyStocksParams,
  GetPharmacyStockTxsParams,
} from "../types/params"

export const getPharmacyStock = async (
  pharmacyStockId: number
): Promise<PharmacyStockResponse> => {
  const response = await apiClient.get<ApiResponse<PharmacyStockResponse>>(
    `/stocks/me/${pharmacyStockId}`
  )
  return response.data.data
}

export const getPharmacyStocks = async (
  params: GetPharmacyStocksParams
): Promise<PageResponse<PharmacyStockResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<PharmacyStockResponse>>
  >("/stocks/me", { params })
  return response.data.data
}

export const getPharmacyStockTxs = async (
  pharmacyStockId: number,
  params: GetPharmacyStockTxsParams
): Promise<PageResponse<PharmacyStockTxResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<PharmacyStockTxResponse>>
  >(`/stocks/me/${pharmacyStockId}/transactions`, { params })
  return response.data.data
}
