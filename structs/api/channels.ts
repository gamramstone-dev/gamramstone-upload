import { APIFetcher } from './base'

export interface Channel {
  id: string
  name: string
  thumbnail: string
  background?: string
  color?: string
}

/**
 * 채널 목록을 가져옵니다.
 * @returns 배열 형태의 채널 목록
 */
export const list = () => APIFetcher<Channel[]>('/channels')

const channels = {
  list,
}

export default channels
