import { create } from "zustand"
import { persist } from "zustand/middleware"

import type {
  ProductMainCategory,
  ProductSubCategory,
} from "@/features/product"

export type OrderCartItem = {
  productId: number
  productName: string
  mainCategory: ProductMainCategory
  subCategory: ProductSubCategory
  manufacturer: string
  price: number
  imageUrl: string | null
  quantity: number
}

interface OrderCartState {
  // 상태
  items: OrderCartItem[]

  // 액션
  actions: {
    addToCart: (item: OrderCartItem) => void
    updateQuantity: (productId: number, quantity: number) => void
    removeFromCart: (productId: number) => void
    clearCart: () => void
  }
}

const useOrderCartStore = create<OrderCartState>()(
  persist(
    (set) => ({
      items: [],

      actions: {
        // 아이템 추가
        addToCart: (item) =>
          set((state) => {
            // 이미 카트에 담겨 있는지 확인
            const existing = state.items.find(
              (i) => i.productId === item.productId
            )
            // 있으면 다시 찾아서 수량 증가
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.productId === item.productId
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
        updateQuantity: (productId: number, quantity: number) =>
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: quantity } : i
            ),
          })),

        // 아이템 제거
        removeFromCart: (productId) =>
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          })),

        // 아이템 전체 제거
        clearCart: () => set({ items: [] }),
      },
    }),
    {
      name: "cart-storage", // 로컬 스토리지 키
      partialize: (state) => ({ items: state.items }), // items만 저장
    }
  )
)

export const useOrderCartItems = () => useOrderCartStore((state) => state.items)

export const useOrderCartActions = () =>
  useOrderCartStore((state) => state.actions)
