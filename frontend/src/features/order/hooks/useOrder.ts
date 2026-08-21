import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import {
  getMyOrders,
  getOrder,
  getOrders,
  getOrderStatistics,
  getReturnableOrder,
} from "../api/getOrder"
import type { GetMyOrdersParams, GetOrdersParams } from "../types/params"

export const useOrderStatistics = () => {
  return useQuery({
    queryKey: queryKeys.order.statistics(),
    queryFn: getOrderStatistics,
  })
}

export const useOrder = (orderId: number) => {
  return useQuery({
    queryKey: queryKeys.order.detail(orderId),
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  })
}

export const useOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: queryKeys.order.list(params),
    queryFn: () => getOrders(params),
  })
}

export const useMyOrders = (params: GetMyOrdersParams) => {
  return useQuery({
    queryKey: queryKeys.order.myList(params),
    queryFn: () => getMyOrders(params),
  })
}

export const useReturnableOrder = (orderId: number | undefined) => {
  return useQuery({
    queryKey: queryKeys.order.returnable(orderId),
    queryFn: () => getReturnableOrder(orderId!),
    enabled: !!orderId,
  })
}
