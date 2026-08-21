import { useEffect, useState } from "react"
import { LockOutlined } from "@ant-design/icons"
import { App, Button, Form, Input } from "antd"

import { useResetPassword } from "../hooks/useResetPassword"
import type { PasswordResetRequest } from "../types/dto"

type PasswordResetFormProps = {
  token: string
}

type PasswordResetFormValues = Pick<PasswordResetRequest, "newPassword"> & {
  confirmPassword: string
}

export function PasswordResetForm({ token }: PasswordResetFormProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<PasswordResetFormValues>()
  const values = Form.useWatch([], form)

  const [submittable, setSubmittable] = useState(false) // validation 통과 여부

  const { mutate: resetPassword, isPending } = useResetPassword()

  const onFinish = (values: PasswordResetFormValues) => {
    resetPassword(
      { token, newPassword: values.newPassword },
      { onError: (error) => message.error(error.message) }
    )
  }

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false))
  }, [form, values])

  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger="onChange"
      onFinish={onFinish}
    >
      <Form.Item
        name="newPassword"
        label="새 비밀번호"
        hasFeedback
        validateFirst
        rules={[
          { required: true, message: "새 비밀번호를 입력해주세요" },
          {
            pattern:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            message: "영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다",
          },
        ]}
      >
        <Input.Password
          styles={{ prefix: { marginInlineEnd: 8 } }}
          prefix={<LockOutlined />}
          placeholder="영문, 숫자, 특수문자 조합 (8자리 이상)"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="비밀번호 확인"
        dependencies={["newPassword"]}
        hasFeedback
        validateFirst
        rules={[
          { required: true, message: "비밀번호 확인을 입력해주세요" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error("비밀번호가 일치하지 않습니다"))
            },
          }),
        ]}
      >
        <Input.Password
          styles={{ prefix: { marginInlineEnd: 8 } }}
          prefix={<LockOutlined />}
          placeholder="비밀번호 확인"
          allowClear
        />
      </Form.Item>

      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isPending}
        disabled={!submittable}
      >
        비밀번호 재설정
      </Button>
    </Form>
  )
}
