import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import {
  cancelOrder,
  completeOrder,
  processOrder,
} from "../api/manageOrderStatus"

export const useCancelOrder = (orderId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.hqStock.all() })
    },
  })
}

export const useProcessOrder = (orderId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => processOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order.all() })
    },
  })
}

export const useCompleteOrder = (orderId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => completeOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order.all() })
      // queryClient.invalidateQueries({ queryKey: queryKeys.pharmacyStock.all() })
    },
  })
}
