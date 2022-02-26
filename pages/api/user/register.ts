import { NextApiRequest, NextApiResponse } from 'next'
import { apify } from '../../../structs/api'
import { checkIsValidUserState } from '../../../structs/user'
import { createUser } from '../../../utils/server/database'

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers

  if (authorization !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    throw new Error(
      '401: Unauthorized. Only local member could access to this endpoint.'
    )
  }

  const id = req.query.id
  const state = req.query.state

  if (typeof id !== 'string' || !id) {
    throw new Error('400: Invalid ID.')
  }

  if (typeof state !== 'string' || !state || !checkIsValidUserState(state)) {
    throw new Error('400: Invalid state.')
  }

  if (req.method !== 'POST') {
    throw new Error('405: Method Not Allowed. Only POST is allowed.')
  }

  const result = await createUser(id, {
    state,
  })

  return result
}

export default apify(func)
