import type { PharmacyRegion } from "./enums"

export type PharmacyResponse = {
  id: number
  email: string
  brn: string
  representative: string
  name: string
  postcode: string
  address: string
  addressDetails: string | null
  region: PharmacyRegion
  contact: string | null
  balance: number
  quota: number
  lastSettledAt: string | null
  createdAt: string
  updatedAt: string
}

export type PharmacyListResponse = {
  id: number
  name: string
  address: string
  region: PharmacyRegion
  contact: string | null
  balance: number
  quota: number
  lastSettledAt: string | null
}

export type PharmacyUpdateRequest = {
  newRepresentative?: string
  newName?: string
  newPostcode?: string
  newAddress?: string
  newAddressDetails?: string
  newRegion?: PharmacyRegion
  newContact?: string
}
