import { useNavigate } from "react-router-dom"
import type { TableProps, TagProps } from "antd"
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Progress,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd"

import { SalesUploadModal, useLastSalesUpload } from "@/features/forecast"
import {
  NOTICE_CATEGORY_LABEL,
  type NoticeCategory,
  type NoticeListResponse,
  useLatestNotices,
} from "@/features/notice"
import {
  type MyOrderListResponse,
  ORDER_STATUS_LABEL,
  type OrderStatus,
  useMyOrders,
} from "@/features/order"
import {
  type MyReturnListResponse,
  RETURN_STATUS_LABEL,
  type ReturnStatus,
  useMyReturns,
} from "@/features/return"
import { useMyWallet } from "@/features/wallet"

import { PATHS } from "@/shared/config/paths"
import { formatRelativeTime } from "@/shared/lib/formatDate"

import styles from "./DashboardPage.module.css"

const { Title, Text } = Typography

const orderColumns: TableProps<MyOrderListResponse>["columns"] = [
  {
    title: "상태",
    dataIndex: "status",
    key: "status",
    render: (status: OrderStatus) => {
      const COLOR: Record<OrderStatus, TagProps["color"]> = {
        PENDING: "processing",
        PROCESSING: "warning",
        COMPLETED: "success",
        CANCELED: "default",
      }
      return (
        <Tag color={COLOR[status]} variant="outlined">
          {ORDER_STATUS_LABEL[status]}
        </Tag>
      )
    },
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

const returnColumns: TableProps<MyReturnListResponse>["columns"] = [
  {
    title: "상태",
    dataIndex: "status",
    key: "status",
    render: (status: ReturnStatus) => {
      const COLOR: Record<ReturnStatus, TagProps["color"]> = {
        PENDING: "processing",
        APPROVED: "default",
        REJECTED: "error",
        PROCESSING: "warning",
        COMPLETED: "success",
      }
      return (
        <Tag color={COLOR[status]} variant="outlined">
          {RETURN_STATUS_LABEL[status]}
        </Tag>
      )
    },
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

  const { data: lastUpload, isLoading: isLastUploadLoading } =
    useLastSalesUpload()
  const { data: wallet, isLoading: isWalletLoading } = useMyWallet()
  const { data: orders, isLoading: isOrdersLoading } = useMyOrders({ size: 5 })
  const { data: returns, isLoading: isReturnsLoading } = useMyReturns({
    size: 5,
  })
  const { data: notices, isLoading: isNoticesLoading } = useLatestNotices()

  return (
    <div className={styles.container}>
      <Title level={3}>대시보드</Title>

      <Row gutter={[16, 16]}>
        {/* 잔액 현황 */}
        <Col xs={24} md={16}>
          <Card loading={isWalletLoading}>
            <Flex vertical justify="center" align="center" gap="large">
              <Flex justify="space-evenly" align="stretch" gap="large">
                <Statistic
                  title="잔액"
                  value={wallet ? wallet.balance.toLocaleString() : 0}
                  suffix="원"
                />
                <Divider style={{ height: "auto" }} vertical />
                <Statistic
                  title="결제"
                  value={
                    wallet
                      ? (wallet.quota - wallet.balance).toLocaleString()
                      : 0
                  }
                  suffix="원"
                />
              </Flex>

              <Progress
                percent={
                  wallet && wallet.quota > 0
                    ? Math.round((wallet.balance / wallet.quota) * 100)
                    : 0
                }
                showInfo={false}
              />
            </Flex>
          </Card>
        </Col>

        {/* 판매 데이터 업로드 */}
        <Col xs={24} md={8}>
          <Card loading={isLastUploadLoading}>
            <Flex justify="space-between" align="center" gap="small" wrap>
              <Flex vertical gap="small">
                <Title level={5}>판매 데이터</Title>
                <Text type={lastUpload?.outdated ? "danger" : "secondary"}>
                  {lastUpload?.createdAt
                    ? `마지막 업로드: ${formatRelativeTime(lastUpload.createdAt)}`
                    : "판매 데이터가 없습니다"}
                </Text>
              </Flex>

              <SalesUploadModal />
            </Flex>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 최근 발주 */}
        <Col xs={24} lg={12}>
          <Card
            styles={{ body: { padding: 8 } }}
            title="최근 발주"
            extra={
              <Button
                className={styles.more}
                type="link"
                size="small"
                onClick={() => navigate(PATHS.BRANCH.ORDERS)}
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

        {/* 최근 반품 */}
        <Col xs={24} lg={12}>
          <Card
            styles={{ body: { padding: 8 } }}
            title="최근 반품"
            extra={
              <Button
                className={styles.more}
                type="link"
                size="small"
                onClick={() => navigate(PATHS.BRANCH.RETURNS)}
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

      {/* 최신 공지사항 */}
      <Card
        styles={{ body: { padding: 8 } }}
        title="최신 공지사항"
        extra={
          <Button
            className={styles.more}
            type="link"
            size="small"
            onClick={() => navigate(PATHS.BRANCH.NOTICES.LIST)}
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
    </div>
  )
}
