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
import { cachify } from '../../utils/cache'

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

  return cachify(`${id}-${tabs}`, res, async () =>
    extractVideoDataFields(
      await fetchViewByMember(
        Channels[id as ChannelID].airtableViewName,
        WorkStatusNames[tabs as WorkStatus]
      )
    )
  )
}

export default apify(func, 120)
