import { useState } from "react"
import type { TableProps } from "antd"
import {
  Col,
  DatePicker,
  Flex,
  Progress,
  Row,
  Select,
  Skeleton,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd"

import {
  useMyWallet,
  useMyWalletTxs,
  WALLET_EVENT_LABEL,
  type WalletEvent,
  type WalletTxResponse,
} from "@/features/wallet"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import {
  formatDate,
  formatDateTime,
  formatLocalDateTime,
} from "@/shared/lib/formatDate"

import styles from "./WalletPage.module.css"

const { Title } = Typography

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

export default function WalletPage() {
  const [event, setEvent] = useState<WalletEvent | "all">("all")
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const { data: wallet, isLoading: isWalletLoading } = useMyWallet()
  const { data: walletTxs, isLoading: isWalletTxsLoading } = useMyWalletTxs({
    event: event === "all" ? undefined : event,
    start,
    end,
    page,
    size: PAGE_SIZE,
  })

  if (isWalletLoading || isWalletTxsLoading) return <Skeleton active />
  if (!wallet || !walletTxs) return null

  return (
    <div className={styles.container}>
      <Title level={3}>지갑 / 거래 내역</Title>

      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col xs={24} md={8}>
          <Flex justify="center" align="center">
            <Progress
              styles={{ body: { width: 180, height: 180 } }}
              percent={Math.round((wallet.balance / wallet.quota) * 100)}
              format={() => (
                <Statistic
                  title="잔액"
                  value={wallet.balance.toLocaleString()}
                  suffix="원"
                />
              )}
              type="dashboard"
              gapDegree={50}
              gapPlacement="bottom"
              strokeWidth={4}
            />
          </Flex>
        </Col>

        <Col xs={12} md={8}>
          <Flex justify="center" align="center">
            <Statistic
              title="한도"
              value={wallet.quota.toLocaleString()}
              suffix="원"
            />
          </Flex>
        </Col>

        <Col xs={12} md={8}>
          <Flex justify="center" align="center">
            <Statistic
              title="최근 정산일"
              value={formatDate(wallet.lastSettledAt) || "최초 정산 필요"}
            />
          </Flex>
        </Col>
      </Row>

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
        dataSource={walletTxs.content}
        sticky={{ offsetHeader: 64 }}
        scroll={{ x: "max-content" }}
        pagination={{
          current: (walletTxs.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: walletTxs.totalElements,
          onChange: (page) => setPage(page - 1),
          placement: ["bottomCenter"],
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
