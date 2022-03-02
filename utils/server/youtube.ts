import { chunks } from '../items'
import {
  YouTubeCaption,
  YouTubeCaptionResponse,
  YouTubeVideo,
} from '../youtube'
import { getVideoCache, setVideosCache } from './database'

const fields = ['localizations']

const getVideoLocalizedMetadata = (data: YouTubeVideo) =>
  (data.localizations !== null &&
    typeof data.localizations === 'object' &&
    data.localizations) ||
  undefined

/**
 * YouTube에서 영상의 현지화 제목과 설명을 가져옵니다. API Quota 초과 방지를 위해 캐시를 1시간 저장합니다.
 *
 * @cost 1
 * @param ids YouTube 영상 ID 목록
 * @param key YouTube API 키
 * @returns
 */
export const getYouTubeLocalizedVideos = async (ids: string[], key: string) => {
  const reqs = [...chunks(ids, 50)]

  const ress = await Promise.all(
    reqs.map(async v => {
      const id = v.join(',')

      const cache = await getVideoCache(id)

      if (cache) {
        return JSON.parse(cache)
      }

      const data = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=${fields.join(
          ','
        )}&id=${id}&key=${key}`
      ).then(v => v.json())

      if (typeof data.error === 'undefined') {
        await setVideosCache(id, JSON.stringify(data))
      }

      return data
    })
  )

  for (let i = 0; i < ress.length; i++) {
    if (ress[i].error) {
      throw new Error(ress[i].error.message)
    }
  }

  const videos = [
    ...ress.map(res =>
      res.items.map((v: YouTubeVideo) => ({
        id: v.id,
        metadatas: getVideoLocalizedMetadata(v),
      }))
    ),
  ].flat(2)

  return videos
}

const parseCaptionResponse = (items: any) => {
  return items.map((v: YouTubeCaptionResponse) => ({
    id: v.id,
    videoId: v.snippet.videoId,
    lastUpdated: v.snippet.lastUpdated,
    trackKind: v.snippet.trackKind,
    language: v.snippet.language,
  })) as YouTubeCaption[]
}

/**
 * YouTube에서 자막 CC 파일을 가져옵니다. API Quota 초과 방지를 위해 캐시를 1시간 저장합니다.
 *
 * @cost 400
 * @param id YouTube 영상 ID
 * @param key YouTube API 키
 * @returns
 */
export const getYouTubeSubtitleList = async (id: string, key: string) => {
  const cache = await getVideoCache(`subtitle:${id}`)

  if (cache) {
    return parseCaptionResponse(JSON.parse(cache))
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${id}&key=${key}`
  )

  const data = await res.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  await setVideosCache(`subtitle:${id}`, JSON.stringify(data))

  return parseCaptionResponse(data.items)
}
