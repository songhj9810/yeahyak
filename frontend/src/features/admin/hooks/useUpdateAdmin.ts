import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { updateAdmin } from "../api/updateAdmin"

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.me() })
    },
  })
}
