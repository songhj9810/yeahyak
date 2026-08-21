import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type {
  MyOrderListResponse,
  OrderListResponse,
  OrderResponse,
  OrderStatisticsResponse,
  ReturnableOrderResponse,
} from "../types/dto"
import type { GetMyOrdersParams, GetOrdersParams } from "../types/params"

export const getOrderStatistics =
  async (): Promise<OrderStatisticsResponse> => {
    const response =
      await apiClient.get<ApiResponse<OrderStatisticsResponse>>(
        "/orders/statistics"
      )
    return response.data.data
  }

export const getOrder = async (orderId: number): Promise<OrderResponse> => {
  const response = await apiClient.get<ApiResponse<OrderResponse>>(
    `/orders/${orderId}`
  )
  return response.data.data
}

export const getOrders = async (
  params: GetOrdersParams
): Promise<PageResponse<OrderListResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<OrderListResponse>>
  >("/orders", { params })
  return response.data.data
}

export const getMyOrders = async (
  params: GetMyOrdersParams
): Promise<PageResponse<MyOrderListResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<MyOrderListResponse>>
  >("/orders/me", { params })
  return response.data.data
}

export const getReturnableOrder = async (
  orderId: number
): Promise<ReturnableOrderResponse> => {
  const response = await apiClient.get<ApiResponse<ReturnableOrderResponse>>(
    `/orders/${orderId}/returnable`
  )
  return response.data.data
}
