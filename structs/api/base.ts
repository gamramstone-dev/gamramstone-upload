type APIResponse<T = undefined> =
  | {
      status: 'success'
      data: T
    }
  | {
      status: 'error'
      message?: string
    }

const parseAPIResponse = <T extends unknown>(res: APIResponse<T>): T => {
  if (res.status === 'error') {
    throw new Error(res.message)
  }

  return res.data
}

export const APIFetcher = <T extends unknown>(
  path: string,
  data?: Parameters<typeof fetch>[1]
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${path}`, data)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }

      return res.json()
    })
    .then(res => parseAPIResponse<T>(res))
}
