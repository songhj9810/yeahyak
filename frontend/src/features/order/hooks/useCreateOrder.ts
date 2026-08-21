import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { createOrder } from "../api/createOrder"

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me() })
      // queryClient.invalidateQueries({ queryKey: queryKeys.hqStock.all() })
    },
  })
}
