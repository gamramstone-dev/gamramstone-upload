import { auth, get, set } from '@upstash/redis'
import { NextApiResponse } from 'next'

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)

export const setCache = (key: string, value: string, ttl: number) =>
  set(key, value, 'EX', ttl)
export const getCache = (key: string) => get(key)

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
