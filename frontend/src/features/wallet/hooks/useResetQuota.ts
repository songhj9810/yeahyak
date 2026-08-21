import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { resetQuota } from "../api/resetQuota"

export const useResetQuota = (pharmacyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newQuota: number) => resetQuota(pharmacyId, { newQuota }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.detail(pharmacyId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.pharmacy.all() })
    },
  })
}
