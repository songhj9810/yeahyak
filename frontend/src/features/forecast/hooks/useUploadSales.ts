import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { uploadSales } from "../api/uploadSales"

export const useUploadSales = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadSales,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.forecast.lastUpload(),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.pharmacyStock.all() })
    },
  })
}
