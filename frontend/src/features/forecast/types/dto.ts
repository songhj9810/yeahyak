import type {
  ProductMainCategory,
  ProductSubCategory,
} from "@/features/product"

export type LastSalesUploadResponse = {
  createdAt: string
  outdated: boolean
}

export type ForecastRequest = {
  forecastDays: number
}

export type ForecastResponse = {
  productId: number
  productName: string
  mainCategory: ProductMainCategory
  subCategory: ProductSubCategory
  manufacturer: string
  price: number
  imageUrl: string | null
  forecastQty: number
  currentStock: number
  recommendQty: number
}
