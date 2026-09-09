import { useState } from "react"
import { ExperimentOutlined, UploadOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd"
import { App, Button, Modal, Space, Upload } from "antd"

import { getPharmacyStocks } from "@/features/inventory"

import { UI_WIDTH } from "@/shared/config/constants"

import { useUploadSales } from "../hooks/useUploadSales"
import { generateDummySalesCsv } from "../utils/generateDummySalesCsv"

export function SalesUploadModal() {
  const { message } = App.useApp()

  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<UploadFile>()
  const [isDummyLoading, setIsDummyLoading] = useState(false)

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

  const handleDummyUpload = async () => {
    setIsDummyLoading(true)
    try {
      const { content } = await getPharmacyStocks({ size: 100 })
      const dummyFile = generateDummySalesCsv(content)
      uploadSales(dummyFile, {
        onSuccess: () => {
          message.success("더미 판매 데이터를 업로드했습니다")
          setOpen(false)
          setFile(undefined)
        },
        onError: (error) => message.error(error.message),
      })
    } catch {
      message.error("더미 데이터 생성에 실패했습니다")
    } finally {
      setIsDummyLoading(false)
    }
  }

  const isLoading = isPending || isDummyLoading

  return (
    <>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={() => setOpen(true)}
        loading={isLoading}
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
        <Space>
          <Upload
            accept=".csv"
            maxCount={1}
            beforeUpload={() => false} // 자동 업로드 방지
            fileList={file ? [file] : []}
            onChange={({ fileList }) => setFile(fileList[0])}
          >
            <Button icon={<UploadOutlined />}>파일 선택</Button>
          </Upload>

          <Button
            icon={<ExperimentOutlined />}
            onClick={handleDummyUpload}
            loading={isDummyLoading}
          >
            더미 데이터
          </Button>
        </Space>
      </Modal>
    </>
  )
}
