import {
  CaptionFile,
  LanguageNames,
  OnWorkingLanguageCode,
} from '../structs/airtable'

/**
 * 여러 className을 하나의 CSS className으로 묶어주는 함수.
 *
 * false나 undefined나 주어지는 경우에는 무시합니다.
 *
 * @param classNames 합쳐질 className
 * @returns 합쳐진 className
 */
export const classes = (...classNames: (string | boolean | undefined)[]) =>
  classNames.filter(v => typeof v === 'string').join(' ')

/**
 * URL에서 YouTube ID를 추출합니다.
 * @param url YouTube URL
 * @returns YouTube ID
 */
export const getYouTubeId = (url: string): string => {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi
  const match = url.match(regExp)

  if (match && match[0].length > 11) {
    const id = url.split('v=')[1]

    if (id.indexOf('&list=') > -1) {
      return id.replace(/\&list\=.+/g, '')
    }

    return id
  }

  return ''
}

export const filterCaptionFilesByLanguage = (
  language: OnWorkingLanguageCode,
  files?: CaptionFile[]
): CaptionFile | null => {
  if (!files) {
    return null
  }

  const regex = new RegExp(
    `(${language}|${LanguageNames[language]})\s?(\[.+\](\s)?)?-\s?.+\.(ytt|srt)`,
    'g'
  )

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (regex.test(file.filename)) {
      return file
    }
  }

  return null
}

const CaptionFileNameRegex = new RegExp(
  `\s?(\[.+\](\s)?)?-\s?.+\.(ytt|srt)`,
  'g'
)

export const extractCaptionTrackName = (name: string) => {
  if (!CaptionFileNameRegex.test(name)) {
    return undefined
  }

  const splitted = name.split(/\[(.*?)\]/g)

  if (splitted.length) {
    return splitted[0].replace(/(\[|\])/, '')
  }

  return undefined
}
