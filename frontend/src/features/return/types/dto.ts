import type { ProductSubCategory } from "@/features/product"

import type { ReturnStatus } from "./enums"

export type ReturnStatisticsResponse = {
  total: number
  processing: number
  completed: number
  totalAmount: number
}

export type ReturnItemResponse = {
  id: number
  productId: number
  name: string
  subCategory: ProductSubCategory
  imageUrl: string | null
  price: number
  quantity: number
  totalPrice: number
}

export type ReturnResponse = {
  id: number
  orderId: number
  returnReason: string | null
  status: ReturnStatus
  rejectReason: string | null // 거절되지 않았으면 null
  returnItems: ReturnItemResponse[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export type ReturnListResponse = {
  id: number
  pharmacyId: number
  pharmacyName: string
  status: ReturnStatus
  summary: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export type MyReturnListResponse = {
  id: number
  status: ReturnStatus
  summary: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export type ReturnItemRequest = {
  orderItemId: number
  quantity: number
}

export type ReturnCreateRequest = {
  orderId: number
  returnReason?: string
  returnOrderItems: ReturnItemRequest[]
}

export type ReturnRejectRequest = {
  rejectReason: string
}
