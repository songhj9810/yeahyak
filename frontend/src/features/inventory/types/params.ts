import type {
  ProductMainCategory,
  ProductSubCategory,
} from "@/features/product"

import type { HqStockEvent, PharmacyStockEvent } from "./enums"

export type GetHqStocksParams = {
  mainCategory?: ProductMainCategory
  subCategory?: ProductSubCategory
  keyword?: string
  threshold?: number
  page?: number
  size?: number
}

export type GetHqStockTxsParams = {
  event?: HqStockEvent
  start?: string
  end?: string
  page?: number
  size?: number
}

export type GetPharmacyStocksParams = {
  mainCategory?: ProductMainCategory
  subCategory?: ProductSubCategory
  keyword?: string
  threshold?: number
  page?: number
  size?: number
}

export type GetPharmacyStockTxsParams = {
  event?: PharmacyStockEvent
  start?: string
  end?: string
  page?: number
  size?: number
}
