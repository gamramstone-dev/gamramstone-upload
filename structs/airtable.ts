import {
  Attachment,
  FieldSet,
  Record as AirtableRecord,
  Records,
} from 'airtable'

export interface CaptionFile {
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

export interface AirtableLanguageField {
  id: string
  url: string
  noCC?: boolean
  channel: string
  originalTitle: string
  title: string
  description: string
  uploadDate: string
  files: CaptionFile[]
}

export const extractStatus = (fields: FieldSet, name: string): WorkStatus => {
  const syncName = `${name} 진행 상황`
  if (
    typeof fields[syncName] !== 'undefined' &&
    (fields[syncName] as string[])[0] === '자막 제작 완료'
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
      (fields[syncName] as string[])[0] === '받아쓰기' ||
      (fields[syncName] as string[])[0] === '자막 싱크' ||
      (fields[syncName] as string[])[0] === '검수' ||
      (fields[syncName] as string[])[0] === '최종 확인 대기')
  ) {
    return 'wip'
  }

  return 'none'
}

export const filterCaptionFiles = (
  response: (Attachment | CaptionFile)[]
): CaptionFile[] => {
  const files = response.map(v => ({
    filename: v.filename,
    size: v.size,
    url: v.url,
    type: v.type,
  }))

  let yttFiles = files.filter(file => file.filename.endsWith('.ytt'))
  let srtFiles = files.filter(file => file.filename.endsWith('.srt'))

  if (yttFiles.length) {
    return yttFiles
  }

  if (srtFiles.length) {
    return srtFiles
  }

  return []
}

export const extractNationalValue = (
  data: AirtableRecord<FieldSet>
): TranslatedVideoMetadata[] => {
  const captions: TranslatedVideoMetadata[] = []

  const fetchLanguages = (lang: OnWorkingLanguageCode) => {
    if (
      `${LanguageNames[lang]} 제목` in data.fields &&
      `${LanguageNames[lang]} 세부 정보` in data.fields
    ) {
      const title = (data.fields[`${LanguageNames[lang]} 제목`] as string[])[0]
      const description = (data.fields[
        `${LanguageNames[lang]} 세부 정보`
      ] as string[])[0]
      const status = extractStatus(data.fields, LanguageNames[lang])

      let files: CaptionFile[] = []

      if (`${LanguageNames[lang]} 자막 파일` in data.fields) {
        files = filterCaptionFiles(
          data.fields[`${LanguageNames[lang]} 자막 파일`] as Attachment[]
        )
      }

      const caption: TranslatedVideoMetadata = {
        language: lang,
        title,
        description,
        status,
        captions: files,
      }

      captions.push(caption)
    }
  }

  const langs = Object.keys(LanguageNames)
  for (let i = 0; i < langs.length; i++) {
    fetchLanguages(langs[i] as OnWorkingLanguageCode)
  }

  return captions
}

export const extractVideoDataFields = (
  data: Records<FieldSet>
): VideoWithCaption[] => {
  return data.map(v => ({
    id: v.id,
    url: (v.fields['URL'] as string[])[0],
    title: (v.fields['제목'] as string[])[0],
    description: (v.fields['세부 정보'] as string[])[0],
    uploadDate: (v.fields['업로드 날짜'] as string[])[0],
    editDate: (v.fields['최근 수정'] as string[])[0],
    captions: extractNationalValue(v),
  }))
}

export const extractLanguageSpecificData = (
  language: OnWorkingLanguageCode,
  data: Records<FieldSet>
): AirtableLanguageField[] => {
  return data.map(v => ({
    id: v.id,
    url: (v.fields['URL'] as string[])[0],
    channel: v.fields['채널'] as string,
    noCC:
      (v.fields[
        (checkIsIndividualLanguage(language)
          ? ''
          : `${LanguageNames[language]} `) + '진행 상황'
      ] as string[])[0] === '해당 없음 (자막 필요 없는 영상)',
    originalTitle: v.fields['제목'] as string,
    title: v.fields[`${LanguageNames[language]} 제목`] as string,
    description: v.fields[`${LanguageNames[language]} 세부 정보`] as string,
    uploadDate: (v.fields['업로드 날짜'] as string[])[0],
    editDate: v.fields['Last Modified'] as string,
    files:
      typeof v.fields[`${LanguageNames[language]} 자막 파일`] === 'undefined'
        ? []
        : filterCaptionFiles(
            v.fields[`${LanguageNames[language]} 자막 파일`] as Attachment[]
          ),
  }))
}

export const ISO639 = [
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
  ('en' | 'ko' | 'zh' | 'fr' | 'es' | 'ar' | 'ja' | 'vi')

export const IndividualLanguages = ['en', 'ja', 'zh'] as const
export type IndividualTableLanguageCode = typeof IndividualLanguages[number]

export const checkIsIndividualLanguage = (
  str: string
): str is IndividualTableLanguageCode => {
  return (Object.values(IndividualLanguages) as string[]).includes(str)
}

export const LanguageNames: Record<OnWorkingLanguageCode, string> = {
  en: '영어',
  ko: '한국어',
  zh: '중국어',
  vi: '베트남어',
  fr: '프랑스어',
  es: '스페인어',
  ar: '아랍어',
  ja: '일본어',
}

export const isValidLanguageName = (
  name: string
): name is OnWorkingLanguageCode => {
  return Object.keys(LanguageNames).includes(name)
}

export type WorkStatusNameTypes =
  | '업로드 완료'
  | '자막 작업 안함'
  | '업로드 대기'
  | '번역 진행 중'
export type WorkStatus = 'none' | 'wip' | 'waiting' | 'done'

export const WorkStatusNames: Record<WorkStatus, WorkStatusNameTypes> = {
  done: '업로드 완료',
  none: '자막 작업 안함',
  waiting: '업로드 대기',
  wip: '번역 진행 중',
}
