import { useState } from "react"
import { Link } from "react-router-dom"
import type { TableProps } from "antd"
import { Cascader, Flex, Input, Space, Table, Typography } from "antd"

import {
  PharmacyInventoryDrawer,
  type PharmacyStockResponse,
  useInventoryFilter,
  usePharmacyStocks,
} from "@/features/inventory"
import {
  MAIN_TO_SUB_CATEGORY,
  PRODUCT_MAIN_CATEGORY_LABEL,
  PRODUCT_SUB_CATEGORY_LABEL,
  type ProductMainCategory,
  type ProductSubCategory,
} from "@/features/product"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { PATHS } from "@/shared/config/paths"

import { placeholder } from "@/assets"

import styles from "./InventoryPage.module.css"

const { Title } = Typography

const cascaderOptions = [
  { value: "all", label: "전체" },
  ...Object.entries(PRODUCT_MAIN_CATEGORY_LABEL).map(([value, label]) => ({
    value: value as ProductMainCategory,
    label: label,
    children: [
      { value: "all", label: "전체" },
      ...MAIN_TO_SUB_CATEGORY[value as ProductMainCategory].map((sub) => ({
        value: sub,
        label: PRODUCT_SUB_CATEGORY_LABEL[sub],
      })),
    ],
  })),
]

const columns: TableProps<PharmacyStockResponse>["columns"] = [
  {
    title: "번호",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "이미지",
    key: "image",
    render: (_, record) => (
      <Link
        to={PATHS.BRANCH.PRODUCTS.DETAIL(record.productId)}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className={styles.img}
          src={record.imageUrl ?? placeholder}
          alt={record.name}
        />
      </Link>
    ),
  },
  {
    title: "상품명",
    dataIndex: "name",
    key: "name",
    render: (name: string, record) => (
      <Link
        to={PATHS.BRANCH.PRODUCTS.DETAIL(record.productId)}
        onClick={(e) => e.stopPropagation()}
      >
        {name}
      </Link>
    ),
  },
  {
    title: "표준코드",
    dataIndex: "kdCode",
    key: "kdCode",
  },
  {
    title: "제조사",
    dataIndex: "manufacturer",
    key: "manufacturer",
  },
  {
    title: "소분류",
    dataIndex: "subCategory",
    key: "subCategory",
    render: (subCategory: ProductSubCategory) =>
      PRODUCT_SUB_CATEGORY_LABEL[subCategory],
  },
  {
    title: "단위",
    dataIndex: "unit",
    key: "unit",
    render: (unit: string | null) => unit ?? "-",
  },
  {
    title: "재고",
    dataIndex: "stock",
    key: "stock",
    render: (stock: number) => stock.toLocaleString(),
  },
]

export default function InventoryPage() {
  const { mainCategory, subCategory, keyword, threshold, page, setFilter } =
    useInventoryFilter()

  const [selectedStockId, setSelectedStockId] = useState<number | undefined>()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data: stocks, isLoading } = usePharmacyStocks({
    mainCategory: mainCategory === "all" ? undefined : mainCategory,
    subCategory: subCategory === "all" ? undefined : subCategory,
    keyword,
    threshold,
    page,
    size: PAGE_SIZE,
  })

  return (
    <div className={styles.container}>
      <Title level={3}>약국 재고 관리</Title>

      <Flex justify="space-between" align="center" gap="small" wrap>
        <Space align="center" wrap>
          <Cascader
            style={{ width: "fit-content" }}
            options={cascaderOptions}
            value={[mainCategory, subCategory]}
            expandTrigger="hover"
            displayRender={(labels, selectedOptions) => {
              if (!selectedOptions || selectedOptions[0]?.value === "all")
                return "전체"
              if (selectedOptions[1]?.value === "all")
                return `${labels[0]} / 전체`
              return labels.join(" / ")
            }}
            onChange={(value) => {
              const [main = "all", sub = "all"] = value || []
              setFilter({
                mainCategory: main as ProductMainCategory | "all",
                subCategory: sub as ProductSubCategory | "all",
              })
            }}
          />

          <Input.Search
            style={{ width: UI_WIDTH.SEARCH }}
            key={`${mainCategory}:${subCategory}`}
            defaultValue={keyword}
            placeholder="상품명 검색"
            allowClear
            onSearch={(value) => setFilter({ keyword: value })}
          />
        </Space>

        <Space.Compact>
          <Space.Addon>부족 재고 기준</Space.Addon>
          <Input.Search
            style={{ width: 160 }}
            key={`${mainCategory}:${subCategory}`}
            defaultValue={threshold}
            type="number"
            suffix="개"
            allowClear
            enterButton="적용"
            onSearch={(value) => setFilter({ threshold: value })}
          />
        </Space.Compact>
      </Flex>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={stocks?.content}
        loading={isLoading}
        sticky={{ offsetHeader: 64 }}
        scroll={{ x: "max-content" }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedStockId(record.id)
            setIsDrawerOpen(true)
          },
        })}
        pagination={{
          current: (stocks?.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: stocks?.totalElements,
          onChange: (page) => setFilter({ page: page - 1 }),
          placement: ["bottomCenter"],
          showSizeChanger: false,
        }}
      />

      <PharmacyInventoryDrawer
        stockId={selectedStockId}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
