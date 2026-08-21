import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import {
  getMyReturns,
  getReturn,
  getReturns,
  getReturnStatistics,
} from "../api/getReturn"
import type { GetMyReturnsParams, GetReturnsParams } from "../types/params"

export const useReturnStatistics = () => {
  return useQuery({
    queryKey: queryKeys.return.statistics(),
    queryFn: getReturnStatistics,
  })
}

export const useReturn = (returnId: number) => {
  return useQuery({
    queryKey: queryKeys.return.detail(returnId),
    queryFn: () => getReturn(returnId),
    enabled: !!returnId,
  })
}

export const useReturns = (params: GetReturnsParams) => {
  return useQuery({
    queryKey: queryKeys.return.list(params),
    queryFn: () => getReturns(params),
  })
}

export const useMyReturns = (params: GetMyReturnsParams) => {
  return useQuery({
    queryKey: queryKeys.return.myList(params),
    queryFn: () => getMyReturns(params),
  })
}
