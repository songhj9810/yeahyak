import type { WalletEvent } from "./enums"

export type GetWalletTxsParams = {
  event?: WalletEvent
  start?: string
  end?: string
  page?: number
  size?: number
}
