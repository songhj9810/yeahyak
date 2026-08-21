import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"
import { PATHS } from "@/shared/config/paths"

import { updateNotice } from "../api/updateNotice"
import type { NoticeUpdateRequest } from "../types/dto"

export const useUpdateNotice = (noticeId: number) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      request,
      files,
    }: {
      request: NoticeUpdateRequest
      files?: File[]
    }) => updateNotice(noticeId, request, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notice.all() })
      navigate(PATHS.HQ.NOTICES.DETAIL(noticeId))
    },
  })
}
