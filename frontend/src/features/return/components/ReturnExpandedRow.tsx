import type { DescriptionsProps, TableProps } from "antd"
import { Descriptions, Skeleton, Table } from "antd"

import {
  PRODUCT_SUB_CATEGORY_LABEL,
  type ProductSubCategory,
} from "@/features/product"

import { placeholder } from "@/assets"

import { useReturn } from "../hooks/useReturn"
import type { ReturnItemResponse } from "../types/dto"

import styles from "./ReturnExpandedRow.module.css"

type ReturnExpandedRowProps = {
  returnId: number
}

const columns: TableProps<ReturnItemResponse>["columns"] = [
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

export function ReturnExpandedRow({ returnId }: ReturnExpandedRowProps) {
  const { data, isLoading } = useReturn(returnId)

  if (isLoading) return <Skeleton active />
  if (!data) return null

  const descriptionsItems: DescriptionsProps["items"] = [
    {
      key: "returnReason",
      label: "반품 사유",
      children: data.returnReason ?? "반품 사유를 입력하지 않았습니다",
    },
  ]

  if (data.rejectReason) {
    descriptionsItems.push({
      key: "rejectReason",
      label: "반려 사유",
      children: data.rejectReason,
    })
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data.returnItems}
      size="small"
      scroll={{ x: "max-content" }}
      title={() => (
        <Descriptions
          className={styles.descriptions}
          items={descriptionsItems}
          column={1}
          size="small"
        />
      )}
      summary={() => (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5} align="right">
              합계
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              {data.totalPrice.toLocaleString()}원
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
      pagination={false}
    />
  )
}
