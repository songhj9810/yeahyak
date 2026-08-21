import { create } from "zustand"

import type { ProductSubCategory } from "@/features/product"

export type ReturnCartItem = {
  orderItemId: number
  returnableQuantity: number
  productId: number
  productName: string
  subCategory: ProductSubCategory
  price: number
  imageUrl: string | null
  quantity: number
}

interface ReturnCartState {
  // 상태
  orderId: number | undefined
  items: ReturnCartItem[]

  // 액션
  actions: {
    setOrderId: (orderId: number) => void
    addToCart: (item: ReturnCartItem) => void
    updateQuantity: (orderItemId: number, quantity: number) => void
    removeFromCart: (orderItemId: number) => void
    clearCart: () => void
  }
}

const useReturnCartStore = create<ReturnCartState>()((set) => ({
  orderId: undefined,
  items: [],

  actions: {
    // 발주 선택
    setOrderId: (orderId) => set({ orderId, items: [] }),

    // 아이템 추가
    addToCart: (item) =>
      set((state) => {
        // 이미 카트에 담겨 있는지 확인
        const existing = state.items.find(
          (i) => i.orderItemId === item.orderItemId
        )
        // 있으면 다시 찾아서 수량 증가
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.orderItemId === item.orderItemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }
        }
        // 없으면 새 아이템 추가
        return {
          items: [...state.items, item],
        }
      }),

    // 아이템 수량 변경
    updateQuantity: (orderItemId: number, quantity: number) =>
      set((state) => ({
        items: state.items.map((i) =>
          i.orderItemId === orderItemId ? { ...i, quantity: quantity } : i
        ),
      })),

    // 아이템 제거
    removeFromCart: (orderItemId) =>
      set((state) => ({
        items: state.items.filter((i) => i.orderItemId !== orderItemId),
      })),

    // 아이템 전체 제거
    clearCart: () => set({ orderId: undefined, items: [] }),
  },
}))

export const useReturnCartOrderId = () =>
  useReturnCartStore((state) => state.orderId)
export const useReturnCartItems = () =>
  useReturnCartStore((state) => state.items)

export const useReturnCartActions = () =>
  useReturnCartStore((state) => state.actions)
