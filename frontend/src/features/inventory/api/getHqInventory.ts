import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type { HqStockResponse, HqStockTxResponse } from "../types/dto"
import type { GetHqStocksParams, GetHqStockTxsParams } from "../types/params"

export const getHqStock = async (
  hqStockId: number
): Promise<HqStockResponse> => {
  const response = await apiClient.get<ApiResponse<HqStockResponse>>(
    `/stocks/hq/${hqStockId}`
  )
  return response.data.data
}

export const getHqStocks = async (
  params: GetHqStocksParams
): Promise<PageResponse<HqStockResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<HqStockResponse>>
  >("/stocks/hq", { params })
  return response.data.data
}

export const getHqStockTxs = async (
  hqStockId: number,
  params: GetHqStockTxsParams
): Promise<PageResponse<HqStockTxResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<HqStockTxResponse>>
  >(`/stocks/hq/${hqStockId}/transactions`, { params })
  return response.data.data
}
