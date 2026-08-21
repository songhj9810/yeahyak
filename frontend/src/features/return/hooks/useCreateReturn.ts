import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { createReturn } from "../api/createReturn"

export const useCreateReturn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReturn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.return.all() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.order.returnable(variables.orderId),
      })
    },
  })
}
