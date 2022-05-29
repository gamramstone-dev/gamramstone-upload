import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { isValidLanguageName, LanguageNames } from '../../../structs/common'
import { apify } from '../../../structs/api'
import { hasCreatorPermission } from '../../../structs/user'
import { chunks } from '../../../utils/items'
import discord, { DiscordEmbed } from '../../../utils/server/discord'
import { getYouTubeId } from '../../../utils/string'

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

  const youtubeIds = videos.split(',')

  /**
   * Discord 채널에 업로드 알림을 보내는 부분입니다.
   */
  const discordMessages: DiscordEmbed[] = youtubeIds.map(id => ({
    title: id,
    color: 0x118bf5,
    description: `${
      LanguageNames[lang]
    } 자막이 크리에이터에 의해 적용됐습니다! 업데이트 전까지 수동 상태 변경이 필요합니다. 🎉 ${
      isTest ? ' (테스트 메세지입니다. 실제 적용은 아닙니다.)' : ''
    }`,
    thumbnail: {
      url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    },
  }))

  if (!isTest) {
    const chunked = chunks(discordMessages, 10)

    await Promise.all(
      chunked.map((chunk: DiscordEmbed[]) =>
        discord.sendFancy(process.env[`DISCORD_EN_HOOK`]!, chunk)
      )
    )
  }

  return true
}

export default apify(func)
