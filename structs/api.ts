import { NextApiRequest, NextApiResponse } from 'next'

export type APIResponse<T> = APIResponseError | APIResponseSuccess<T>

export interface APIResponseSuccess<T> {
  status: 'success'
  data?: T
}

export interface APIResponseError {
  status: 'error'
  message?: string
}

const parseError = (error: unknown): [number, string] => {
  console.error(error)

  if (!(error instanceof Error)) {
    if (error !== null && typeof error === 'object' && 'message' in error) {
      return [500, (error as { message: string }).message]
    }

    return [500, 'unknown error happened']
  }

  if (error.message[3] === ':' && error.message[4] === ' ') {
    const code = error.message.substring(0, 3)
    const message = error.message.substring(5)

    return [Number(code), message]
  }

  return [500, error.message]
}

export const apify = (
  callback: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const result = await callback(req, res)
      res.status(200).json({
        status: 'success',
        data: result,
      } as APIResponseSuccess<unknown>)
    } catch (error) {
      const [status, message] = parseError(error)

      res.status(status).json({
        status: 'error',
        message: message,
      })
    }
  }
}
