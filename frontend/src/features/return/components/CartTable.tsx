import { Link } from "react-router-dom"
import { DeleteOutlined } from "@ant-design/icons"
import type { TableProps } from "antd"
import { Button, InputNumber, Table } from "antd"

import {
  PRODUCT_SUB_CATEGORY_LABEL,
  type ProductSubCategory,
} from "@/features/product"

import { PATHS } from "@/shared/config/paths"

import { placeholder } from "@/assets"

import {
  type ReturnCartItem,
  useReturnCartActions,
  useReturnCartItems,
} from "../store"

import styles from "./CartTable.module.css"

export function CartTable() {
  const items = useReturnCartItems()
  const { updateQuantity, removeFromCart } = useReturnCartActions()

  const columns: TableProps<ReturnCartItem>["columns"] = [
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
      title: "소분류",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (subCategory: ProductSubCategory) =>
        PRODUCT_SUB_CATEGORY_LABEL[subCategory],
    },
    {
      title: "발주 단가",
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
          max={record.returnableQuantity}
          value={quantity}
          onChange={(value) => updateQuantity(record.orderItemId, value ?? 1)}
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
          onClick={() => removeFromCart(record.orderItemId)}
        />
      ),
    },
  ]

  return (
    <Table
      rowKey="orderItemId"
      columns={columns}
      dataSource={items}
      scroll={{ x: "max-content" }}
      summary={() => (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5} align="right">
              합계
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              {items
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString()}
              원
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} />
          </Table.Summary.Row>
        </Table.Summary>
      )}
      pagination={false}
    />
  )
}
