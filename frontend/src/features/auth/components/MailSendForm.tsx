import { MailOutlined } from "@ant-design/icons"
import { App, Button, Form, Input } from "antd"

import { useSendPasswordResetMail } from "../hooks/useSendPasswordResetMail"
import type { MailSendRequest } from "../types/dto"

type MailSendFormProps = {
  onMailSent: (email: string) => void
}

export function MailSendForm({ onMailSent }: MailSendFormProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<MailSendRequest>()
  const emailValue = Form.useWatch("email", form)

  const { mutate: sendMail, isPending } = useSendPasswordResetMail()

  const onFinish = (values: MailSendRequest) => {
    sendMail(
      { email: values.email },
      {
        onSuccess: () => onMailSent(values.email),
        onError: (error) => message.error(error.message),
      }
    )
  }

  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger="onBlur"
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        label="이메일"
        validateFirst
        rules={[
          { required: true, message: "이메일을 입력해주세요" },
          { type: "email", message: "유효하지 않은 이메일 형식입니다" },
        ]}
      >
        <Input
          styles={{ prefix: { marginInlineEnd: 8 } }}
          prefix={<MailOutlined />}
          placeholder="user@yeahyak.com"
          inputMode="email"
          allowClear
        />
      </Form.Item>

      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isPending}
        disabled={!emailValue}
      >
        재설정 링크 보내기
      </Button>
    </Form>
  )
}
