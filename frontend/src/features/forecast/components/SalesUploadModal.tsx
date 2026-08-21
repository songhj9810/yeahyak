import { useState } from "react"
import { UploadOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd"
import { App, Button, Modal, Upload } from "antd"

import { UI_WIDTH } from "@/shared/config/constants"

import { useUploadSales } from "../hooks/useUploadSales"

export function SalesUploadModal() {
  const { message } = App.useApp()

  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<UploadFile>()

  const { mutate: uploadSales, isPending } = useUploadSales()

  const handleUpload = () => {
    if (!file?.originFileObj) return

    uploadSales(file.originFileObj, {
      onSuccess: () => {
        message.success("판매 데이터를 업로드했습니다")
        setOpen(false)
        setFile(undefined)
      },
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={() => setOpen(true)}
        loading={isPending}
      >
        업로드
      </Button>

      <Modal
        title="판매 데이터 업로드"
        open={open}
        width={UI_WIDTH.MODAL}
        centered
        onOk={handleUpload}
        onCancel={() => {
          setOpen(false)
          setFile(undefined)
        }}
        confirmLoading={isPending}
        okButtonProps={{ disabled: !file }}
        destroyOnHidden
      >
        <Upload
          accept=".csv"
          maxCount={1}
          beforeUpload={() => false} // 자동 업로드 방지
          fileList={file ? [file] : []}
          onChange={({ fileList }) => setFile(fileList[0])}
        >
          <Button icon={<UploadOutlined />}>파일 선택</Button>
        </Upload>
      </Modal>
    </>
  )
}
