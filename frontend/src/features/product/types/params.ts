import type { ProductMainCategory, ProductSubCategory } from "./enums"

export type GetProductsParams = {
  mainCategory: ProductMainCategory
  subCategory?: ProductSubCategory
  keyword?: string
  page?: number
  size?: number
}
