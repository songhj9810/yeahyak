import { LockOutlined } from "@ant-design/icons"
import { App, Button, Checkbox, Form, Input, Select } from "antd"

import { ADMIN_DEPARTMENT_LABEL } from "@/features/admin"

import { useSignupAdmin } from "../hooks/useSignup"
import type { AdminSignupRequest } from "../types/dto"

type AdminSignupFormProps = {
  email: string
  token: string
}

type AdminSignupFormValues = Omit<AdminSignupRequest, "token"> & {
  confirmPassword: string
  agreement: boolean
}

const departmentOptions = Object.entries(ADMIN_DEPARTMENT_LABEL).map(
  ([value, label]) => ({ value, label })
)

export function AdminSignupForm({ email, token }: AdminSignupFormProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<AdminSignupFormValues>()
  const agreed = Form.useWatch("agreement", form)

  const { mutate: signupAdmin, isPending } = useSignupAdmin()

  const onFinish = (values: AdminSignupFormValues) => {
    signupAdmin(
      {
        token,
        password: values.password,
        employeeId: values.employeeId,
        name: values.name,
        department: values.department,
      },
      { onError: (error) => message.error(error.message) }
    )
  }

  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger="onBlur"
      onFinish={onFinish}
      scrollToFirstError
    >
      {/* 이메일 비활성화 */}
      <Form.Item label="이메일">
        <Input value={email} disabled />
      </Form.Item>

      <Form.Item
        name="password"
        label="비밀번호"
        hasFeedback
        validateFirst
        validateTrigger="onChange"
        rules={[
          { required: true, message: "비밀번호를 입력해주세요" },
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
        dependencies={["password"]}
        hasFeedback
        validateFirst
        validateTrigger="onChange"
        rules={[
          { required: true, message: "비밀번호 확인을 입력해주세요" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
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

      <Form.Item
        name="name"
        label="이름"
        rules={[{ required: true, message: "이름을 입력해주세요" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="employeeId"
        label="사번"
        rules={[{ required: true, message: "사번을 입력해주세요" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="department"
        label="부서"
        rules={[{ required: true, message: "부서를 선택해주세요" }]}
      >
        <Select options={departmentOptions} placeholder="부서 선택" />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("이용약관에 동의해주세요")),
          },
        ]}
      >
        <Checkbox>이용약관에 동의합니다.</Checkbox>
      </Form.Item>

      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isPending}
        disabled={!agreed}
      >
        회원가입
      </Button>
    </Form>
  )
}
