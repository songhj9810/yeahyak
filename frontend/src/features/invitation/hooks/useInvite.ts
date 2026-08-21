import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { invite } from "../api/invite"

export const useInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitation.all() })
    },
  })
}
