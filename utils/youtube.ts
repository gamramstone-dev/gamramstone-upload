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

export const getYouTubeLocalizedVideos = async (ids: string[], key: string) => {
  const reqs = [...chunks(ids, 50)]

  const ress = await Promise.all(
    reqs.map(v =>
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=${fields.join(
          ','
        )}&id=${v.join(',')}&key=${key}`
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

export const getYouTubeSubtitleList = async (id: string, key: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${id}&key=${key}`
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

const getYouTubeVideoSnippetLocalizations = async (
  id: string,
  token: string
) => {
  const result = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet&part=localizations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then(v => v.json())

  if (result.error) {
    if (result.error.message === 'Request had insufficient authentication scopes.') {
      throw new Error('로그인할 때 권한이 부여되지 않았습니다. 화면 오른쪽 위 계정 아이콘을 클릭해 로그아웃 한 후 다시 로그인해주세요.')
    }

    throw new Error('영상 snippet을 가져올 수 없습니다.')
  }

  if (result.items.length === 0) {
    throw new Error('영상을 찾을 수 없습니다.')
  }

  return [result.items[0].snippet, result.items[0].localizations]
}

export const validateAccessToken = async (token: string) => {
  const result = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
  ).then(v => v.json())

  if (result.error_description) {
    throw new Error(result.error_description)
  }

  return true
}

export const updateYouTubeTitleMetadata = async (
  id: string,
  token: string,
  data: Partial<Record<LanguageCode, { title: string; description: string }>>
) => {
  const [snippet, localizations] = await getYouTubeVideoSnippetLocalizations(
    id,
    token
  )

  if (!snippet) {
    return null
  }

  const result = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=localizations&part=snippet`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        snippet: {
          ...snippet,
          defaultLanguage: 'ko-kr',
        },
        localizations: !localizations ? data : { ...localizations, ...data },
      }),
    }
  ).then(v => v.json())

  if (result.error) {
    if (result.error.message === 'Forbidden') {
      throw new Error('접근 권한이 없습니다. 본인 영상이 맞나요?')
    }

    throw new Error(result.error.message)
  }

  return result
}
