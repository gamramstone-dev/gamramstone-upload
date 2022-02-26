import Airtable from 'airtable'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  AirtableLanguageField,
  extractLanguageSpecificData,
  IndividualLanguages,
  isValidLanguageName,
  LanguageNames,
  OnWorkingLanguageCode,
} from '../../../structs/airtable'
import { apify } from '../../../structs/api'
import { Channels, getChannelIDByName } from '../../../structs/channels'
import { chunks } from '../../../utils/items'
import discord, { DiscordEmbed } from '../../../utils/server/discord'
import { getYouTubeId } from '../../../utils/string'
import {
  getYouTubeLocalizedVideos,
  getYouTubeSubtitleList,
} from '../../../utils/youtube'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

const func = async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers

  if (authorization !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    throw new Error(
      '401: Unauthorized. Only local member could access to this endpoint.'
    )
  }

  const lang = req.query.lang
  const video = req.query.video

  if (
    typeof lang !== 'string' ||
    !isValidLanguageName(lang) ||
    typeof LanguageNames[lang] === 'undefined'
  ) {
    throw new Error('invalid language code')
  }

  if (typeof video === 'object') {
    throw new Error('invalid video')
  }

  console.log(`[updateState] started for ${lang}.`)

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

  const youtubeIds = video
    ? video.split(',')
    : airtableVideos.map(v => getYouTubeId(v.url))

  const videos = await getYouTubeLocalizedVideos(
    youtubeIds,
    process.env.YOUTUBE_API_KEY!
  )

  const localizedVideos = videos.filter(
    v =>
      typeof v.metadatas !== 'undefined' &&
      typeof v.metadatas[lang] !== 'undefined'
  )

  const indexes = videos
    .map(
      (v, i) =>
        typeof v.metadatas !== 'undefined' &&
        typeof v.metadatas[lang] !== 'undefined' &&
        i
    )
    .filter(v => typeof v === 'number') as number[]

  let results: AirtableLanguageField[] = []

  for (let i = 0; i < localizedVideos.length; i++) {
    const video = localizedVideos[i]

    // 검증 과정은 내용이 적용한 내용이 업로더에 의해 바뀔 수 있기 때문에 보류합니다.
    // if (
    //   video.metadatas[lang].title !== airtableVideos[indexes[i]].title ||
    //   video.metadatas[lang].description !==
    //     airtableVideos[indexes[i]].description
    // ) {
    //   continue
    // }

    if (airtableVideos[indexes[i]].noCC) {
      results.push(airtableVideos[indexes[i]])

      continue
    }

    /**
     * 영상에 등록된 자동 생성된 자막 및 다른 언어 자막을 제외한 자막 트랙을 가져옵니다.
     */
    const caption = (
      await getYouTubeSubtitleList(video.id, process.env.YOUTUBE_API_KEY!)
    ).filter(v => v.trackKind !== 'asr' && v.language === lang)

    // CC를 작업하지 않도록 마킹이 되어 있는 경우 -> 업로드
    // Airtable에 업로드된 자막 파일이 있고, YouTube에 자막이 있는 경우 -> 업로드
    if (
      caption.length &&
      airtableVideos[indexes[i]].files.map(
        v => v.filename.endsWith('.ytt') || v.filename.endsWith('.srt')
      ).length > 0
    ) {
      results.push(airtableVideos[indexes[i]])
    }
  }

  if (!results.length) {
    console.log(`[updateState] nothing to update.`)
  }

  const discordMessages: DiscordEmbed[] = []

  for (let i = 0; i < results.length; i++) {
    console.log(
      `[updateState] ${results[i].originalTitle} - ${LanguageNames[lang]} caption is being uploaded.`
    )

    const channelId = getChannelIDByName(results[i].channel)

    discordMessages.push({
      title: results[i].originalTitle,
      color: channelId
        ? parseInt(Channels[channelId].color.replace(/#/g, ''), 16)
        : 0x118bf5,
      description: `${LanguageNames[lang]} 자막이 적용됐습니다! 🎉`,
      url: results[i].url,
      thumbnail: {
        url: `https://i.ytimg.com/vi/${getYouTubeId(
          results[i].url
        )}/hqdefault.jpg`,
      },
      footer: channelId
        ? {
            text: Channels[channelId].name,
            icon_url: Channels[channelId].image,
          }
        : undefined,
    })

    await uploadBase.update(results[i].id, {
      [(isMajorLanguage ? '' : `${LanguageNames[lang]} `) +
      '진행 상황']: '유튜브 적용 완료',
    })
  }

  const chunked = chunks(discordMessages, 10)

  for (let i = 0; i < chunked.length; i++) {
    const item = chunked[i]

    if (!item) {
      continue
    }

    const env = process.env[
      `DISCORD_${isMajorLanguage ? item[i].toUpperCase() : 'EN'}_HOOK`
    ]!

    if (env) {
      await discord.sendFancy(env, item)
    }
  }

  return results
}

export default apify(func)
