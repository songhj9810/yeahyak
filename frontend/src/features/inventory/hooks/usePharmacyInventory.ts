import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import {
  getPharmacyStock,
  getPharmacyStocks,
  getPharmacyStockTxs,
} from "../api/getPharmacyInventory"
import type {
  GetPharmacyStocksParams,
  GetPharmacyStockTxsParams,
} from "../types/params"

export const usePharmacyStock = (pharmacyStockId: number | undefined) => {
  return useQuery({
    queryKey: queryKeys.pharmacyStock.detail(pharmacyStockId),
    queryFn: () => getPharmacyStock(pharmacyStockId!),
    enabled: !!pharmacyStockId,
  })
}

export const usePharmacyStocks = (params: GetPharmacyStocksParams) => {
  return useQuery({
    queryKey: queryKeys.pharmacyStock.list(params),
    queryFn: () => getPharmacyStocks(params),
  })
}

export const usePharmacyStockTxs = (
  pharmacyStockId: number | undefined,
  params: GetPharmacyStockTxsParams
) => {
  return useQuery({
    queryKey: queryKeys.pharmacyStock.txList(pharmacyStockId, params),
    queryFn: () => getPharmacyStockTxs(pharmacyStockId!, params),
    enabled: !!pharmacyStockId,
  })
}
