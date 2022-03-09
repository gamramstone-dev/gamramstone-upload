import { auth, get, set } from '@upstash/redis'
import { NextApiResponse } from 'next'
import {
  TranslatedVideoMetadata,
} from '../../structs/airtable'

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)

export const setCache = (key: string, value: string, ttl: number) =>
  set(key, value, 'EX', ttl)
export const getCache = (key: string) => get(key)

/**
 * 영상 목록 캐시를 받아와 해당 영상의 상태를 업로드 완료 처리로 바꿉니다.
 * 이 값을 바꾼다고 AirTable에 있는 값이 변경되지는 않습니다.
 * @param key 
 * @param lang 
 * @param videos 
 * @returns 
 */
export const markAsDoneVideos = async (
  key: string,
  lang: string,
  videos: string[]
) => {
  const cache = await getCache(key)

  if (cache.error || !cache.data) {
    return
  }

  const lists = JSON.parse(cache.data)

  if (!Array.isArray(lists)) {
    return
  }

  await setCache(
    key,
    JSON.stringify(
      lists.map(v => {
        if (videos.includes(v.url)) {
          return {
            ...v,
            captions: v.captions.map((c: TranslatedVideoMetadata) =>
              c.language === lang
                ? {
                    ...c,
                    status: 'done',
                  }
                : c
            ),
          }
        }

        return v
      })
    ),
    60
  )
}

export const cachify = async (
  scope: string,
  res: NextApiResponse,
  func: (...args: any[]) => unknown
) => {
  const { error, data } = await getCache(scope)

  if (error === null && data !== null) {
    res.setHeader('X-Cache-Hit', 'true')

    return JSON.parse(data)
  }

  const result = await func()

  setCache(scope, JSON.stringify(result), 120)

  return result
}
