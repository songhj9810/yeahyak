import { Typography } from "antd"

import { NoticeEditor } from "@/features/notice"

import styles from "./NoticeCreatePage.module.css"

const { Title } = Typography

export default function NoticeCreatePage() {
  return (
    <div className={styles.container}>
      <Title level={3}>공지사항 등록</Title>
      <NoticeEditor />
    </div>
  )
}
