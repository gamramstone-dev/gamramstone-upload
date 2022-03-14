import Airtable from 'airtable'
import { NextApiRequest, NextApiResponse } from 'next'
import { getFirstItem } from '../../../structs/airtable'
import { apify } from '../../../structs/api'
import { ChannelID, getChannelByID } from '../../../structs/channels'

import * as discord from '../../../utils/server/discord'
import { getYouTubeVideoSnippetDetails } from '../../../utils/server/youtube'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

const cutMessage = (str: unknown, maxLength: number): string | boolean => {
  if (typeof str !== 'string') {
    return false
  }

  return str.length - 3 > maxLength
    ? str.substring(0, maxLength - 3) + '...'
    : str
}

const ChannelMessages: Record<ChannelID, string[]> = {
  gosegu: ['$t 영상 업로드 킹아!!! ^ㅁ^', '$t 영상이 올라왔습니다!'],
  ine: ['하이네! $t 유튜브에 업로드 했습니다~', '$t 업로드라네~'],
  wakgood: ['$t 앙~ 업로드띠~ 킹아!', '$t 영상 업로드 킹아~'],
  waktaverse: ['$t 영상 업로드 완료 킹아~', '$t 영상 업로드 왕아~'],
  jururu: [
    '에엣?! 그렇게나 $t 영상이 보고싶었던 거야? 헨타이~! ',
    '$t 영상 참을 수 없어요!!!',
  ],
  lilpa: ['$t 영상 터졌다!! 업로드 완료 킹아~~', '$t 영상 업로드 킹아!!!!!!'],
  jingburger: [
    '$t 영상 왕업로드 사건...!',
    '$t 영상 업로드!! 띠용띠용김띠용사건???',
    '$t 영상 유튜브에 모시깽했습니다~~',
  ],
  viichan: [
    '$t 영상 업로드했습니다~~ 우마이~',
    '$t 영상 업로드 아자뵤~ 감사합니다!',
  ],
}

function parseDurationString (str: string) {
  var stringPattern = /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/
  var stringParts = (stringPattern.exec(str) as unknown) as number[]

  if (!stringParts) {
    return null
  }

  return (
    (((stringParts[1] === undefined ? 0 : stringParts[1] * 1) /* Days */ * 24 +
      (stringParts[2] === undefined ? 0 : stringParts[2] * 1)) /* Hours */ *
      60 +
      (stringParts[3] === undefined ? 0 : stringParts[3] * 1)) /* Minutes */ *
      60 +
    (stringParts[4] === undefined ? 0 : stringParts[4] * 1) /* Seconds */
  )
}

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers

  if (authorization !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    throw new Error(
      '401: Unauthorized. Only local API endpoint could access to this endpoint.'
    )
  }

  if (req.headers['content-type'] !== 'application/json') {
    throw new Error('400: Bad Request. Only JSON is allowed.')
  }

  if (req.method !== 'POST') {
    throw new Error('405: Method Not Allowed. Only POST is allowed.')
  }

  if (!req.body) {
    throw new Error('400: Bad Request. No body.')
  }

  const { id, channel, updated, published } = req.body

  if (!id || !channel || !updated || !published) {
    return
  }

  const channelObject = getChannelByID(channel)

  if (!channelObject) {
    throw new Error('400: Bad Request. Invalid channel.')
  }

  try {
    const [
      youtubeSnippet,
      contentDetails,
    ] = await getYouTubeVideoSnippetDetails(id, process.env.YOUTUBE_API_KEY!)

    if (!youtubeSnippet || !contentDetails) {
      throw new Error('400: No video.')
    }

    const { title, description, publishedAt } = youtubeSnippet
    const duration = parseDurationString(contentDetails.duration) || 0

    const table = base('영상 정보 (자동 업데이트)')

    console.log(`[youtube] ${title} uploading...`)

    const field = await table
      .select({
        filterByFormula: `{URL} = "https://www.youtube.com/watch?v=${id}"`,
      })
      .all()

    console.log(`[youtube] ${title} - ${field.length} records exist.`)

    /**
     * 필드가 하나 있는 부분) 제목, 설명이 다를 경우 업데이트
     */
    if (field.length === 1) {
      const recordTitle = getFirstItem(field[0].get('제목'))
      const recordDescription = getFirstItem(field[0].get('세부 정보'))

      let update = {
        title: false,
        description: false,
      }

      if (recordTitle !== title) {
        await table.update(field[0].id, {
          제목: title,
        })

        update.title = true
      }

      if (recordDescription !== description) {
        await table.update(field[0].id, {
          '세부 정보': description,
        })

        update.description = true
      }

      if (update.title || update.description) {
        await discord.sendEmbedMessage(
          process.env.DISCORD_YOUTUBE_HOOK!,
          [
            {
              color: 0x00ff00,
              title: recordTitle,
              description: `YouTube 영상 ${Object.entries(update)
                .filter(v => v[1])
                .map(v => ({ title: '제목', description: '세부 정보' }[v[0]]))
                .join(', ')} 데이터가 업데이트되어 레코드를 갱신했습니다.`,
              url: `https://www.youtube.com/watch?v=${id}`,
              fields: [
                ...(update.title
                  ? [
                      {
                        name: '변경 전 제목',
                        value: (cutMessage(recordTitle, 1020) || '-') as string,
                      },
                      {
                        name: '변경 후 제목',
                        value: (cutMessage(title, 1020) || '-') as string,
                      },
                    ]
                  : []),
                ...(update.description
                  ? [
                      {
                        name: '변경 전 세부 정보',
                        value: (cutMessage(recordDescription, 1020) ||
                          '-') as string,
                      },
                      {
                        name: '변경 후 세부 정보',
                        value: (cutMessage(description, 1020) || '-') as string,
                      },
                    ]
                  : []),
              ],
            },
          ],
          {
            username: channelObject.name,
            avatar_url: channelObject.image,
          }
        )
      }
    } else if (field.length > 1) {
      await discord.sendEmbedMessage(
        process.env.DISCORD_YOUTUBE_HOOK!,
        [
          {
            color: 0xff0000,
            title: '영상 정보 충돌',
            description: `같은 URL을 가진 영상이 여러개 있습니다. 중복 레코드를 삭제해주세요: ${field
              .map(v => v.id)
              .join(', ')}`,
            url: `https://www.youtube.com/watch?v=${id}`,
          },
        ],
        {
          username: channelObject.name,
          avatar_url: channelObject.image,
        }
      )
    } else {
      await table.create([
        {
          fields: {
            제목: title,
            채널: channelObject.name,
            '세부 정보': description,
            URL: `https://www.youtube.com/watch?v=${id}`,
            '업로드 날짜': publishedAt,
            '영상 길이': duration,
          },
        },
      ])

      await discord.sendSimpleMessage(
        process.env.DISCORD_YOUTUBE_HOOK!,
        `${ChannelMessages[channelObject.id as ChannelID][
          Math.floor(
            Math.random() *
              ChannelMessages[channelObject.id as ChannelID].length
          )
        ].replace(/\$t/g, title)} https://youtube.com/watch?v=${id}`,
        {
          username: channelObject.name,
          avatar_url: channelObject.image,
        }
      )
    }

    return
  } catch (e) {
    await discord.sendSimpleMessage(
      process.env.DISCORD_YOUTUBE_HOOK!,
      `https://youtube.com/watch?v=${id} - 영상을 가져오는 도중에 오류가 발생했어요. 수동으로 등록해주세요.`
    )

    throw e
  }
}

export default apify(func)
