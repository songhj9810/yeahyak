import type { PharmacyStockResponse } from "@/features/inventory"

// ML 그룹: 상위 70%, 365일치 데이터 (CatBoost 조건 충족)
// WMA 그룹 A: 중간 23%, 60~150일치 데이터
// WMA 그룹 B: 하위 7%(최소 1개), 30일치 소량 → recommendQty = 0 케이스
const ML_RATIO = 0.7
const WMA_B_RATIO = 0.07

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateQty(
  rand: () => number,
  date: Date,
  base: number,
  withPattern: boolean
): number {
  let qty = base + Math.floor(rand() * base)

  if (withPattern) {
    // 주말 효과
    const dayofweek = date.getDay()
    if (dayofweek === 0 || dayofweek === 6) qty = Math.round(qty * 1.3)

    // 계절성 (겨울 최대, 여름 최소)
    const month = date.getMonth()
    const seasonal = 1 + 0.3 * Math.cos((month / 12) * 2 * Math.PI)
    qty = Math.round(qty * seasonal)
  }

  return Math.max(1, qty)
}

export function generateDummySalesCsv(stocks: PharmacyStockResponse[]): File {
  const sorted = [...stocks].sort((a, b) => a.productId - b.productId)
  const total = sorted.length
  const mlCount = Math.floor(total * ML_RATIO)
  const wmaBCount = Math.max(1, Math.floor(total * WMA_B_RATIO))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const rows: string[] = ["date,productId,quantity"]

  sorted.forEach((stock, idx) => {
    const rand = seededRandom(stock.productId * 31 + idx)

    let daysBack: number
    let withPattern: boolean

    if (idx < mlCount) {
      // ML 그룹: 365일치, 패턴 포함
      daysBack = 365
      withPattern = true
    } else if (idx < total - wmaBCount) {
      // WMA 그룹 A: 60~150일치
      daysBack = 60 + Math.floor(rand() * 90)
      withPattern = false
    } else {
      // WMA 그룹 B: 30일치, 소량 판매 (재고 초과 안 함 → recommendQty = 0)
      daysBack = 30
      withPattern = false
    }

    const base = idx < mlCount ? 3 + (idx % 5) : 1 + (idx % 3)

    for (let d = daysBack; d >= 1; d--) {
      const date = new Date(today)
      date.setDate(today.getDate() - d)

      // 30% 확률로 해당 날짜 판매 기록 생략 (WMA 그룹 B 제외)
      if (idx < total - wmaBCount && rand() < 0.3) continue

      // WMA 그룹 B는 판매량을 매우 적게 → 현재 재고로 충분히 커버됨
      const qty =
        idx >= total - wmaBCount
          ? 1
          : generateQty(rand, date, base, withPattern)

      const dateStr = date.toISOString().slice(0, 10)
      rows.push(`${dateStr},${stock.productId},${qty}`)
    }
  })

  const csv = rows.join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  return new File([blob], "dummy_sales.csv", { type: "text/csv" })
}
