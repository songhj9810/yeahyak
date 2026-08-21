import dayjs, { Dayjs } from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

type DateInput = string | Date | Dayjs | null | undefined

/**
 * 날짜 데이터를 "방금 전", "3분 전", "5일 전" 등 현재 시간 기준의 상대적 문자열로 변환합니다.
 * 값이 없거나 유효하지 않으면 빈 문자열을 반환합니다.
 */
export const formatRelativeTime = (value?: DateInput): string => {
  if (!value) return ""

  const date = dayjs(value)
  return date.isValid() ? date.fromNow() : ""
}

/**
 * 날짜 데이터를 "YYYY년 MM월 DD일" 포맷의 문자열로 변환합니다.
 * 값이 없거나 유효하지 않으면 빈 문자열을 반환합니다.
 */
export const formatDate = (value?: DateInput): string => {
  if (!value) return ""

  const date = dayjs(value)
  return date.isValid() ? date.format("YYYY년 MM월 DD일") : ""
}

/**
 * 날짜 데이터를 "YYYY. MM. DD. HH:mm" 포맷의 문자열로 변환합니다.
 * 값이 없거나 유효하지 않으면 빈 문자열을 반환합니다.
 */
export const formatDateTime = (value?: DateInput): string => {
  if (!value) return ""

  const date = dayjs(value)
  return date.isValid() ? date.format("YYYY. MM. DD. HH:mm") : ""
}

/**
 * 날짜 데이터를 "YYYY-MM-DDTHH:mm:ss" 포맷의 문자열로 변환합니다.
 * API 요청 시 빈 값 처리를 위해, 데이터가 유효하지 않으면 undefined를 반환합니다.
 */
export const formatLocalDateTime = (value?: DateInput): string | undefined => {
  if (!value) return undefined

  const date = dayjs(value)
  return date.isValid() ? date.format("YYYY-MM-DDTHH:mm:ss") : undefined
}
