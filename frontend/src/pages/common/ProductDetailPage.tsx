import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import type { DescriptionsProps } from "antd"
import {
  App,
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  Flex,
  InputNumber,
  Popconfirm,
  Row,
  Skeleton,
  Typography,
} from "antd"
import DOMPurify from "dompurify"

import { useRole } from "@/features/auth"
import { type OrderCartItem, useOrderCartActions } from "@/features/order"
import {
  PRODUCT_MAIN_CATEGORY_LABEL,
  PRODUCT_SUB_CATEGORY_LABEL,
  useDeleteProduct,
  useProduct,
} from "@/features/product"

import { UI_WIDTH } from "@/shared/config/constants"
import { PATHS } from "@/shared/config/paths"
import { formatDateTime } from "@/shared/lib/formatDate"

import { placeholder } from "@/assets"

import styles from "./ProductDetailPage.module.css"

const { Title, Text } = Typography

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  const { id } = useParams<{ id: string }>()
  const productId = Number(id)

  const role = useRole()
  const { addToCart } = useOrderCartActions()
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useProduct(productId)

  const { mutate: deleteProduct, isPending } = useDeleteProduct(productId)

  if (isLoading) return <Skeleton active />
  if (!product) return null

  const breadcrumbItems = [
    {
      title: (
        <Link
          to={
            role === "ADMIN"
              ? `${PATHS.HQ.PRODUCTS.LIST}?mainCategory=${product.mainCategory}`
              : `${PATHS.BRANCH.PRODUCTS.LIST}?mainCategory=${product.mainCategory}`
          }
        >
          {PRODUCT_MAIN_CATEGORY_LABEL[product.mainCategory]}
        </Link>
      ),
    },
    {
      title: (
        <Link
          to={
            role === "ADMIN"
              ? `${PATHS.HQ.PRODUCTS.LIST}?mainCategory=${product.mainCategory}&subCategory=${product.subCategory}`
              : `${PATHS.BRANCH.PRODUCTS.LIST}?mainCategory=${product.mainCategory}&subCategory=${product.subCategory}`
          }
        >
          {PRODUCT_SUB_CATEGORY_LABEL[product.subCategory]}
        </Link>
      ),
    },
  ]

  const descriptionItems: DescriptionsProps["items"] = [
    {
      key: "kdCode",
      label: "표준코드",
      children: product.kdCode,
    },
    {
      key: "manufacturer",
      label: "제조사",
      children: product.manufacturer,
    },
    {
      key: "mainCategory",
      label: "대분류",
      children: PRODUCT_MAIN_CATEGORY_LABEL[product.mainCategory],
    },
    {
      key: "subCategory",
      label: "소분류",
      children: PRODUCT_SUB_CATEGORY_LABEL[product.subCategory],
    },
    {
      key: "unit",
      label: "단위",
      children: product.unit ?? "-",
    },
  ]

  const handleDelete = () => {
    deleteProduct(undefined, {
      onSuccess: () => message.success("상품을 삭제했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  const handleAddToCart = () => {
    const item: OrderCartItem = {
      productId: product.id,
      productName: product.name,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      manufacturer: product.manufacturer,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    }
    addToCart(item)
    setQuantity(1)
    message.success(`상품을 ${quantity.toLocaleString()}개 카트에 담았습니다`)
  }

  return (
    <div className={styles.container}>
      <Flex justify="space-between" align="center" gap="small" wrap>
        <Breadcrumb items={breadcrumbItems} />
        <Text type="secondary">
          등록일시: {formatDateTime(product.createdAt)}
        </Text>
      </Flex>

      <Row gutter={[32, 24]}>
        <Col xs={24} md={12}>
          <img
            className={styles.img}
            src={product.imageUrl ?? placeholder}
            alt={product.name}
          />
        </Col>

        <Col xs={24} md={12}>
          <Flex vertical gap="large">
            <Title level={3}>{product.name}</Title>
            <Descriptions items={descriptionItems} column={1} />
            <Title level={3}>{product.price.toLocaleString()}원</Title>

            {role === "ADMIN" ? (
              <Flex justify="end" align="center" gap="small">
                <Button
                  onClick={() => navigate(PATHS.HQ.PRODUCTS.EDIT(productId))}
                >
                  수정
                </Button>

                <Popconfirm
                  title="상품을 삭제하시겠습니까?"
                  placement="topRight"
                  okText="삭제"
                  okType="danger"
                  onConfirm={handleDelete}
                >
                  <Button danger loading={isPending}>
                    삭제
                  </Button>
                </Popconfirm>
              </Flex>
            ) : (
              <Flex justify="end" align="center" gap="small">
                <InputNumber
                  style={{ width: UI_WIDTH.SPINNER }}
                  mode="spinner"
                  min={1}
                  max={999}
                  value={quantity}
                  onChange={(value) => setQuantity(value ?? 1)}
                />

                <Button type="primary" onClick={handleAddToCart}>
                  카트 담기
                </Button>
              </Flex>
            )}
          </Flex>
        </Col>
      </Row>

      {product.description && (
        <>
          <Title level={4}>설명</Title>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.description),
            }}
          />
        </>
      )}
    </div>
  )
}
