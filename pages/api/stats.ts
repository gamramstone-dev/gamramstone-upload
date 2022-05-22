import { NextApiRequest, NextApiResponse } from 'next'

import Airtable from 'airtable'
import {
  AirtableViewNameTypes,
  ChannelID,
  Channels,
} from '../../structs/channels'
import {
  ChannelStat,
  extractVideoDataFields,
  WorkStatusNameTypes,
} from '../../structs/airtable'
import { apify } from '../../structs/api'
import { cachify } from '../../utils/server/cache'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

const uploadBase = base('업로드 준비')

/**
 * Airtable에서 멤버의 뷰를 가져옵니다.
 *
 * @param member 멤버
 * @param viewName 뷰 이름
 * @returns
 */
const fetchViewByMember = async (
  member: AirtableViewNameTypes,
  viewName: WorkStatusNameTypes
) => {
  const view = uploadBase
    .select({
      view: `${member} - ${viewName}`,
    })
    .all()

  return view
}

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (typeof id !== 'string' || id in Channels === false) {
    throw new Error('400: member is not supplied or invalid')
  }

  return cachify<ChannelStat>(`stats-${id}`, res, async () => {
    const data = extractVideoDataFields(
      await fetchViewByMember(
        Channels[id as ChannelID].airtableViewName,
        '전체'
      )
    )

    const waitingTracks = data.reduce(
      (dp, dc) =>
        dp +
        dc.captions.reduce((p, c) => p + (c.status === 'waiting' ? 1 : 0), 0),
      0
    )

    const appliedTracks = data.reduce(
      (dp, dc) =>
        dp +
        dc.captions.reduce((p, c) => p + (c.status === 'done' ? 1 : 0), 0),
      0
    )

    return {
      videos: data.length,
      waiting: waitingTracks,
      uploaded: appliedTracks,
    }
  })
}

export default apify(func)
