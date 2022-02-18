import Airtable from 'airtable'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  AirtableLanguageField,
  extractLanguageSpecificData,
  isValidLanguageName,
  LanguageNames,
} from '../../../structs/airtable'
import { apify } from '../../../structs/api'
import { sendMessage } from '../../../utils/discord'
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

  if (
    typeof lang !== 'string' ||
    !isValidLanguageName(lang) ||
    typeof LanguageNames[lang] === 'undefined'
  ) {
    throw new Error('invalid language code')
  }

  console.log(`[updateState] started for ${lang}.`)

  const uploadBase = base(`${LanguageNames[lang]} 번역`)
  const airtableVideos = await uploadBase
    .select({
      view: `자막 제작 완료`,
    })
    .all()
    .then(records => extractLanguageSpecificData(lang, records))

  const youtubeIds = airtableVideos.map(v => getYouTubeId(v.url))

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

  for (let i = 0; i < results.length; i++) {
    console.log(
      `[updateState] ${results[i].originalTitle} - ${LanguageNames[lang]} caption is being uploaded.`
    )

    if (typeof process.env[`DISCORD_${lang.toUpperCase()}_HOOK`] === 'string') {
      sendMessage(
        process.env[`DISCORD_${lang.toUpperCase()}_HOOK`]!,
        `${results[i].channel} - "${results[i].originalTitle}" 영상의 ${LanguageNames[lang]} 자막이 YouTube에 적용된 것을 확인하여 \`유튜브 적용 완료\` 상태로 변경하였습니다! 🎉`
      )
    }
    await uploadBase.update(results[i].id, {
      '진행 상황': '유튜브 적용 완료',
    })
  }

  return results
}

export default apify(func)
