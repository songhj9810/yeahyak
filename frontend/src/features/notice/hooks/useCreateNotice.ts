import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"
import { PATHS } from "@/shared/config/paths"

import { createNotice } from "../api/createNotice"
import type { NoticeCreateRequest } from "../types/dto"

export const useCreateNotice = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      request,
      files,
    }: {
      request: NoticeCreateRequest
      files?: File[]
    }) => createNotice(request, files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notice.all() })
      navigate(PATHS.HQ.NOTICES.DETAIL(data.id))
    },
  })
}
