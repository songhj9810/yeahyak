import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UploadOutlined } from "@ant-design/icons"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import type { UploadFile } from "antd"
import { App, Button, Card, Flex, Form, Input, Select, Upload } from "antd"

import { PATHS } from "@/shared/config/paths"

import { useCreateNotice } from "../hooks/useCreateNotice"
import { useUpdateNotice } from "../hooks/useUpdateNotice"
import type { NoticeResponse } from "../types/dto"
import { NOTICE_CATEGORY_LABEL, type NoticeCategory } from "../types/enums"
import { EditorToolbar } from "./EditorToolbar"

type NoticeEditorProps = {
  noticeId?: number
  notice?: NoticeResponse
}

type NoticeEditorFormValues = {
  category: NoticeCategory
  title: string
}

const MAX_COUNT = 3

const categoryOptions = Object.entries(NOTICE_CATEGORY_LABEL).map(
  ([value, label]) => ({ value, label })
)

// 기존 첨부파일을 Upload 컴포넌트에서 사용하는 형식으로 변환 (status: "done")
const toUploadFile = (
  attachment: NoticeResponse["attachments"][number]
): UploadFile => ({
  uid: String(attachment.id),
  name: attachment.fileName,
  status: "done",
  url: attachment.filePath,
})

export function NoticeEditor({ noticeId, notice }: NoticeEditorProps) {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm<NoticeEditorFormValues>()

  const [fileList, setFileList] = useState<UploadFile[]>(
    () => notice?.attachments.map(toUploadFile) ?? []
  )

  const { mutate: createNotice, isPending: isCreating } = useCreateNotice()
  const { mutate: updateNotice, isPending: isUpdating } = useUpdateNotice(
    noticeId!
  )

  // 에디터 준비
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
  })

  useEffect(() => {
    if (notice && editor) {
      form.setFieldsValue({
        category: notice.category,
        title: notice.title,
      })
      editor.commands.setContent(notice.content)
    }
  }, [notice, editor, form])

  const onFinish = (values: NoticeEditorFormValues) => {
    const content = editor.getHTML() ?? "내용 없음"

    // 삭제된 기존 첨부파일 ID 추출
    const getAttachmentIdsToDelete = () => {
      const originalIds = new Set(
        notice?.attachments.map((attachment) => String(attachment.id)) ?? []
      )
      const currentIds = new Set(fileList.map((file) => file.uid))
      return [...originalIds].filter((id) => !currentIds.has(id)).map(Number)
    }

    // 새로 추가된 첨부파일 File 객체 추출
    const files = fileList
      .filter((file) => file.status !== "done")
      .map((file) => file.originFileObj as File)
      .filter(Boolean)

    if (notice) {
      updateNotice(
        {
          request: {
            newTitle: values.title,
            newContent: content,
            attachmentIdsToDelete: getAttachmentIdsToDelete(),
          },
          files,
        },
        {
          onSuccess: () => message.success("공지사항을 수정했습니다"),
          onError: (error) => message.error(error.message),
        }
      )
    } else {
      createNotice(
        {
          request: {
            category: values.category,
            title: values.title,
            content,
          },
          files,
        },
        {
          onSuccess: () => message.success("공지사항을 등록했습니다"),
          onError: (error) => message.error(error.message),
        }
      )
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger="onBlur"
      onFinish={onFinish}
    >
      <Form.Item
        name="category"
        rules={[{ required: true, message: "카테고리를 선택해주세요" }]}
      >
        <Select
          style={{ width: "fit-content" }}
          options={categoryOptions}
          placeholder="카테고리 선택"
          popupMatchSelectWidth={false}
          disabled={!!notice} // 수정 시 카테고리 변경 불가
        />
      </Form.Item>

      <Form.Item
        name="title"
        rules={[{ required: true, message: "제목을 입력해주세요" }]}
      >
        <Input
          placeholder="제목을 입력해주세요"
          variant="underlined"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Upload
          multiple
          maxCount={MAX_COUNT}
          beforeUpload={() => false} // 자동 업로드 방지
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
        >
          <Button
            icon={<UploadOutlined />}
            disabled={fileList.length >= MAX_COUNT}
          >
            첨부파일 선택 ({fileList.length}/{MAX_COUNT})
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Card
          styles={{
            header: {
              position: "sticky",
              top: 64,
              backgroundColor: "#ffffff",
              zIndex: 1,
            },
          }}
          title={<EditorToolbar editor={editor} />}
        >
          <EditorContent editor={editor} />
        </Card>
      </Form.Item>

      <Flex justify="end" align="center" gap="small">
        <Button
          onClick={() =>
            navigate(
              notice
                ? PATHS.HQ.NOTICES.DETAIL(noticeId!)
                : PATHS.HQ.NOTICES.LIST
            )
          }
        >
          취소
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          loading={isCreating || isUpdating}
        >
          {notice ? "수정" : "등록"}
        </Button>
      </Flex>
    </Form>
  )
}
