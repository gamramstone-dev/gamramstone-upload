import Airtable from 'airtable'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import {
  AirtableLanguageField,
  extractLanguageSpecificData,
  getFirstItem,
  IndividualLanguages,
  isValidLanguageName,
  LanguageNames,
} from '../../../structs/airtable'
import { apify } from '../../../structs/api'
import { Channels, getChannelIDByName } from '../../../structs/channels'
import { hasCreatorPermission } from '../../../structs/user'
import { chunks } from '../../../utils/items'
import { markAsDoneVideos } from '../../../utils/server/cache'
import discord, { DiscordEmbed } from '../../../utils/server/discord'
import { getYouTubeId } from '../../../utils/string'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const token = await getToken({ req })

  if (!session || !token) {
    throw new Error(
      '401: Unauthorized. Only member could access to this endpoint.'
    )
  }

  if (!token.id || typeof token.id !== 'string') {
    throw new Error('400: Bad Request. Invalid ID.')
  }

  if (req.method !== 'PATCH') {
    throw new Error('405: Method Not Allowed. Only PATCH is allowed.')
  }

  if (
    typeof token.userState !== 'string' ||
    !hasCreatorPermission(token.userState)
  ) {
    console.log(
      `${token.id} tried to access to endpoint without admin/creator permission.`
    )

    throw new Error(
      '401: Unauthorized. Only admin could access to this endpoint.'
    )
  }

  const lang = req.query.lang
  const videos = req.query.videos
  const isTest = req.query.isTest === 'true'

  if (
    typeof lang !== 'string' ||
    !isValidLanguageName(lang) ||
    typeof LanguageNames[lang] === 'undefined'
  ) {
    throw new Error('400: invalid language code')
  }

  if (typeof videos === 'object') {
    throw new Error('400: invalid videos')
  }

  console.log(`[updateState] started invidiual request for ${lang}.`)

  const isMajorLanguage = (Object.values(
    IndividualLanguages
  ) as string[]).includes(lang)

  const uploadBase = base(
    `${isMajorLanguage ? LanguageNames[lang] : '기타 언어'} 번역`
  )
  const airtableVideos = await uploadBase
    .select({
      view: `${isMajorLanguage ? '' : LanguageNames[lang] + ' '}자막 제작 완료`,
    })
    .all()
    .then(records => extractLanguageSpecificData(lang, records))

  const youtubeIds = videos.split(',')

  let results: AirtableLanguageField[] = []

  for (let i = 0; i < youtubeIds.length; i++) {
    const video = youtubeIds[i]
    const record = airtableVideos.find(v => getYouTubeId(v.url) === video)

    if (!record) {
      continue
    }

    console.log(
      `[updateVideo] started for ${lang} - ${video}, isNoCC: ${record.noCC}`
    )

    results.push(record)
  }

  if (!results.length) {
    console.log(`[updateVideo] nothing to update.`)
    return []
  }

  await markAsDoneVideos(
    `${getChannelIDByName(results[0].channel)}-waiting`,
    lang,
    results.map(v => v.url)
  )

  /**
   * Discord 채널에 업로드 알림을 보내는 부분입니다.
   */
  const discordMessages: DiscordEmbed[] = results.map(result => {
    console.log(
      `[updateVideo] ${result.originalTitle} - ${LanguageNames[lang]} caption is being uploaded.`
    )

    const channelId = getChannelIDByName(result.channel)

    return {
      title: getFirstItem(result.originalTitle),
      color: channelId
        ? parseInt(Channels[channelId].color.replace(/#/g, ''), 16)
        : 0x118bf5,
      description: `${
        LanguageNames[lang]
      } 자막이 크리에이터에 의해 적용됐습니다! 🎉 ${
        isTest ? ' (테스트 메세지입니다. 실제 적용은 아닙니다.)' : ''
      }`,
      url: result.url,
      thumbnail: {
        url: `https://i.ytimg.com/vi/${getYouTubeId(result.url)}/hqdefault.jpg`,
      },
      footer: channelId
        ? {
            text: Channels[channelId].name,
            icon_url: Channels[channelId].image,
          }
        : undefined,
    }
  })

  if (!isTest) {
    await Promise.all(
      results.map(result => {
        console.log(
          `[updateVideo] ${result.originalTitle} - ${LanguageNames[lang]} is now marked as done (${result.id})`
        )

        return uploadBase.update(result.id, {
          [(isMajorLanguage ? '' : `${LanguageNames[lang]} `) +
          '진행 상황']: '유튜브 적용 완료',
        })
      })
    )

    const chunked = chunks(discordMessages, 10)

    await Promise.all(
      chunked.map((chunk: DiscordEmbed[]) =>
        discord.sendFancy(
          process.env[
            `DISCORD_${isMajorLanguage ? lang.toUpperCase() : 'EN'}_HOOK`
          ]!,
          chunk
        )
      )
    )
  }

  return results
}

export default apify(func)
