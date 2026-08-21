import { useSearchParams } from "react-router-dom"

import type {
  ProductMainCategory,
  ProductSubCategory,
} from "@/features/product"

export function useInventoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  const mainCategory =
    (searchParams.get("mainCategory") as ProductMainCategory | "all") || "all"
  const subCategory =
    (searchParams.get("subCategory") as ProductSubCategory | "all") || "all"
  const keyword = searchParams.get("keyword") || undefined
  const threshold = searchParams.get("threshold")
    ? Number(searchParams.get("threshold"))
    : undefined
  const page = Number(searchParams.get("page") || 0)

  const setFilter = (updates: {
    mainCategory?: ProductMainCategory | "all"
    subCategory?: ProductSubCategory | "all"
    keyword?: string
    threshold?: string
    page?: number
  }) => {
    // 대분류 및 소분류 변경 (전체 또는 대분류/전체 또는 대분류/소분류)
    if (updates.mainCategory !== undefined) {
      const next = new URLSearchParams()
      if (updates.mainCategory !== "all") {
        next.set("mainCategory", updates.mainCategory)
      }
      if (updates.subCategory && updates.subCategory !== "all") {
        next.set("subCategory", updates.subCategory)
      }
      next.set("page", "0")
      setSearchParams(next, { replace: true })
      return
    }

    const next = new URLSearchParams(searchParams)

    // 키워드 검색
    if ("keyword" in updates) {
      if (!updates.keyword) next.delete("keyword")
      else next.set("keyword", updates.keyword)
      next.set("page", "0")
    }

    // 임계값 설정
    if ("threshold" in updates) {
      if (!updates.threshold) next.delete("threshold")
      else next.set("threshold", updates.threshold)
      next.set("page", "0")
    }

    // 페이지 이동
    if (updates.page !== undefined) {
      next.set("page", String(updates.page))
    }

    setSearchParams(next, { replace: true })
  }

  return { mainCategory, subCategory, keyword, threshold, page, setFilter }
}
