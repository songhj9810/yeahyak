import { Link } from "react-router-dom"
import { LockOutlined, MailOutlined } from "@ant-design/icons"
import { App, Button, Checkbox, Flex, Form, Input, Typography } from "antd"

import { PATHS } from "@/shared/config/paths"

import { useLoginAdmin, useLoginPharmacy } from "../hooks/useLogin"
import type { LoginRequest } from "../types/dto"
import type { UserRole } from "../types/enums"

const { Text } = Typography

type LoginFormProps = {
  role: UserRole
}

type LoginFormValues = LoginRequest & {
  remember?: boolean
}

export function LoginForm({ role }: LoginFormProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<LoginFormValues>()

  const { mutate: loginAdmin, isPending: isAdminPending } = useLoginAdmin()
  const { mutate: loginPharmacy, isPending: isPharmacyPending } =
    useLoginPharmacy()

  const mutate = role === "ADMIN" ? loginAdmin : loginPharmacy
  const isPending = role === "ADMIN" ? isAdminPending : isPharmacyPending

  const onFinish = (values: LoginFormValues) => {
    mutate(
      { email: values.email, password: values.password },
      { onError: (error) => message.error(error.message) }
    )
  }

  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger="onSubmit"
      onFinish={onFinish}
      clearOnDestroy
    >
      <Form.Item
        name="email"
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

      <Form.Item
        name="password"
        rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
      >
        <Input.Password
          styles={{ prefix: { marginInlineEnd: 8 } }}
          prefix={<LockOutlined />}
          placeholder="********"
          allowClear
        />
      </Form.Item>

      <Flex
        style={{ marginBottom: 12 }}
        justify="space-between"
        align="center"
        gap="small"
      >
        {/* TODO: 자동 로그인 기능 추가 */}
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>자동 로그인</Checkbox>
        </Form.Item>

        <Link to={PATHS.AUTH.FORGOT_PASSWORD}>
          <Text type="secondary">비밀번호를 잊으셨나요?</Text>
        </Link>
      </Flex>

      <Button block type="primary" htmlType="submit" loading={isPending}>
        로그인
      </Button>
    </Form>
  )
}
