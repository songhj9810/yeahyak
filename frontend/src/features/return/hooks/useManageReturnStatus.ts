import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import {
  approveReturn,
  completeReturn,
  processReturn,
  rejectReturn,
} from "../api/manageReturnStatus"

export const useApproveReturn = (returnId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => approveReturn(returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.return.all() })
      // queryClient.invalidateQueries({ queryKey: queryKeys.pharmacyStock.all() })
    },
  })
}

export const useRejectReturn = (returnId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rejectReason: string) =>
      rejectReturn(returnId, { rejectReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.return.all() })
    },
  })
}

export const useProcessReturn = (returnId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => processReturn(returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.return.all() })
    },
  })
}

export const useCompleteReturn = (returnId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => completeReturn(returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.return.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.hqStock.all() })
      // queryClient.invalidateQueries({ queryKey: queryKeys.pharmacyStock.all() })
    },
  })
}
