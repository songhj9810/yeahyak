import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { adjustHqStock, adjustPharmacyStock } from "../api/adjustStock"

export const useAdjustHqStock = (hqStockId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newStock: number) => adjustHqStock(hqStockId, { newStock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hqStock.all() })
    },
  })
}

export const useAdjustPharmacyStock = (pharmacyStockId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newStock: number) =>
      adjustPharmacyStock(pharmacyStockId, { newStock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pharmacyStock.all() })
    },
  })
}
