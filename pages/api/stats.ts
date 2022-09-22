import { NextApiRequest, NextApiResponse } from 'next'

import { ChannelID, Channels } from '../../structs/channels'
import { apify, APIResponse } from '../../structs/api'
import { ChannelStat, VideoWithCaption } from '../../structs/common'
import { cachify } from '../../utils/server/cache'

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (typeof id !== 'string' || id in Channels === false) {
    throw new Error('400: member is not supplied or invalid')
  }

  return cachify<ChannelStat>(`stats-${id}`, res, async () => {
    const channel = Channels[id as ChannelID]

    const result = (await (
      await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v0/videos?channel=${channel.channelId}`
      )
    ).json()) as APIResponse<VideoWithCaption[]>

    if (result.status === 'error') {
      throw new Error(result.message)
    }

    if (!result.data) {
      return {
        videos: 0,
        waiting: 0,
        uploaded: 0,
      }
    }

    const waitingTracks = result.data.reduce(
      (dp, dc) =>
        dp +
        dc.captions.reduce(
          (p, c) =>
            p + (c.status === 'waiting' || c.status === 'reupload' ? 1 : 0),
          0
        ),
      0
    )

    const appliedTracks = result.data.reduce(
      (dp, dc) =>
        dp + dc.captions.reduce((p, c) => p + (c.status === 'done' ? 1 : 0), 0),
      0
    )

    return {
      videos: result.data.length,
      waiting: waitingTracks,
      uploaded: appliedTracks,
    }
  })
}

export default apify(func)
