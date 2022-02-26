import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { apify } from '../../../../structs/api'
import { checkIsValidUserState } from '../../../../structs/user'
import { getUser, getUUIDUser, updateUser } from '../../../../utils/server/database'

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
    console.log(`${session.id} tried to access to admin endpoint without admin permission.`)

    throw new Error(
      '401: Unauthorized. Only admin could access to this endpoint.'
    )
  }

  const { uuid, permission } = req.query

  if (!uuid || typeof uuid !== 'string') {
    throw new Error('400: Invalid UUID.')
  }

  if (
    !permission ||
    typeof permission !== 'string' ||
    !checkIsValidUserState(permission)
  ) {
    throw new Error('400: Invalid permission.')
  }

  const id = await getUUIDUser(uuid)

  if (!id) {
    throw new Error('400: UUID user not found.')
  }

  if (id === session.id) {
    throw new Error('400: You cannot change your own permission.')
  }

  const result = await updateUser(uuid, {
    state: permission,
  })

  return result
}

export default apify(func)
