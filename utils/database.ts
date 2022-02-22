import { auth, del, hgetall, hmset, set } from '@upstash/redis'
import { DatabaseUser } from '../structs/user'

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)

const hashesToObject = <T>(arr: string[]): T => {
  let r: { [index: string]: unknown } = {}

  for (let i = 0; i < arr.length; i += 2) {
    let key = arr[i],
      value = arr[i + 1]
    r[key] = value
  }

  return (r as unknown) as T
}

export const getUser = async (id: string) => {
  const user = await hgetall(`user:${id}`)

  if (user.error) {
    throw new Error(user.error)
  }

  if (user.data === null || user.data.length === 0) {
    return null
  }

  return hashesToObject<DatabaseUser>(user.data)
}

export const deleteUser = async (id: string) => {
  const user = await del(`user:${id}`)

  if (user.error) {
    throw new Error(user.error)
  }

  return user.data
}

export const updateUserSettings = async (id: string, settings: string) => {
  const result = await hmset(`user:${id}`, 'settings', settings)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}

export const createRegisterRequest = async (code: string, id: string) => {
  const result = await set(`request:${code}`, id, 'EX', 10800)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}
