import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { apify } from '../../structs/api'
import { validateSettings } from '../../structs/setting'
import { getUser, updateUserSettings } from '../../utils/server/database'

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (!session) {
    throw new Error(
      '401: Unauthorized. Only member could access to this endpoint.'
    )
  }

  if (!session.id || typeof session.id !== 'string') {
    throw new Error('400: Bad Request. Invalid ID.')
  }

  if (req.method === 'GET') {
    const data = await getUser(session.id)

    if (!data) {
      throw new Error('401: ??? why no data do you want to get moshiggyengi?')
    }

    return data.settings
  }

  if (req.headers['content-type'] !== 'application/json') {
    throw new Error('400: Bad Request. Content-Type must be application/json.')
  }

  if (!validateSettings(req.body)) {
    throw new Error('400: Bad Request. Invalid settings.')
  }

  const result = await updateUserSettings(session.id, JSON.stringify(req.body))

  return result
}

export default apify(func)
