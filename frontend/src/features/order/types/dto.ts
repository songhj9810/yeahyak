import type { ProductSubCategory } from "@/features/product"

import type { OrderCanceledBy, OrderStatus } from "./enums"

export type OrderStatisticsResponse = {
  total: number
  processing: number
  completed: number
  totalAmount: number
}

export type OrderItemResponse = {
  id: number
  productId: number
  name: string
  subCategory: ProductSubCategory
  imageUrl: string | null
  price: number
  quantity: number
  totalPrice: number
}

export type OrderResponse = {
  id: number
  status: OrderStatus
  canceledBy: OrderCanceledBy | null // 취소되지 않았으면 null
  orderItems: OrderItemResponse[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export type OrderListResponse = {
  id: number
  pharmacyId: number
  pharmacyName: string
  status: OrderStatus
  summary: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export type MyOrderListResponse = {
  id: number
  status: OrderStatus
  summary: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export type ReturnableOrderItemResponse = {
  id: number
  productId: number
  name: string
  subCategory: ProductSubCategory
  imageUrl: string | null
  price: number
  orderedQuantity: number
  returnableQuantity: number
}

export type ReturnableOrderResponse = {
  id: number
  orderItems: ReturnableOrderItemResponse[]
}

export type OrderItemRequest = {
  productId: number
  quantity: number
}

export type OrderCreateRequest = {
  orderItems: OrderItemRequest[]
}
