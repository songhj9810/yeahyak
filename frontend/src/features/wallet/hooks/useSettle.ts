import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { settle } from "../api/settle"

export const useSettle = (pharmacyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => settle(pharmacyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.detail(pharmacyId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.pharmacy.all() }) // 최근 정산일이 변경되므로 약국 캐시 무효화
    },
  })
}
