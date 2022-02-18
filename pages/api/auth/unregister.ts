import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { apify } from '../../../structs/api'
import { deleteUser } from '../../../utils/database'

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

  if (req.method !== 'POST') {
    throw new Error('405: Method Not Allowed. Only POST is allowed.')
  }

  const result = await deleteUser(session.id)

  return result
}

export default apify(func)
