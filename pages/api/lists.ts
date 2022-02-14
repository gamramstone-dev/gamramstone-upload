import { NextApiRequest, NextApiResponse } from 'next'

import Airtable from 'airtable'
import {
  AirtableViewNameTypes,
  ChannelID,
  Channels,
} from '../../structs/channels'
import {
  extractVideoDataFields,
  WorkStatus,
  WorkStatusNames,
  WorkStatusNameTypes,
} from '../../structs/airtable'
import { apify } from '../../structs/api'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

const uploadBase = base('업로드 준비')

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
  const { id, tabs } = req.query

  if (typeof id !== 'string' || id in Channels === false) {
    throw new Error('400: member is not supplied or invalid')
  }

  if (typeof tabs !== 'string' || tabs in WorkStatusNames === false) {
    throw new Error('400: tabs is not supplied or invalid')
  }

  const data = extractVideoDataFields(
    await fetchViewByMember(
      Channels[id as ChannelID].airtableViewName,
      WorkStatusNames[tabs as WorkStatus]
    )
  )

  return data
}

export default apify(func)
