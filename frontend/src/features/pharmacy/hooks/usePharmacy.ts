import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { getMyPharmacy, getPharmacies, getPharmacy } from "../api/getPharmacy"
import type { GetPharmaciesParams } from "../types/params"

export const useMyPharmacy = () => {
  return useQuery({
    queryKey: queryKeys.pharmacy.me(),
    queryFn: getMyPharmacy,
  })
}

export const usePharmacy = (pharmacyId: number) => {
  return useQuery({
    queryKey: queryKeys.pharmacy.detail(pharmacyId),
    queryFn: () => getPharmacy(pharmacyId),
    enabled: !!pharmacyId,
  })
}

export const usePharmacies = (params: GetPharmaciesParams) => {
  return useQuery({
    queryKey: queryKeys.pharmacy.list(params),
    queryFn: () => getPharmacies(params),
  })
}
