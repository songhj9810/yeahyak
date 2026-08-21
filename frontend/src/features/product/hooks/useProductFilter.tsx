import { useSearchParams } from "react-router-dom"

import type { ProductMainCategory, ProductSubCategory } from "../types/enums"

export function useProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  const mainCategory =
    (searchParams.get("mainCategory") as ProductMainCategory) || "ETC"
  const subCategory =
    (searchParams.get("subCategory") as ProductSubCategory | "all") || "all"
  const keyword = searchParams.get("keyword") || undefined
  const page = Number(searchParams.get("page") || 0)

  const setFilter = (updates: {
    mainCategory?: ProductMainCategory
    subCategory?: ProductSubCategory | "all"
    keyword?: string
    page?: number
  }) => {
    // 대분류 변경
    if (updates.mainCategory !== undefined) {
      const next = new URLSearchParams()
      next.set("mainCategory", updates.mainCategory)
      next.set("subCategory", "all")
      next.set("page", "0")
      setSearchParams(next, { replace: true })
      return
    }

    const next = new URLSearchParams(searchParams)

    // 소분류 변경
    if (updates.subCategory !== undefined) {
      next.set("subCategory", updates.subCategory)
      next.set("page", "0")
    }

    // 키워드 검색
    if ("keyword" in updates) {
      if (!updates.keyword) next.delete("keyword")
      else next.set("keyword", updates.keyword)
      next.set("page", "0")
    }

    // 페이지 이동
    if (updates.page !== undefined) {
      next.set("page", String(updates.page))
    }

    setSearchParams(next, { replace: true })
  }

  return { mainCategory, subCategory, keyword, page, setFilter }
}
