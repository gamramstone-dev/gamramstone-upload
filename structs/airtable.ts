import { Attachment, FieldSet, Record, Records } from 'airtable'

interface TranslatedVideoMetadata {
  language: OnWorkingLanguageCode
  status: WorkStatus
  title: string
  description: string
  caption?: {
    filename: string
    size: number
    url: string
    type: string
  }
}

export interface VideoWithCaption {
  id: string
  url: string
  title: string
  description: string
  uploadDate: string
  captions: TranslatedVideoMetadata[]
}

export const extractStatus = (fields: FieldSet, name: string): WorkStatus => {
  const syncName = `진행 상황 확인용 - ${name} 카피 (from 받아쓰기 + 자막 싱크)`
  if (
    typeof fields[syncName] !== 'undefined' &&
    (fields[syncName] as string[])[0] === '자막 제작 완료'
  ) {
    return 'waiting'
  } else if (
    typeof fields[syncName] !== 'undefined' &&
    (fields[syncName] as string[])[0] === '최종 확인 대기'
  ) {
    return 'waiting'
  }

  if (
    typeof fields[syncName] !== 'undefined' &&
    (fields[syncName] as string[])[0] === '유튜브 적용 완료'
  ) {
    return 'done'
  }

  if (
    typeof fields[syncName] !== 'undefined' &&
    ((fields[syncName] as string[])[0] === '번역' ||
      (fields[syncName] as string[])[0] === '검수')
  ) {
    return 'wip'
  }

  return 'none'
}

export const extractNationalValue = (
  data: Record<FieldSet>
): TranslatedVideoMetadata[] => {
  const captions: TranslatedVideoMetadata[] = []

  if ('제목 (영어)' in data.fields && '세부 정보 (영어)' in data.fields) {
    const title = (data.fields['제목 (영어)'] as string[])[0]
    const description = (data.fields['세부 정보 (영어)'] as string[])[0]
    const status = extractStatus(data.fields, '영어')

    let file = undefined

    if (
      '영어 자막 파일 (from 영어 번역) 2 (from 받아쓰기 + 자막 싱크)' in
      data.fields
    ) {
      file = {
        filename: (data.fields[
          '영어 자막 파일 (from 영어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].filename,
        size: (data.fields[
          '영어 자막 파일 (from 영어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].size,
        url: (data.fields[
          '영어 자막 파일 (from 영어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].url,
        type: (data.fields[
          '영어 자막 파일 (from 영어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].type,
      }
    }

    const caption: TranslatedVideoMetadata = {
      language: 'en',
      title,
      description,
      status,
      caption: file,
    }

    captions.push(caption)
  }

  if ('제목 (일본어)' in data.fields && '세부 정보 (일본어)' in data.fields) {
    const title = (data.fields['제목 (일본어)'] as string[])[0]
    const description = (data.fields['세부 정보 (일본어)'] as string[])[0]
    const status = extractStatus(data.fields, '일본어')

    let file = undefined

    if (
      '일본어 자막 파일 (from 일본어 번역) 2 (from 받아쓰기 + 자막 싱크)' in
      data.fields
    ) {
      file = {
        filename: (data.fields[
          '일본어 자막 파일 (from 일본어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].filename,
        size: (data.fields[
          '일본어 자막 파일 (from 일본어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].size,
        url: (data.fields[
          '일본어 자막 파일 (from 일본어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].url,
        type: (data.fields[
          '일본어 자막 파일 (from 일본어 번역) 2 (from 받아쓰기 + 자막 싱크)'
        ] as Attachment[])[0].type,
      }
    }

    const caption: TranslatedVideoMetadata = {
      language: 'ja',
      title,
      description,
      status,
      caption: file,
    }

    captions.push(caption)
  }

  return captions
}

export const extractVideoDataFields = (
  data: Records<FieldSet>
): VideoWithCaption[] => {
  return data.map(v => ({
    id: v.id,
    url: (v.fields['URL (from 받아쓰기 + 자막 싱크)'] as string[])[0],
    title: (v.fields['제목'] as string[])[0],
    description: (v.fields['세부 정보'] as string[])[0],
    uploadDate: (v.fields[
      '업로드 날짜 (from 받아쓰기 + 자막 싱크)'
    ] as string[])[0],
    editDate: (v.fields['최근 수정'] as string[])[0],
    captions: extractNationalValue(v),
  }))
}

const ISO639 = [
  'aa',
  'ab',
  'ae',
  'af',
  'ak',
  'am',
  'an',
  'ar',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cu',
  'cv',
  'cy',
  'da',
  'de',
  'dv',
  'dz',
  'ee',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fj',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gn',
  'gu',
  'gv',
  'ha',
  'he',
  'hi',
  'ho',
  'hr',
  'ht',
  'hu',
  'hy',
  'hz',
  'ia',
  'id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'it',
  'iu',
  'ja',
  'jv',
  'ka',
  'kg',
  'ki',
  'kj',
  'kk',
  'kl',
  'km',
  'kn',
  'ko',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lu',
  'lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'na',
  'nb',
  'nd',
  'ne',
  'ng',
  'nl',
  'nn',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pi',
  'pl',
  'ps',
  'pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ru',
  'rw',
  'sa',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'ts',
  'tt',
  'tw',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zu',
] as const

export type LanguageCode = typeof ISO639[number]
export type OnWorkingLanguageCode = LanguageCode &
  ('en' | 'ko' | 'zh' | 'fr' | 'es' | 'ar' | 'ja')

export type WorkStatus = 'none' | 'wip' | 'waiting' | 'done'
