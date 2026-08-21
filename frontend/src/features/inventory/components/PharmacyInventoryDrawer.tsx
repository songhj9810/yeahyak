import { useState } from "react"
import type { TableProps } from "antd"
import {
  Card,
  DatePicker,
  Drawer,
  Flex,
  Select,
  Space,
  Statistic,
  Table,
} from "antd"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { formatDateTime, formatLocalDateTime } from "@/shared/lib/formatDate"

import {
  usePharmacyStock,
  usePharmacyStockTxs,
} from "../hooks/usePharmacyInventory"
import type { PharmacyStockTxResponse } from "../types/dto"
import {
  PHARMACY_STOCK_EVENT_LABEL,
  type PharmacyStockEvent,
} from "../types/enums"
import { StockAdjustModal } from "./StockAdjustModal"

type PharmacyInventoryDrawerProps = {
  stockId: number | undefined
  open: boolean
  onClose: () => void
}

const eventOptions = [
  { value: "all", label: "전체 유형" },
  ...Object.entries(PHARMACY_STOCK_EVENT_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const columns: TableProps<PharmacyStockTxResponse>["columns"] = [
  {
    title: "유형",
    dataIndex: "event",
    key: "event",
    render: (event: PharmacyStockEvent) => PHARMACY_STOCK_EVENT_LABEL[event],
  },
  {
    title: "수량",
    dataIndex: "quantity",
    key: "quantity",
    render: (quantity: number, record) => {
      if (record.event === "ADJUST") {
        const diff = record.stockAfter - record.stockBefore
        return diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()
      }
      return record.event === "ORDER_IN"
        ? `+${quantity.toLocaleString()}`
        : `-${quantity.toLocaleString()}`
    },
  },
  {
    title: "재고",
    dataIndex: "stockAfter",
    key: "stockAfter",
    render: (stockAfter: number) => stockAfter.toLocaleString(),
  },
  {
    title: "일시",
    key: "datetime",
    render: (_, record) =>
      formatDateTime(
        record.event === "SALE_OUT" ? record.saleDate : record.createdAt
      ),
  },
]

export function PharmacyInventoryDrawer({
  stockId,
  open,
  onClose,
}: PharmacyInventoryDrawerProps) {
  const [event, setEvent] = useState<PharmacyStockEvent | "all">("all")
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const { data: stock, isLoading: isStockLoading } = usePharmacyStock(stockId)
  const { data: stockTxs, isLoading: isStockTxsLoading } = usePharmacyStockTxs(
    stockId,
    {
      event: event === "all" ? undefined : event,
      start,
      end,
      page,
      size: PAGE_SIZE,
    }
  )

  if (!stock) return null

  return (
    <Drawer
      styles={{ body: { display: "flex", flexDirection: "column", gap: 16 } }}
      title={`${stock.name} 재고 내역`}
      open={open}
      size={UI_WIDTH.DRAWER}
      onClose={onClose}
      extra={
        <StockAdjustModal
          type="pharmacy"
          stockId={stock.id}
          currentStock={stock.stock}
        />
      }
      destroyOnHidden
    >
      <Card loading={isStockLoading}>
        <Flex justify="center" align="center">
          <Statistic
            title="재고"
            value={stock.stock.toLocaleString()}
            suffix="개"
          />
        </Flex>
      </Card>

      <Space align="center" wrap>
        <Select
          style={{ width: "fit-content" }}
          options={eventOptions}
          value={event}
          popupMatchSelectWidth={false}
          onChange={(value) => {
            setEvent(value)
            setPage(0)
          }}
        />

        <DatePicker.RangePicker
          style={{ width: UI_WIDTH.SEARCH }}
          allowEmpty={[true, true]}
          onChange={(values) => {
            setStart(formatLocalDateTime(values?.[0]))
            setEnd(formatLocalDateTime(values?.[1]))
            setPage(0)
          }}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={stockTxs?.content}
        loading={isStockTxsLoading}
        sticky={{ offsetHeader: -24 }}
        scroll={{ x: "max-content" }}
        pagination={{
          current: (stockTxs?.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: stockTxs?.totalElements,
          onChange: (page) => setPage(page - 1),
          size: "small",
          showSizeChanger: false,
        }}
      />
    </Drawer>
  )
}
