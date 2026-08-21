import { useNavigate, useParams } from "react-router-dom"
import { PaperClipOutlined, UnorderedListOutlined } from "@ant-design/icons"
import {
  App,
  Button,
  Card,
  Divider,
  Flex,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd"
import DOMPurify from "dompurify"

import { useMyAdmin } from "@/features/admin"
import { useRole } from "@/features/auth"
import {
  NOTICE_CATEGORY_LABEL,
  useDeleteNotice,
  useNotice,
} from "@/features/notice"

import { PATHS } from "@/shared/config/paths"
import { formatDateTime } from "@/shared/lib/formatDate"

import styles from "./NoticeDetailPage.module.css"

const { Title, Text, Link } = Typography

async function handleAttachmentDownload(filePath: string, fileName: string) {
  try {
    const res = await fetch(filePath)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    window.open(filePath, "_blank")
  }
}

export default function NoticeDetailPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  const { id } = useParams<{ id: string }>()
  const noticeId = Number(id)

  const role = useRole()
  const { data: admin } = useMyAdmin({ enabled: role === "ADMIN" })

  const { data: notice, isLoading } = useNotice(noticeId)

  const { mutate: deleteNotice, isPending } = useDeleteNotice(noticeId)

  const handleDelete = () => {
    deleteNotice(undefined, {
      onSuccess: () => message.success("공지사항을 삭제했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  if (isLoading) return <Skeleton active />
  if (!notice) return null

  return (
    <div className={styles.container}>
      {/* 상단 공지사항 정보 */}
      <Space vertical>
        <Tag color="cyan" variant="outlined">
          {NOTICE_CATEGORY_LABEL[notice.category]}
        </Tag>

        <Title level={4}>{notice.title}</Title>

        <Space align="center" separator={<Divider vertical />}>
          <Text type="secondary">{formatDateTime(notice.createdAt)}</Text>
          <Text type="secondary">{notice.adminName}</Text>
        </Space>
      </Space>

      {notice.attachments.length > 0 && (
        <Space vertical align="start">
          {notice.attachments.map((attachment) => (
            <Link
              className={styles.attachment}
              key={attachment.id}
              onClick={() =>
                handleAttachmentDownload(
                  attachment.filePath,
                  attachment.fileName
                )
              }
            >
              <PaperClipOutlined className={styles.attachmentIcon} />{" "}
              {attachment.fileName}
            </Link>
          ))}
        </Space>
      )}

      {/* 본문 */}
      <Card>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(notice.content),
          }}
        />
      </Card>

      {/* 하단 액션 버튼 */}
      <Flex justify="space-between" align="center" gap="small" wrap>
        <Button
          type="text"
          icon={<UnorderedListOutlined />}
          onClick={() =>
            navigate(
              role === "ADMIN"
                ? `${PATHS.HQ.NOTICES.LIST}?category=${notice.category}`
                : `${PATHS.BRANCH.NOTICES.LIST}?category=${notice.category}`
            )
          }
        >
          목록으로
        </Button>

        {admin && admin.id === notice.adminId && (
          <Flex justify="end" align="center" gap="small">
            <Button onClick={() => navigate(PATHS.HQ.NOTICES.EDIT(noticeId))}>
              수정
            </Button>

            <Popconfirm
              title="공지사항을 삭제하시겠습니까?"
              placement="topRight"
              okText="삭제"
              okType="danger"
              onConfirm={handleDelete}
            >
              <Button danger loading={isPending}>
                삭제
              </Button>
            </Popconfirm>
          </Flex>
        )}
      </Flex>
    </div>
  )
}
