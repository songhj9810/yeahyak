import type { PharmacyRegion } from "@/features/pharmacy"

import type { ReturnStatus } from "./enums"

export type GetReturnsParams = {
  region?: PharmacyRegion
  status?: ReturnStatus
  start?: string
  end?: string
  page?: number
  size?: number
}

export type GetMyReturnsParams = {
  status?: ReturnStatus
  start?: string
  end?: string
  page?: number
  size?: number
}
