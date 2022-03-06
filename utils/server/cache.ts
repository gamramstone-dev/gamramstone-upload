import { auth, get, set } from '@upstash/redis'
import { NextApiResponse } from 'next'
import {
  LanguageCode,
  TranslatedVideoMetadata,
  VideoWithCaption,
} from '../../structs/airtable'
import { getYouTubeId } from '../string'

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)

export const setCache = (key: string, value: string, ttl: number) =>
  set(key, value, 'EX', ttl)
export const getCache = (key: string) => get(key)

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
