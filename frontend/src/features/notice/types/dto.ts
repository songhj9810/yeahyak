import type { NoticeCategory } from "./enums"

export type AttachmentResponse = {
  id: number
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
}

export type NoticeResponse = {
  id: number
  category: NoticeCategory
  title: string
  content: string
  createdAt: string
  updatedAt: string
  adminId: number
  adminName: string
  attachments: AttachmentResponse[]
}

export type NoticeListResponse = {
  id: number
  category: NoticeCategory
  title: string
  createdAt: string
  adminName: string
}

export type NoticeCreateRequest = {
  category: NoticeCategory
  title: string
  content: string
}

export type NoticeCreateResponse = {
  id: number
}

export type NoticeUpdateRequest = {
  newTitle?: string
  newContent?: string
  attachmentIdsToDelete?: number[]
}
