import { useMemo, useState } from "react"
import type { BubbleItemType, BubbleListProps } from "@ant-design/x"
import { Bubble, Sender } from "@ant-design/x"
import { Flex } from "antd"
import DOMPurify from "dompurify"
import MarkdownIt from "markdown-it"

import { aiClient } from "@/shared/api/client"
import type { ApiResponse } from "@/shared/api/types"

type QnaChatProps = {
  sessionId: string
}

const md = new MarkdownIt({ html: false, breaks: true, linkify: true })

export function QnaChat({ sessionId }: QnaChatProps) {
  const [input, setInput] = useState("")
  const [items, setItems] = useState<BubbleItemType[]>([
    {
      key: 0,
      role: "assistant",
      content:
        "안녕하세요! 의약품 효능, 주의사항, 병용금기 등을 조회해드립니다.",
    },
  ])
  const [loading, setLoading] = useState(false)

  const roles: BubbleListProps["role"] = useMemo(
    () => ({
      user: { placement: "end" },
      assistant: {
        placement: "start",
        contentRender: (content) => (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(md.render(String(content))),
            }}
          />
        ),
      },
    }),
    []
  )

  const handleSend = async (value: string) => {
    if (!value.trim()) return

    setItems((prev) => [
      ...prev,
      { key: prev.length, role: "user", content: value },
    ])
    setLoading(true)
    setInput("")

    try {
      const response = await aiClient.post<ApiResponse<{ answer: string }>>(
        "/chatbot/qna",
        {
          question: value,
          session_id: sessionId,
        }
      )
      setItems((prev) => [
        ...prev,
        {
          key: prev.length,
          role: "assistant",
          content: response.data.data.answer,
        },
      ])
    } catch {
      setItems((prev) => [
        ...prev,
        {
          key: prev.length,
          role: "assistant",
          content: "오류가 발생했습니다. 다시 시도해주세요.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex
      style={{ height: "100%", width: "100%" }}
      vertical
      justify="space-between"
      align="center"
    >
      <Bubble.List
        style={{ flex: 1, overflow: "auto" }}
        items={items}
        role={roles}
        autoScroll
      />
      <Sender
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        loading={loading}
        placeholder="질문을 입력해주세요"
      />
    </Flex>
  )
}
