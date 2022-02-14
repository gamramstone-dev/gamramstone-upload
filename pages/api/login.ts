import { NextApiRequest, NextApiResponse } from 'next'
import { apify } from '../../structs/api'

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  throw new Error('500: 로그인 기능은 아직 구현되지 않았습니다.')
}

export default apify(func)
