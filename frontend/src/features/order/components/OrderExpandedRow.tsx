import type { TableProps } from "antd"
import { Alert, Skeleton, Table } from "antd"

import {
  PRODUCT_SUB_CATEGORY_LABEL,
  type ProductSubCategory,
} from "@/features/product"

import { formatDateTime } from "@/shared/lib/formatDate"

import { placeholder } from "@/assets"

import { useOrder } from "../hooks/useOrder"
import type { OrderItemResponse } from "../types/dto"
import { ORDER_CANCELED_BY_LABEL } from "../types/enums"

import styles from "./OrderExpandedRow.module.css"

type OrderExpandedRowProps = {
  orderId: number
}

const columns: TableProps<OrderItemResponse>["columns"] = [
  {
    title: "이미지",
    key: "image",
    render: (_, record) => (
      <img
        className={styles.img}
        src={record.imageUrl ?? placeholder}
        alt={record.name}
      />
    ),
  },
  {
    title: "상품명",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "소분류",
    dataIndex: "subCategory",
    key: "subCategory",
    render: (subCategory: ProductSubCategory) =>
      PRODUCT_SUB_CATEGORY_LABEL[subCategory],
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
  },
  {
    title: "금액",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (totalPrice: number) => `${totalPrice.toLocaleString()}원`,
  },
]

export function OrderExpandedRow({ orderId }: OrderExpandedRowProps) {
  const { data: order, isLoading } = useOrder(orderId)

  if (isLoading) return <Skeleton active />
  if (!order) return null

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={order.orderItems}
      size="small"
      scroll={{ x: "max-content" }}
      title={() => {
        return order.canceledBy ? (
          <Alert
            title={`${ORDER_CANCELED_BY_LABEL[order.canceledBy]} 요청으로 취소된 발주입니다 (취소일시: ${formatDateTime(order.updatedAt)})`}
            type="warning"
            showIcon
          />
        ) : (
          <Alert
            title={`마지막 상태 업데이트: ${formatDateTime(order.updatedAt)}`}
            type="info"
            showIcon
          />
        )
      }}
      summary={() => (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5} align="right">
              합계
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              {order.totalPrice.toLocaleString()}원
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
      pagination={false}
    />
  )
}
