import { Typography } from "antd"

import { ProductForm } from "@/features/product"

import styles from "./ProductCreatePage.module.css"

const { Title } = Typography

export default function ProductCreatePage() {
  return (
    <div className={styles.container}>
      <Title level={3}>상품 등록</Title>
      <ProductForm />
    </div>
  )
}
