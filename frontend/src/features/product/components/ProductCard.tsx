import { useNavigate } from "react-router-dom"
import { Card, Typography } from "antd"

import { placeholder } from "@/assets"

import type { ProductListResponse } from "../types/dto"

const { Text, Title } = Typography

type ProductCardProps = {
  product: ProductListResponse
  path: (id: number) => string
}

export function ProductCard({ product, path }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      styles={{
        body: {
          padding: 16,
          display: "Flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
      hoverable
      cover={<img src={product.imageUrl ?? placeholder} alt={product.name} />}
      onClick={() => navigate(path(product.id))}
    >
      <Title level={5} ellipsis={{ rows: 2 }}>
        {product.name}
      </Title>
      <Text strong>{product.price.toLocaleString()}원</Text>
    </Card>
  )
}
