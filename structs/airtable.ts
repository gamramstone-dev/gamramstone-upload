import {
  Attachment,
  FieldSet,
  Record as AirtableRecord,
  Records,
} from 'airtable'

interface CaptionFile {
  filename: string
  size: number
  url: string
  type: string
}

export interface TranslatedVideoMetadata {
  language: OnWorkingLanguageCode
  status: WorkStatus
  title: string
  description: string
  captions: CaptionFile[]
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
  data: AirtableRecord<FieldSet>
): TranslatedVideoMetadata[] => {
  const captions: TranslatedVideoMetadata[] = []

  if ('제목 (영어)' in data.fields && '세부 정보 (영어)' in data.fields) {
    const title = (data.fields['제목 (영어)'] as string[])[0]
    const description = (data.fields['세부 정보 (영어)'] as string[])[0]
    const status = extractStatus(data.fields, '영어')

    let files: CaptionFile[] = []

    if (
      '영어 자막 파일 (from 영어 번역) 2 (from 받아쓰기 + 자막 싱크)' in
      data.fields
    ) {
      files = (data.fields[
        '영어 자막 파일 (from 영어 번역) 2 (from 받아쓰기 + 자막 싱크)'
      ] as Attachment[]).map(v => ({
        filename: v.filename,
        size: v.size,
        url: v.url,
        type: v.type,
      }))
    }

    const caption: TranslatedVideoMetadata = {
      language: 'en',
      title,
      description,
      status,
      captions: files,
    }

    captions.push(caption)
  }

  if ('제목 (일본어)' in data.fields && '세부 정보 (일본어)' in data.fields) {
    const title = (data.fields['제목 (일본어)'] as string[])[0]
    const description = (data.fields['세부 정보 (일본어)'] as string[])[0]
    const status = extractStatus(data.fields, '일본어')

    let files: CaptionFile[] = []

    if (
      '일본어 자막 파일 (from 일본어 번역) 2 (from 받아쓰기 + 자막 싱크)' in
      data.fields
    ) {
      files = (data.fields[
        '일본어 자막 파일 (from 일본어 번역) 2 (from 받아쓰기 + 자막 싱크)'
      ] as Attachment[]).map(v => ({
        filename: v.filename,
        size: v.size,
        url: v.url,
        type: v.type,
      }))
    }

    const caption: TranslatedVideoMetadata = {
      language: 'ja',
      title,
      description,
      status,
      captions: files,
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

export const LanguageNames: Record<OnWorkingLanguageCode, string> = {
  en: '영어',
  ko: '한국어',
  zh: '중국어',
  fr: '프랑스어',
  es: '스페인어',
  ar: '아랍어',
  ja: '일본어',
}

export type WorkStatusNameTypes = '업로드 완료' | '자막 작업 안함' | '업로드 대기' | '자막 작업 중'
export type WorkStatus = 'none' | 'wip' | 'waiting' | 'done'

export const WorkStatusNames: Record<WorkStatus, WorkStatusNameTypes> = {
  done: '업로드 완료',
  none: '자막 작업 안함',
  waiting: '업로드 대기',
  wip: '자막 작업 중',
}
