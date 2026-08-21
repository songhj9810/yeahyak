import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import {
  getMyWallet,
  getMyWalletTxs,
  getWallet,
  getWalletTxs,
} from "../api/getWallet"
import type { GetWalletTxsParams } from "../types/params"

export const useMyWallet = () => {
  return useQuery({
    queryKey: queryKeys.wallet.me(),
    queryFn: getMyWallet,
  })
}

export const useMyWalletTxs = (params: GetWalletTxsParams) => {
  return useQuery({
    queryKey: queryKeys.wallet.myTxList(params),
    queryFn: () => getMyWalletTxs(params),
  })
}

export const useWallet = (pharmacyId: number) => {
  return useQuery({
    queryKey: queryKeys.wallet.detail(pharmacyId),
    queryFn: () => getWallet(pharmacyId),
    enabled: !!pharmacyId,
  })
}

export const useWalletTxs = (
  pharmacyId: number,
  params: GetWalletTxsParams
) => {
  return useQuery({
    queryKey: queryKeys.wallet.txList(pharmacyId, params),
    queryFn: () => getWalletTxs(pharmacyId, params),
    enabled: !!pharmacyId,
  })
}
