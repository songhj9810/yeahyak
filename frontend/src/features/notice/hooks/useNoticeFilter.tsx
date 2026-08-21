import { useSearchParams } from "react-router-dom"

import type { NoticeCategory } from "../types/enums"

export function useNoticeFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = (searchParams.get("category") as NoticeCategory) || "GENERAL"
  const keyword = searchParams.get("keyword") || undefined
  const filter =
    (searchParams.get("filter") as "BOTH" | "TITLE" | "CONTENT") || "BOTH"
  const page = Number(searchParams.get("page") || 0)

  const setFilter = (updates: {
    category?: NoticeCategory
    keyword?: string
    pendingFilter?: "BOTH" | "TITLE" | "CONTENT"
    page?: number
  }) => {
    // 카테고리 변경
    if (updates.category !== undefined) {
      const next = new URLSearchParams()
      next.set("category", updates.category)
      next.set("page", "0")
      setSearchParams(next, { replace: true })
      return
    }

    const next = new URLSearchParams(searchParams)

    // 키워드 검색
    if ("keyword" in updates) {
      if (!updates.keyword) {
        next.delete("keyword")
        next.delete("filter")
      } else {
        next.set("keyword", updates.keyword)
        if (updates.pendingFilter) next.set("filter", updates.pendingFilter)
      }
      next.set("page", "0")
    }

    // 페이지 이동
    if (updates.page !== undefined) {
      next.set("page", String(updates.page))
    }

    setSearchParams(next, { replace: true })
  }

  return { category, filter, keyword, page, setFilter }
}
