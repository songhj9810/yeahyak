import { useState } from "react"
import DaumPostcode from "react-daum-postcode"
import { Button, Modal } from "antd"

import { UI_WIDTH } from "@/shared/config/constants"

import type { PharmacyRegion } from "../types/enums"

const REGION_MAP: Record<string, PharmacyRegion> = {
  Seoul: "SEOUL",
  "Gyeonggi-do": "GYEONGGI",
  Incheon: "INCHEON",
  "Gangwon-do": "GANGWON",
  "Chungcheongbuk-do": "CHUNGBUK",
  "Sejong-si": "SEJONG",
  "Chungcheongnam-do": "CHUNGNAM",
  Daejeon: "DAEJEON",
  "Gyeongsangbuk-do": "GYEONGBUK",
  Daegu: "DAEGU",
  Ulsan: "ULSAN",
  Busan: "BUSAN",
  "Gyeongsangnam-do": "GYEONGNAM",
  "Jeonbuk-do": "JEONBUK",
  "Jeollanam-do": "JEONNAM",
  Gwangju: "GWANGJU",
  "Jeju-do": "JEJU",
}

export function AddressSearchModal({
  onComplete,
}: {
  onComplete: (data: {
    postcode: string
    address: string
    region: PharmacyRegion
  }) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>주소 검색</Button>

      <Modal
        title="주소 검색"
        open={open}
        width={UI_WIDTH.MODAL}
        centered
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnHidden
      >
        <DaumPostcode
          onComplete={(data) => {
            onComplete({
              postcode: data.zonecode,
              address: data.roadAddress || data.jibunAddress,
              region: REGION_MAP[data.sidoEnglish],
            })
            setOpen(false)
          }}
        />
      </Modal>
    </>
  )
}
