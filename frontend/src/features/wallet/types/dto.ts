import type { WalletEvent } from "./enums"

export type WalletResponse = {
  id: number
  balance: number
  quota: number
  lastSettledAt: string | null
}

export type WalletTxResponse = {
  id: number
  event: WalletEvent
  amount: number
  balanceBefore: number
  balanceAfter: number
  createdAt: string
  orderId: number | null
  returnOrderId: number | null
}

export type QuotaResetRequest = {
  newQuota: number
}
