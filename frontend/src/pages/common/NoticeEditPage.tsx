import { useParams } from "react-router-dom"
import { Skeleton, Typography } from "antd"

import { useNotice } from "@/features/notice"
import { NoticeEditor } from "@/features/notice"

import styles from "./NoticeEditPage.module.css"

const { Title } = Typography

export default function NoticeEditPage() {
  const { id } = useParams<{ id: string }>()
  const noticeId = Number(id)

  const { data: notice, isLoading } = useNotice(noticeId)

  if (isLoading) return <Skeleton active />
  if (!notice) return null

  return (
    <div className={styles.container}>
      <Title level={3}>공지사항 수정</Title>
      <NoticeEditor noticeId={noticeId} notice={notice} />
    </div>
  )
}
