import { useParams } from "react-router-dom"
import { Skeleton, Typography } from "antd"

import { ProductForm, useProduct } from "@/features/product"

import styles from "./ProductEditPage.module.css"

const { Title } = Typography

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)

  const { data: product, isLoading } = useProduct(productId)

  if (isLoading) return <Skeleton active />
  if (!product) return null

  return (
    <div className={styles.container}>
      <Title level={3}>상품 수정</Title>
      <ProductForm productId={productId} product={product} />
    </div>
  )
}
