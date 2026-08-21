import { useMutation } from "@tanstack/react-query"

import { useOrderCartActions } from "@/features/order"

import { forecast } from "../api/forecast"

export const useForecast = () => {
  const { addToCart } = useOrderCartActions()

  return useMutation({
    mutationFn: forecast,

    onSuccess: (data) => {
      data.forEach((item) => {
        if (item.recommendQty > 0) {
          addToCart({
            productId: item.productId,
            productName: item.productName,
            mainCategory: item.mainCategory,
            subCategory: item.subCategory,
            manufacturer: item.manufacturer,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: item.recommendQty, // AI가 추천한 수량
          })
        }
      })
    },
  })
}
