import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { getLatestNotices, getNotice, getNotices } from "../api/getNotice"
import type { GetNoticesParams } from "../types/params"

export const useNotice = (noticeId: number) => {
  return useQuery({
    queryKey: queryKeys.notice.detail(noticeId),
    queryFn: () => getNotice(noticeId),
    enabled: !!noticeId,
  })
}

export const useNotices = (params: GetNoticesParams) => {
  return useQuery({
    queryKey: queryKeys.notice.list(params),
    queryFn: () => getNotices(params),
  })
}

export const useLatestNotices = () => {
  return useQuery({
    queryKey: queryKeys.notice.latest(),
    queryFn: getLatestNotices,
  })
}
