import { useState } from "react"
import {
  CloseOutlined,
  MedicineBoxOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons"
import { Card, FloatButton } from "antd"

import { FaqChat } from "./FaqChat"
import { QnaChat } from "./QnaChat"

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [chatType, setChatType] = useState<"FAQ" | "QNA">()
  const [sessionId] = useState(() => crypto.randomUUID())

  return (
    <>
      <FloatButton.Group
        style={{ insetInlineEnd: "24px" }}
        type="primary"
        icon={<MessageOutlined />}
        trigger="click"
        tooltip={{ title: "도움이 필요하신가요?", placement: "left" }}
      >
        <FloatButton
          icon={<QuestionCircleOutlined />}
          onClick={() => {
            setOpen(true)
            setChatType("FAQ")
          }}
          tooltip={{
            title: "운영에 대해 궁금한 점을 물어보세요!",
            placement: "left",
          }}
        />
        <FloatButton
          icon={<MedicineBoxOutlined />}
          onClick={() => {
            setOpen(true)
            setChatType("QNA")
          }}
          tooltip={{
            title: "의약품에 대해 궁금한 점을 물어보세요!",
            placement: "left",
          }}
        />
      </FloatButton.Group>

      {open && (
        <Card
          styles={{
            root: {
              position: "fixed", // 화면에 고정
              bottom: "88px",
              right: "80px",
              display: "flex",
              flexDirection: "column",
              width: 360,
              height: 480,
              borderRadius: 16,
              boxShadow: "0px 9px 28px 0px rgba(0, 0, 0, 0.05)",
              zIndex: 50,
            },
            body: {
              padding: 0,
              overflow: "hidden",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            },
          }}
          title={chatType === "FAQ" ? "운영 도우미" : "의약품 AI 어시스턴트"}
          extra={
            <CloseOutlined
              onClick={() => setOpen(false)}
              style={{ cursor: "pointer" }}
            />
          }
        >
          {chatType === "FAQ" ? (
            <FaqChat sessionId={`faq-${sessionId}`} />
          ) : (
            <QnaChat sessionId={`qna-${sessionId}`} />
          )}
        </Card>
      )}
    </>
  )
}
