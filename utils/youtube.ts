import { LanguageCode } from '../structs/airtable'

const fields = ['localizations']

interface YouTubeAPIResponse {
  kind: string
  id: string
  etag: string
}

interface YouTubeVideo {
  kind: 'youtube#video'
  etag: string
  id: string
  localizations?: Record<
    LanguageCode,
    {
      title: string
      description: string
    }
  >
}

interface YouTubeCaptionResponse extends YouTubeAPIResponse {
  snippet: {
    videoId: string
    lastUpdated: string
    trackKind: string
    language: string
    name: ''
    audioTrackType: string
    isCC: boolean
    isLarge: boolean
    isEasyReader: boolean
    isDraft: boolean
    isAutoSynced: boolean
    status: 'failed' | 'serving' | 'syncing'
    failureReason: 'processingFailed' | 'unknownFormat' | 'unsupportedFormat'
  }
}

interface YouTubeCaption {
  id: string
  lastUpdated: string
  trackKind: string
  language: LanguageCode
}

const chunks = (array: any[], size: number) =>
  array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size))
    return acc
  }, [])

const getVideoLocalizedMetadata = (data: YouTubeVideo) =>
  (data.localizations !== null &&
    typeof data.localizations === 'object' &&
    data.localizations) ||
  undefined

export const getYouTubeLocalizedVideos = async (ids: string[]) => {
  const reqs = [...chunks(ids, 50)]

  const ress = await Promise.all(
    reqs.map(v =>
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=${fields.join(
          ','
        )}&id=${v.join(',')}&key=${process.env.YOUTUBE_API_KEY}`
      ).then(v => v.json())
    )
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

export const getYouTubeSubtitleList = async (id: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${id}&key=${process.env.YOUTUBE_API_KEY}`
  )

  const data = await res.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  return data.items.map((v: YouTubeCaptionResponse) => ({
    id: v.id,
    videoId: v.snippet.videoId,
    lastUpdated: v.snippet.lastUpdated,
    trackKind: v.snippet.trackKind,
    language: v.snippet.language,
  })) as YouTubeCaption[]
}
