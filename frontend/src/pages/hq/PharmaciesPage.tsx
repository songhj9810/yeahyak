import { useState } from "react"
import type { TableProps } from "antd"
import {
  Flex,
  Input,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd"

import {
  PHARMACY_REGION_LABEL,
  PharmacyExpandedRow,
  type PharmacyListResponse,
  type PharmacyRegion,
  usePharmacies,
} from "@/features/pharmacy"
import { SettleButton } from "@/features/wallet"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { formatDate } from "@/shared/lib/formatDate"

import styles from "./PharmaciesPage.module.css"

const { Title, Text } = Typography

const regionOptions = [
  { value: "all", label: "전체 지역" },
  ...Object.entries(PHARMACY_REGION_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const columns: TableProps<PharmacyListResponse>["columns"] = [
  {
    title: "번호",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "약국명",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "지역",
    dataIndex: "region",
    key: "region",
    render: (region: PharmacyRegion) => PHARMACY_REGION_LABEL[region],
  },
  {
    title: "주소",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "연락처",
    dataIndex: "contact",
    key: "contact",
  },
  {
    title: "잔액",
    key: "balance",
    render: (_, record) => {
      const { balance, quota } = record
      const percent = quota === 0 ? 0 : Math.round((balance / quota) * 100)
      const color =
        percent >= 75
          ? "green"
          : percent >= 50
            ? "blue"
            : percent >= 25
              ? "orange"
              : "red"
      return <Tag color={color} variant="outlined">{`${percent}%`}</Tag>
    },
  },
  {
    title: "최근 정산일",
    dataIndex: "lastSettledAt",
    key: "lastSettledAt",
    render: (lastSettledAt: string) => formatDate(lastSettledAt) || "-",
  },
  {
    title: "",
    key: "actions",
    render: (_, record) => (
      <Flex
        justify="center"
        align="center"
        onClick={(e) => e.stopPropagation()}
      >
        <SettleButton pharmacyId={record.id} pharmacyName={record.name} />
      </Flex>
    ),
  },
]

export default function PharmaciesPage() {
  const [region, setRegion] = useState<PharmacyRegion | "all">("all")
  const [lowBalance, setLowBalance] = useState(false)
  const [keyword, setKeyword] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const { data: pharmacies, isLoading } = usePharmacies({
    region: region === "all" ? undefined : region,
    lowBalance,
    keyword,
    page,
    size: PAGE_SIZE,
  })

  return (
    <div className={styles.container}>
      <Title level={3}>약국 관리</Title>

      <Flex justify="space-between" align="center" gap="small" wrap>
        <Space align="center" wrap>
          <Select
            style={{ width: "fit-content" }}
            options={regionOptions}
            value={region}
            popupMatchSelectWidth={false}
            onChange={(value) => {
              setRegion(value)
              setPage(0)
            }}
          />

          <Input.Search
            style={{ width: UI_WIDTH.SEARCH }}
            placeholder="약국명 검색"
            allowClear
            onSearch={(value) => {
              setKeyword(value || undefined)
              setPage(0)
            }}
          />
        </Space>

        <Space align="center">
          <Text>한도 대비 잔액</Text>
          <Switch
            style={{ minWidth: "max-content" }}
            checkedChildren="정산 필요"
            unCheckedChildren="전체"
            onChange={(checked) => setLowBalance(checked)}
          />
        </Space>
      </Flex>

      <Table
        className={styles.table}
        rowKey="id"
        columns={columns}
        dataSource={pharmacies?.content}
        loading={isLoading}
        sticky={{ offsetHeader: 64 }}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowRender: (record) => (
            <PharmacyExpandedRow pharmacyId={record.id} />
          ),
          expandRowByClick: true,
        }}
        pagination={{
          current: (pharmacies?.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: pharmacies?.totalElements,
          onChange: (page) => setPage(page - 1),
          placement: ["bottomCenter"],
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
