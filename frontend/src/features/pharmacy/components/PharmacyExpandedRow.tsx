import type { DescriptionsProps } from "antd"
import { Descriptions, Skeleton } from "antd"

import { WalletDrawer } from "@/features/wallet"

import { formatDate } from "@/shared/lib/formatDate"

import { usePharmacy } from "../hooks/usePharmacy"

import styles from "./PharmacyExpandedRow.module.css"

interface PharmacyExpandedRowProps {
  pharmacyId: number
}

export function PharmacyExpandedRow({ pharmacyId }: PharmacyExpandedRowProps) {
  const { data: pharmacy, isLoading } = usePharmacy(pharmacyId)

  if (isLoading) return <Skeleton active />
  if (!pharmacy) return null

  const descriptionItems: DescriptionsProps["items"] = [
    {
      key: "representative",
      label: "대표자",
      children: pharmacy.representative,
    },
    {
      key: "brn",
      label: "사업자등록번호",
      children: pharmacy.brn,
    },
    {
      key: "email",
      label: "이메일",
      children: pharmacy.email,
    },
    {
      key: "addressDetails",
      label: "상세주소",
      children: pharmacy.addressDetails || "-",
    },
    {
      key: "createdAt",
      label: "가입일",
      children: formatDate(pharmacy.createdAt),
    },
  ]

  return (
    <Descriptions
      className={styles.descriptions}
      items={descriptionItems}
      column={2}
      bordered
      size="small"
      extra={
        <WalletDrawer pharmacyId={pharmacy.id} pharmacyName={pharmacy.name} />
      }
    />
  )
}
