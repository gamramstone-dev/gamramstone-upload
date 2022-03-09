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

/**
 * 서버에서 주어진 UUID를 가진 유저의 ID를 가져옵니다.
 * @param uuid 유저 UUID
 * @returns 
 */
export const getUUIDUser = async (uuid: string) => {
  const result = await hget('usersUUID', uuid)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data
}

/**
 * 서버에서 주어진 ID를 가진 유저를 가져옵니다.
 * @param id 유저 ID
 * @returns 
 */
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

/**
 * 데이터베이스에 유저를 만듭니다.
 * @param id 유저 ID
 * @param fields 유저 필드 (생략 가능)
 * @returns 
 */
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

/**
 * 데이터베이스에 유저 UUID가 존재하는지 확인하여 반환합니다.
 * @param uuid 유저 UUID
 * @returns 
 */
export const checkUUIDExists = async (uuid: string) => {
  const result = await hexists('usersUUID', uuid)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.data === 1
}

/**
 * 데이터베이스에서 유저를 삭제합니다.
 * @param id 유저 ID
 * @returns 
 */
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

/**
 * 유저 정보 필드를 업데이트합니다. 
 * @param id 유저 ID
 * @param data 유저 필드
 * @returns 
 */
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

/**
 * 유저의 설정을 업데이트합니다. 기존에 존재하는 설정은 모두 덮어 씌워지니 미리 값을 받아오세요.
 * @param id 유저 ID
 * @param settings 설정
 * @returns 
 */
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
  const result = await setCache(`videos:${sha256(id)}`, data, 60 * 40)

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
