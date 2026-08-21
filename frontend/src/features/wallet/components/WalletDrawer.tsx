import { useState } from "react"
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Flex,
  Select,
  Space,
  Statistic,
  Table,
  type TableProps,
  Typography,
} from "antd"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import {
  formatDate,
  formatDateTime,
  formatLocalDateTime,
} from "@/shared/lib/formatDate"

import { useWallet, useWalletTxs } from "../hooks/useWallet"
import type { WalletTxResponse } from "../types/dto"
import { WALLET_EVENT_LABEL, type WalletEvent } from "../types/enums"
import { QuotaResetModal } from "./QuotaResetModal"
import { SettleButton } from "./SettleButton"

const { Text } = Typography

type WalletDrawerProps = {
  pharmacyId: number
  pharmacyName: string
}

const eventOptions = [
  { value: "all", label: "전체 유형" },
  ...Object.entries(WALLET_EVENT_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const columns: TableProps<WalletTxResponse>["columns"] = [
  {
    title: "유형",
    dataIndex: "event",
    key: "event",
    render: (event: WalletEvent) => WALLET_EVENT_LABEL[event],
  },
  {
    title: "금액",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number, record) =>
      record.event === "DEDUCT"
        ? `-${amount.toLocaleString()}원`
        : record.event === "SETTLE"
          ? "-"
          : `+${amount.toLocaleString()}원`,
  },
  {
    title: "잔액",
    dataIndex: "balanceAfter",
    key: "balanceAfter",
    render: (balanceAfter: number) => `${balanceAfter.toLocaleString()}원`,
  },
  {
    title: "일시",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatDateTime,
  },
]

export function WalletDrawer({ pharmacyId, pharmacyName }: WalletDrawerProps) {
  const [open, setOpen] = useState(false)
  const [event, setEvent] = useState<WalletEvent | "all">("all")
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const { data: wallet, isLoading: isWalletLoading } = useWallet(pharmacyId)
  const { data: walletTxs, isLoading: isWalletTxsLoading } = useWalletTxs(
    pharmacyId,
    {
      event: event === "all" ? undefined : event,
      start,
      end,
      page,
      size: PAGE_SIZE,
    }
  )

  if (!wallet) return null

  return (
    <>
      <Button onClick={() => setOpen(true)}>거래 내역</Button>

      <Drawer
        styles={{ body: { display: "flex", flexDirection: "column", gap: 16 } }}
        title={`${pharmacyName} 거래 내역`}
        open={open}
        size={UI_WIDTH.DRAWER}
        onClose={() => setOpen(false)}
        extra={
          <Space align="center">
            <QuotaResetModal
              pharmacyId={pharmacyId}
              currentQuota={wallet.quota}
            />
            <SettleButton pharmacyId={pharmacyId} pharmacyName={pharmacyName} />
          </Space>
        }
        destroyOnHidden
      >
        <Card loading={isWalletLoading}>
          <Flex vertical justify="center" align="center" gap="small">
            <Statistic
              title="잔액"
              value={wallet.balance.toLocaleString() ?? 0}
              suffix="원"
            />
            <Text>한도: {wallet.quota.toLocaleString() ?? 0}원</Text>
            {wallet.lastSettledAt && (
              <Text type="secondary">
                최근 정산일: {formatDate(wallet.lastSettledAt)}
              </Text>
            )}
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
          dataSource={walletTxs?.content}
          loading={isWalletTxsLoading}
          sticky={{ offsetHeader: -24 }}
          scroll={{ x: "max-content" }}
          pagination={{
            current: (walletTxs?.page ?? 0) + 1,
            pageSize: PAGE_SIZE,
            total: walletTxs?.totalElements,
            onChange: (page) => setPage(page - 1),
            size: "small",
            showSizeChanger: false,
          }}
        />
      </Drawer>
    </>
  )
}
