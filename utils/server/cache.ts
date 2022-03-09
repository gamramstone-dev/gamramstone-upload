import { Redis } from '@upstash/redis'
import { NextApiResponse } from 'next'
import { TranslatedVideoMetadata } from '../../structs/airtable'

const redis = Redis.fromEnv()

export const setCache = (key: string, value: string, ttl: number) =>
  redis.set(key, value, {
    ex: ttl,
  })
export const getCache = <T = unknown>(key: string) => redis.get<T>(key)

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

  console.log(cache)

  if (!Array.isArray(cache)) {
    return
  }

  await setCache(
    key,
    JSON.stringify(
      cache.map(v => {
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

export const cachify = async <T>(
  scope: string,
  res: NextApiResponse,
  func: (...args: any[]) => T
): Promise<T> => {
  const data = await getCache<T>(scope)

  if (data !== null) {
    res.setHeader('X-Cache-Hit', 'true')

    return data
  }

  const result = await func()

  setCache(scope, JSON.stringify(result), 120)

  return result
}
