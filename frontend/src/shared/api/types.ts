export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

export interface PageResponse<T> {
  content: T[]
  page: number // 현재 페이지 (0-indexed)
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface SliceResponse<T> {
  content: T[]
  page: number // 현재 페이지 (0-indexed)
  size: number
  hasNext: boolean
}

// 커스텀 에러 클래스
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}
