import { NextApiRequest, NextApiResponse } from 'next'
import { apify } from '../../../structs/api'
import {
  checkIsValidUserState,
  hasCreatorPermission,
} from '../../../structs/user'
import {
  getUser,
  getUUIDUser,
  updateUser,
} from '../../../utils/server/database'

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers

  if (authorization !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    throw new Error(
      '401: Unauthorized. Only local member could access to this endpoint.'
    )
  }

  let id = req.query.id
  const uuid = req.query.uuid
  const state = req.query.state
  const noDowngrade = req.query.noDowngrade === 'true'

  if (uuid && typeof uuid === 'string') {
    const result = await getUUIDUser(uuid)

    if (!result) {
      throw new Error('400: Bad Request. Given UUID is not defined.')
    }

    id = `${result}`
  }

  if (typeof id !== 'string' || !id) {
    throw new Error('400: Invalid ID.')
  }

  if (typeof state !== 'string' || !state || !checkIsValidUserState(state)) {
    throw new Error('400: Invalid state.')
  }

  if (req.method !== 'POST') {
    throw new Error('405: Method Not Allowed. Only POST is allowed.')
  }

  if (noDowngrade) {
    const user = await getUser(id)

    if (!user) {
      throw new Error('400: Bad Request. User not exists.')
    }

    if (user.state === state) {
      throw new Error('400: Bad Request. Same user state.')
    }

    if (hasCreatorPermission(user.state)) {
      throw new Error(
        `400: Bad Request. Cannot downgrade to ${state}. (currently ${user.state})`
      )
    }
  }

  const result = await updateUser(id, {
    state,
  })

  return result
}

export default apify(func)
