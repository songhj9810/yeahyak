import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { getProduct, getProducts } from "../api/getProduct"
import type { GetProductsParams } from "../types/params"

export const useProduct = (productId: number) => {
  return useQuery({
    queryKey: queryKeys.product.detail(productId),
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  })
}

export const useProducts = (params: GetProductsParams) => {
  return useQuery({
    queryKey: queryKeys.product.list(params),
    queryFn: () => getProducts(params),
  })
}
