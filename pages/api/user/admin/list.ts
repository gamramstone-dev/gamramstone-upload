import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { apify } from '../../../../structs/api'
import { getUser, listUsersUUID } from '../../../../utils/server/database'

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

  if (req.method !== 'GET') {
    throw new Error('405: Method Not Allowed. Only GET is allowed.')
  }

  const user = await getUser(session.id)

  if (!user) {
    throw new Error('400: Invalid user.')
  }

  if (!user.state || user.state !== 'admin') {
    console.log(
      `${session.id} tried to access to admin endpoint without admin permission.`
    )

    throw new Error(
      '401: Unauthorized. Only admin could access to this endpoint.'
    )
  }

  const users = await listUsersUUID()

  return users
}

export default apify(func)
