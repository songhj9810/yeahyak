import { Link } from "react-router-dom"
import { DeleteOutlined } from "@ant-design/icons"
import type { TableProps } from "antd"
import { Button, InputNumber, Space, Table, Tag } from "antd"

import {
  PRODUCT_MAIN_CATEGORY_LABEL,
  PRODUCT_SUB_CATEGORY_LABEL,
  type ProductMainCategory,
} from "@/features/product"

import { PATHS } from "@/shared/config/paths"

import { placeholder } from "@/assets"

import {
  type OrderCartItem,
  useOrderCartActions,
  useOrderCartItems,
} from "../store"

import styles from "./CartTable.module.css"

const COLOR: Record<ProductMainCategory, string> = {
  ETC: "geekblue",
  OTC: "magenta",
  MEDICAL_GOODS: "gold",
}

const INITIAL: Record<ProductMainCategory, string> = {
  ETC: "E",
  OTC: "O",
  MEDICAL_GOODS: "Q",
}

export function CartTable() {
  const items = useOrderCartItems()
  const { updateQuantity, removeFromCart } = useOrderCartActions()

  const columns: TableProps<OrderCartItem>["columns"] = [
    {
      title: "이미지",
      key: "image",
      render: (_, record) => (
        <Link to={PATHS.BRANCH.PRODUCTS.DETAIL(record.productId)}>
          <img
            className={styles.img}
            src={record.imageUrl ?? placeholder}
            alt={record.productName}
          />
        </Link>
      ),
    },
    {
      title: "상품명",
      dataIndex: "productName",
      key: "productName",
      render: (productName: string, record) => (
        <Link to={PATHS.BRANCH.PRODUCTS.DETAIL(record.productId)}>
          {productName}
        </Link>
      ),
    },
    {
      title: "제조사",
      dataIndex: "manufacturer",
      key: "manufacturer",
    },
    {
      title: "분류",
      key: "category",
      render: (_, record) => (
        <Space align="center">
          <Tag color={COLOR[record.mainCategory]}>
            {INITIAL[record.mainCategory]}
          </Tag>
          {PRODUCT_SUB_CATEGORY_LABEL[record.subCategory]}
        </Space>
      ),
    },
    {
      title: "단가",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()}원`,
    },
    {
      title: "수량",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record) => (
        <InputNumber
          min={1}
          max={999}
          value={quantity}
          onChange={(value) => updateQuantity(record.productId, value ?? 1)}
        />
      ),
    },
    {
      title: "금액",
      key: "totalPrice",
      render: (_, record) =>
        `${(record.price * record.quantity).toLocaleString()}원`,
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => removeFromCart(record.productId)}
        />
      ),
    },
  ]

  return (
    <Table
      rowKey="productId"
      columns={columns}
      dataSource={items}
      scroll={{ x: "max-content" }}
      title={() => (
        <Space align="center" wrap>
          {(["ETC", "OTC", "MEDICAL_GOODS"] as const).map((category) => (
            <Space key={category} align="center">
              <Tag color={COLOR[category]}>{INITIAL[category]}</Tag>
              {PRODUCT_MAIN_CATEGORY_LABEL[category]}
            </Space>
          ))}
        </Space>
      )}
      pagination={false}
    />
  )
}
