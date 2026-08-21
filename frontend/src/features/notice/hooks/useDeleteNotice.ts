import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"
import { PATHS } from "@/shared/config/paths"

import { deleteNotice } from "../api/deleteNotice"

export const useDeleteNotice = (noticeId: number) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notice.all() })
      navigate(PATHS.HQ.NOTICES.LIST)
    },
  })
}
