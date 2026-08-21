import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { getHqStock, getHqStocks, getHqStockTxs } from "../api/getHqInventory"
import type { GetHqStocksParams, GetHqStockTxsParams } from "../types/params"

export const useHqStock = (hqStockId: number | undefined) => {
  return useQuery({
    queryKey: queryKeys.hqStock.detail(hqStockId),
    queryFn: () => getHqStock(hqStockId!),
    enabled: !!hqStockId,
  })
}

export const useHqStocks = (params: GetHqStocksParams) => {
  return useQuery({
    queryKey: queryKeys.hqStock.list(params),
    queryFn: () => getHqStocks(params),
  })
}

export const useHqStockTxs = (
  hqStockId: number | undefined,
  params: GetHqStockTxsParams
) => {
  return useQuery({
    queryKey: queryKeys.hqStock.txList(hqStockId, params),
    queryFn: () => getHqStockTxs(hqStockId!, params),
    enabled: !!hqStockId,
  })
}
