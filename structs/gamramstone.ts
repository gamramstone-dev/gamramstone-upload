import { LanguageCode } from './common'

export interface Video {
  id: string
  channel: {
    id: string
    name: string
    thumbnail: string
  }
  state: number
  metadata: {
    title: string
    description: string
    type: number
    url: string
    duraton: number
    upload_date: string
    deleted: boolean
  }
  transcription: number
  translations: Record<LanguageCode, number>
}

export interface Paginated<T> {
  page: number
  per_page: number
  total: number
  data: T
}

export const enum OverallState {
  NoWork = -1,
  Waiting = 0,
  Working = 1,
  Done = 100,
  NeedReUpload = 105,
  UploadDone = 110,
}

export const enum SpecificState {
  Waiting = 0,
  Translating = 1,
  Captioning = 2,
  ExtraCaptioning = 3,
  Reworking = 10,
  Reviewing = 50,
  Done = 100,
}

export const OverallStateNames: Record<OverallState, string> = {
  [OverallState.NoWork]: '작업 안함',
  [OverallState.Waiting]: '작업 대기 중',
  [OverallState.Working]: '작업 중',
  [OverallState.Done]: '업로드 대기 중',
  [OverallState.NeedReUpload]: '재 업로드 대기 중',
  [OverallState.UploadDone]: '업로드 완료',
}
