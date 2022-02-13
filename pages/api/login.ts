import { NextApiRequest, NextApiResponse } from 'next'

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    message: 'Login feature is not implemented yet.',
  })
}

export default func
