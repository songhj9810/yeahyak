import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { updatePharmacy } from "../api/updatePharmacy"

export const useUpdatePharmacy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePharmacy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pharmacy.me() })
    },
  })
}
