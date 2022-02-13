import { NextApiRequest, NextApiResponse } from 'next'

import Airtable from 'airtable'
import {
  AirtableViewNameTypes,
  ChannelID,
  Channels,
} from '../../structs/channels'
import { extractVideoDataFields } from '../../structs/airtable'
import { apify } from '../../structs/api'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

const uploadBase = base('업로드 준비')

const fetchReadyViewByMember = async (member: AirtableViewNameTypes) => {
  const view = uploadBase
    .select({
      view: `${member} - 업로드 대기`,
    })
    .all()

  return view
}

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (typeof id !== 'string' || id in Channels === false) {
    throw new Error('400: member is not supplied or invalid')
  }

  const data = extractVideoDataFields(
    await fetchReadyViewByMember(Channels[id as ChannelID].airtableViewName)
  )

  return data
}

export default apify(func)
