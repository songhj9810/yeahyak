import { useEffect } from "react"
import { App, Button, Form, Input, Select, Skeleton, Typography } from "antd"

import {
  ADMIN_DEPARTMENT_LABEL,
  type AdminUpdateRequest,
  useMyAdmin,
  useUpdateAdmin,
} from "@/features/admin"

import styles from "./ProfilePage.module.css"

const { Title } = Typography

const departmentOptions = Object.entries(ADMIN_DEPARTMENT_LABEL).map(
  ([value, label]) => ({
    value,
    label,
  })
)

export default function ProfilePage() {
  const { message } = App.useApp()
  const [form] = Form.useForm<AdminUpdateRequest>()

  const { data: admin, isLoading } = useMyAdmin()

  const { mutate: updateAdmin, isPending } = useUpdateAdmin()

  useEffect(() => {
    if (admin) {
      form.setFieldsValue({
        newName: admin.name,
        newDepartment: admin.department,
      })
    }
  }, [admin, form])

  const onFinish = (values: AdminUpdateRequest) => {
    updateAdmin(
      { newName: values.newName, newDepartment: values.newDepartment },
      {
        onSuccess: () => message.success("내 정보를 수정했습니다"),
        onError: (error) => message.error(error.message),
      }
    )
  }

  if (isLoading) return <Skeleton active />
  if (!admin) return null

  return (
    <div className={styles.container}>
      <Title level={3}>내 정보</Title>

      <Form
        form={form}
        layout="vertical"
        validateTrigger="onBlur"
        onFinish={onFinish}
      >
        {/* 이메일 비활성화 */}
        <Form.Item label="이메일">
          <Input value={admin.email} variant="underlined" disabled />
        </Form.Item>

        {/* 사번 비활성화 */}
        <Form.Item label="사번">
          <Input value={admin.employeeId} variant="underlined" disabled />
        </Form.Item>

        <Form.Item
          name="newName"
          label="이름"
          rules={[{ required: true, message: "이름을 입력해주세요" }]}
        >
          <Input variant="underlined" />
        </Form.Item>

        <Form.Item
          name="newDepartment"
          label="부서"
          rules={[{ required: true, message: "부서를 선택해주세요" }]}
        >
          <Select options={departmentOptions} placeholder="부서 선택" />
        </Form.Item>

        <Button block type="primary" htmlType="submit" loading={isPending}>
          저장
        </Button>
      </Form>
    </div>
  )
}
