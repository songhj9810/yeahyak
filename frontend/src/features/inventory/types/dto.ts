import type { ProductSubCategory } from "@/features/product"

import type { HqStockEvent, PharmacyStockEvent } from "./enums"

export type HqStockResponse = {
  id: number
  productId: number
  name: string
  kdCode: string
  subCategory: ProductSubCategory
  manufacturer: string
  unit: string | null
  price: number
  imageUrl: string | null
  stock: number
}

export type HqStockTxResponse = {
  id: number
  event: HqStockEvent
  quantity: number
  stockBefore: number
  stockAfter: number
  createdAt: string
  orderItemId: number | null
  returnOrderItemId: number | null
}

export type PharmacyStockResponse = {
  id: number
  productId: number
  name: string
  kdCode: string
  subCategory: ProductSubCategory
  manufacturer: string
  unit: string | null
  price: number
  imageUrl: string | null
  stock: number
}

export type PharmacyStockTxResponse = {
  id: number
  event: PharmacyStockEvent
  quantity: number
  stockBefore: number
  stockAfter: number
  saleDate: string | null
  createdAt: string
  orderItemId: number | null
  returnOrderItemId: number | null
}

export type StockAdjustRequest = {
  newStock: number
}
