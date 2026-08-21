import type { ProductMainCategory, ProductSubCategory } from "./enums"

export type ProductResponse = {
  id: number
  name: string
  kdCode: string
  mainCategory: ProductMainCategory
  subCategory: ProductSubCategory
  manufacturer: string
  unit: string | null
  price: number
  description: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  stock: number
}

export type ProductListResponse = {
  id: number
  name: string
  manufacturer: string
  unit: string | null
  price: number
  imageUrl: string | null
}

export type ProductCreateRequest = {
  name: string
  kdCode: string
  mainCategory: ProductMainCategory
  subCategory: ProductSubCategory
  manufacturer: string
  unit?: string
  price: number
  description?: string
}

export type ProductCreateResponse = {
  id: number
}

export type ProductUpdateRequest = {
  newName?: string
  newMainCategory?: ProductMainCategory
  newSubCategory?: ProductSubCategory
  newManufacturer?: string
  newUnit?: string
  newPrice?: number
  newDescription?: string
  clearImage?: boolean
}
