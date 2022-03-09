import { Redis } from '@upstash/redis'
import { v4 } from 'uuid'
import { DatabaseUser } from '../../structs/user'

import crypto from 'crypto'
import { setCache } from './cache'

const redis = Redis.fromEnv()

/**
 * 서버에서 주어진 UUID를 가진 유저의 ID를 가져옵니다.
 * @param uuid 유저 UUID
 * @returns
 */
export const getUUIDUser = async (uuid: string) => redis.hget<string>('usersUUID', uuid)

/**
 * 서버에서 주어진 ID를 가진 유저를 가져옵니다.
 * @param id 유저 ID
 * @returns
 */
export const getUser = async (id: string): Promise<DatabaseUser | null> =>
  redis.hgetall<DatabaseUser>(`user:${id}`)

export const listUsersUUID = async () => redis.hkeys('usersUUID')

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

  await redis.hmset(`user:${id}`, data)
  await redis.hset('usersUUID', uuid, id)

  return data
}

/**
 * 데이터베이스에 유저 UUID가 존재하는지 확인하여 반환합니다.
 * @param uuid 유저 UUID
 * @returns
 */
export const checkUUIDExists = async (uuid: string) => {
  const result = await redis.hexists('usersUUID', uuid)

  return result === 1
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

  try {
    await redis.hdel('usersUUID', user.uuid)
  } catch (e) {
    throw new Error(`failed to delete user uuid: ${(e as Error).message}`)
  }

  await redis.del(`user:${id}`)

  return true
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

  await redis.hmset(`user:${id}`, {
    ...user,
    ...data,
  })
}

/**
 * 유저의 설정을 업데이트합니다. 기존에 존재하는 설정은 모두 덮어 씌워지니 미리 값을 받아오세요.
 * @param id 유저 ID
 * @param settings 설정
 * @returns
 */
export const updateUserSettings = async (id: string, settings: string) =>
  redis.hmset(`user:${id}`, {
    settings,
  })

export const sha256 = (data: string) =>
  crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')

export const setVideosCache = async (id: string, data: string) =>
  setCache(`videos:${sha256(id)}`, data, 60 * 40)

export const getVideoCache = async (id: string) =>
  redis.get(`videos:${sha256(id)}`)
