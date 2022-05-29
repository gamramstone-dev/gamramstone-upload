import { NextApiRequest, NextApiResponse } from 'next'

import { ChannelID, Channels } from '../../structs/channels'
import {
  filterCaptionFiles,
  VideoWithCaption,
  WorkStatusNames,
} from '../../structs/common'
import { apify, APIResponse } from '../../structs/api'
import { cachify } from '../../utils/server/cache'

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, tabs } = req.query

  if (typeof id !== 'string' || id in Channels === false) {
    throw new Error('400: member is not supplied or invalid')
  }

  if (typeof tabs !== 'string' || tabs in WorkStatusNames === false) {
    throw new Error('400: tabs is not supplied or invalid')
  }

  return cachify<VideoWithCaption[]>(`${id}-${tabs}`, res, async () => {
    const channel = Channels[id as ChannelID]

    const result = (await (
      await fetch(
        `${process.env.API_ENDPOINT}/v0/videos?channel=${channel.channelId}&tabs=${tabs}`
      )
    ).json()) as APIResponse<VideoWithCaption[]>

    if (result.status === 'error') {
      throw new Error(result.message)
    }

    if (!result.data) {
      return []
    }

    return result.data.map(v => ({
      ...v,
      captions: v.captions.map(a => ({
        ...a,
        captions: filterCaptionFiles(a.captions),
      })),
    }))
  })
}

export default apify(func)
