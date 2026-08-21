import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type {
  MyReturnListResponse,
  ReturnListResponse,
  ReturnResponse,
  ReturnStatisticsResponse,
} from "../types/dto"
import type { GetMyReturnsParams, GetReturnsParams } from "../types/params"

export const getReturnStatistics =
  async (): Promise<ReturnStatisticsResponse> => {
    const response = await apiClient.get<ApiResponse<ReturnStatisticsResponse>>(
      "/returns/statistics"
    )
    return response.data.data
  }

export const getReturn = async (
  returnOrderId: number
): Promise<ReturnResponse> => {
  const response = await apiClient.get<ApiResponse<ReturnResponse>>(
    `/returns/${returnOrderId}`
  )
  return response.data.data
}

export const getReturns = async (
  params: GetReturnsParams
): Promise<PageResponse<ReturnListResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<ReturnListResponse>>
  >("/returns", { params })
  return response.data.data
}

export const getMyReturns = async (
  params: GetMyReturnsParams
): Promise<PageResponse<MyReturnListResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<MyReturnListResponse>>
  >("/returns/me", { params })
  return response.data.data
}
