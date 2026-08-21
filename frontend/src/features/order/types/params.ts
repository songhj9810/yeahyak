import type { PharmacyRegion } from "@/features/pharmacy"

import type { OrderStatus } from "./enums"

export type GetOrdersParams = {
  region?: PharmacyRegion
  status?: OrderStatus
  start?: string
  end?: string
  page?: number
  size?: number
}

export type GetMyOrdersParams = {
  status?: OrderStatus
  start?: string
  end?: string
  page?: number
  size?: number
}
