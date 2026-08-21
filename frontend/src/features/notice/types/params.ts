import type { NoticeCategory } from "./enums"

export type GetNoticesParams = {
  category: NoticeCategory
  keyword?: string
  filter?: "BOTH" | "TITLE" | "CONTENT"
  page?: number
  size?: number
}
