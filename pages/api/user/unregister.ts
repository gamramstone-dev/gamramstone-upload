import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { apify } from '../../../structs/api'
import { deleteUser, getUser } from '../../../utils/database'

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

  try {
    const data = await fetch(
      `https://accounts.google.com/o/oauth2/revoke?token=${session.accessToken}`
    ).then(v => v.json())

    if (data.error) {
      throw new Error(
        '400: Google OAuth 오류, 로그아웃 했다가 다시 로그인하여 탈퇴를 진행해주세요.'
      )
    }
  } catch (e) {
    throw new Error(
      '400: Google OAuth 오류, 요청을 보낼 수 없어요. https://myaccount.google.com/permissions 에서 계정을 삭제해주세요.'
    )
  }

  const user = await getUser(session.id)

  if (!user) {
    throw new Error('400: 유저가 존재하지 않습니다. 당신 뭐야!!')
  }

  if (user.state === 'banned') {
    throw new Error(
      '차단된 유저는 탈퇴할 수 없습니다. 계정 연동을 취소하려면 https://myaccount.google.com/permissions에서 계정을 삭제하세요.'
    )
  }

  const result = await deleteUser(session.id)

  return result
}

export default apify(func)
