import { useNavigate } from "react-router-dom"
import type { TableProps } from "antd"
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
} from "antd"

import {
  NOTICE_CATEGORY_LABEL,
  type NoticeCategory,
  type NoticeListResponse,
  useLatestNotices,
} from "@/features/notice"
import {
  type OrderListResponse,
  useOrders,
  useOrderStatistics,
} from "@/features/order"
import {
  PHARMACY_REGION_LABEL,
  type PharmacyListResponse,
  type PharmacyRegion,
  usePharmacies,
} from "@/features/pharmacy"
import {
  type ReturnListResponse,
  useReturns,
  useReturnStatistics,
} from "@/features/return"

import { PATHS } from "@/shared/config/paths"
import { formatRelativeTime } from "@/shared/lib/formatDate"

import styles from "./DashboardPage.module.css"

const { Title } = Typography

const orderColumns: TableProps<OrderListResponse>["columns"] = [
  {
    title: "약국명",
    dataIndex: "pharmacyName",
    key: "pharmacyName",
  },
  {
    title: "요약",
    dataIndex: "summary",
    key: "summary",
  },
  {
    title: "총액",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (totalPrice: number) => `${totalPrice.toLocaleString()}원`,
  },
  {
    title: "요청일시",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatRelativeTime,
  },
]

const returnColumns: TableProps<ReturnListResponse>["columns"] = [
  {
    title: "약국명",
    dataIndex: "pharmacyName",
    key: "pharmacyName",
  },
  {
    title: "요약",
    dataIndex: "summary",
    key: "summary",
  },
  {
    title: "총액",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (totalPrice: number) => `${totalPrice.toLocaleString()}원`,
  },
  {
    title: "요청일시",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatRelativeTime,
  },
]

const pharmacyColumns: TableProps<PharmacyListResponse>["columns"] = [
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
    title: "잔액",
    key: "balance",
    render: (_, record) => {
      const { balance, quota } = record
      const percent = quota === 0 ? 0 : Math.round((balance / quota) * 100)
      const color = percent >= 25 ? "orange" : "red"
      return (
        <Badge
          color={color}
          text={`${percent}% (${balance.toLocaleString()}원)`}
        />
      )
    },
  },
  {
    title: "최근 정산일",
    dataIndex: "lastSettledAt",
    key: "lastSettledAt",
    render: (lastSettledAt: string) => formatRelativeTime(lastSettledAt) || "-",
  },
]

const noticeColumns: TableProps<NoticeListResponse>["columns"] = [
  {
    title: "카테고리",
    dataIndex: "category",
    key: "category",
    render: (category: NoticeCategory) => NOTICE_CATEGORY_LABEL[category],
    width: "25%",
  },
  {
    title: "제목",
    dataIndex: "title",
    key: "title",
    width: "50%",
  },
  {
    title: "작성일",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatRelativeTime,
    width: "25%",
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  const { data: orderStats, isLoading: isOrderStatsLoading } =
    useOrderStatistics()
  const { data: orders, isLoading: isOrdersLoading } = useOrders({
    status: "PENDING",
    size: 10,
  })
  const { data: returnStats, isLoading: isReturnStatsLoading } =
    useReturnStatistics()
  const { data: returns, isLoading: isReturnsLoading } = useReturns({
    status: "PENDING",
    size: 10,
  })
  const { data: pharmacies, isLoading: isPharmaciesLoading } = usePharmacies({
    lowBalance: true,
    size: 10,
  })
  const { data: notices, isLoading: isNoticesLoading } = useLatestNotices()

  return (
    <div className={styles.container}>
      <Title level={3}>대시보드</Title>

      {/* 발주 통계 */}
      <Title level={5}>당월 발주 현황</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={24}>
              <Card>
                <Statistic
                  title="발주 요청"
                  value={orderStats?.total ?? 0}
                  loading={isOrderStatsLoading}
                />
              </Card>
            </Col>
            <Col xs={12} md={24}>
              <Card>
                <Statistic
                  title="발주 총액"
                  value={orderStats?.totalAmount.toLocaleString() ?? 0}
                  suffix="원"
                  loading={isOrderStatsLoading}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={16}>
          <Card
            styles={{ body: { padding: 8 } }}
            title="대기 중인 발주 요청"
            extra={
              <Button
                className={styles.more}
                type="link"
                size="small"
                onClick={() => navigate(PATHS.HQ.ORDERS)}
              >
                더보기
              </Button>
            }
            loading={isOrdersLoading}
          >
            <Table
              rowKey="id"
              columns={orderColumns}
              dataSource={orders?.content}
              bordered
              size="small"
              scroll={{ x: "max-content" }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* 반품 통계 */}
      <Title level={5}>당월 반품 현황</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={24}>
              <Card>
                <Statistic
                  title="반품 요청"
                  value={returnStats?.total ?? 0}
                  loading={isReturnStatsLoading}
                />
              </Card>
            </Col>
            <Col xs={12} md={24}>
              <Card>
                <Statistic
                  title="반품 총액"
                  value={returnStats?.totalAmount.toLocaleString() ?? 0}
                  suffix="원"
                  loading={isReturnStatsLoading}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={16}>
          <Card
            styles={{ body: { padding: 8 } }}
            title="대기 중인 반품 요청"
            extra={
              <Button
                className={styles.more}
                type="link"
                size="small"
                onClick={() => navigate(PATHS.HQ.RETURNS)}
              >
                더보기
              </Button>
            }
            loading={isReturnsLoading}
          >
            <Table
              rowKey="id"
              columns={returnColumns}
              dataSource={returns?.content}
              bordered
              size="small"
              scroll={{ x: "max-content" }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 잔액 부족 약국 */}
        <Col xs={24} lg={12}>
          <Card
            styles={{ body: { padding: 8 } }}
            title="잔액 부족 약국"
            extra={
              <Button
                className={styles.more}
                type="link"
                size="small"
                onClick={() => navigate(PATHS.HQ.PHARMACIES)}
              >
                더보기
              </Button>
            }
            loading={isPharmaciesLoading}
          >
            <Table
              rowKey="id"
              columns={pharmacyColumns}
              dataSource={pharmacies?.content}
              bordered
              size="small"
              scroll={{ x: "max-content" }}
              pagination={false}
            />
          </Card>
        </Col>

        {/* 최신 공지사항 */}
        <Col xs={24} lg={12}>
          <Card
            styles={{ body: { padding: 8 } }}
            title="최신 공지사항"
            extra={
              <Button
                className={styles.more}
                type="link"
                size="small"
                onClick={() => navigate(PATHS.HQ.NOTICES.LIST)}
              >
                더보기
              </Button>
            }
            loading={isNoticesLoading}
          >
            <Table
              rowKey="id"
              columns={noticeColumns}
              dataSource={notices}
              bordered
              size="small"
              scroll={{ x: "max-content" }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
