import {
  auth,
  del,
  get,
  hdel,
  hexists,
  hget,
  hgetall,
  hkeys,
  hmset,
  hset,
} from '@upstash/redis'
import { v4 } from 'uuid'
import { DatabaseUser } from '../../structs/user'
import { objectToJSON } from '../string'

import crypto from 'crypto'
import { setCache } from './cache'

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

export const getUUIDUser = async (uuid: string) => {
  const result = await hget('usersUUID', uuid)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
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

export const listUsersUUID = async () => {
  const users = await hkeys('usersUUID')

  if (users.error) {
    throw new Error(users.error)
  }

  return users.data
}

const DefaultUserTemplate = () =>
  ({
    state: 'guest',
    lastLogin: new Date().toISOString(),
    settings: {
      darkMode: false,
    },
  } as DatabaseUser)

export const createUser = async (
  id: string,
  fields: Partial<DatabaseUser> = DefaultUserTemplate()
): Promise<DatabaseUser> => {
  const uuid = v4()

  if (await checkUUIDExists(uuid)) {
    return createUser(id, fields)
  }

  const data = {
    ...DefaultUserTemplate(),
    ...fields,
    uuid,
  }

  const result = await hset(
    `user:${id}`,
    ...Object.entries(data)
      .flat()
      .map(objectToJSON)
  )

  const uuidUpdate = await hset('usersUUID', uuid, id)

  if (uuidUpdate.error) {
    throw new Error(uuidUpdate.error)
  }

  if (result.error) {
    throw new Error(result.error)
  }

  return data
}

export const checkUUIDExists = async (uuid: string) => {
  const result = await hexists('usersUUID', uuid)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data === 1
}

export const deleteUser = async (id: string) => {
  const user = await getUser(id)

  if (user === null) {
    throw new Error('User not found.')
  }

  const deleteResult = await hdel('usersUUID', user.uuid)

  if (deleteResult.error) {
    throw new Error(`failed to delete user uuid: ${deleteResult.error}`)
  }

  const result = await del(`user:${id}`)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}

export const updateUser = async (id: string, data: Partial<DatabaseUser>) => {
  const user = await getUser(id)

  if (user === null) {
    throw new Error('User not found.')
  }

  const result = await hset(
    `user:${id}`,
    ...Object.entries({
      ...user,
      ...data,
    })
      .flat()
      .map(objectToJSON)
  )

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}

export const updateUserSettings = async (id: string, settings: string) => {
  const result = await hmset(`user:${id}`, 'settings', settings)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}

export const sha256 = (data: string) =>
  crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')

export const setVideosCache = async (id: string, data: string) => {
  const result = await setCache(`videos:${sha256(id)}`, data, 60 * 60)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}

export const getVideoCache = async (id: string) => {
  const result = await get(`videos:${sha256(id)}`)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}
