import type { PharmacyRegion } from "./enums"

export type GetPharmaciesParams = {
  region?: PharmacyRegion
  lowBalance?: boolean
  keyword?: string
  page?: number
  size?: number
}
