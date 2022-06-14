// import {
//   Attachment,
//   FieldSet,
//   Record as AirtableRecord,
//   Records,
// } from 'airtable'

import { groupBy } from '../utils/commmon'

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

export interface ChannelStat {
  videos: number
  waiting: number
  uploaded: number
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

export interface VideoWorks {
  id: string
  dataIndex: number
  originTitle: string
  originDescription: string
  lang: OnWorkingLanguageCode
  title: string
  description: string
  captions: CaptionFile[]
}

export const getFirstItem = (items: unknown) => {
  if (Array.isArray(items)) {
    return items[0]
  }

  return items
}

// export const extractStatus = (fields: FieldSet, name: string): WorkStatus => {
//   const syncName = `${name} 진행 상황`
//   if (
//     typeof fields[syncName] !== 'undefined' &&
//     (fields[syncName] as string[])[0] === '자막 제작 완료'
//   ) {
//     return 'waiting'
//   }

//   if (
//     typeof fields[syncName] !== 'undefined' &&
//     (fields[syncName] as string[])[0] === '유튜브 적용 완료'
//   ) {
//     return 'done'
//   }

//   if (
//     typeof fields[syncName] !== 'undefined' &&
//     ((fields[syncName] as string[])[0] === '번역' ||
//       (fields[syncName] as string[])[0] === '받아쓰기' ||
//       (fields[syncName] as string[])[0] === '자막 싱크' ||
//       (fields[syncName] as string[])[0] === '검수' ||
//       (fields[syncName] as string[])[0] === '최종 확인 대기')
//   ) {
//     return 'wip'
//   }

//   return 'none'
// }

export const filterCaptionFiles = (response: CaptionFile[]): CaptionFile[] => {
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

// export const extractNationalValue = (
//   data: AirtableRecord<FieldSet>
// ): TranslatedVideoMetadata[] => {
//   const captions: TranslatedVideoMetadata[] = []

//   const fetchLanguages = (lang: OnWorkingLanguageCode) => {
//     if (
//       `${LanguageNames[lang]} 제목` in data.fields &&
//       `${LanguageNames[lang]} 세부 정보` in data.fields
//     ) {
//       const title = (data.fields[`${LanguageNames[lang]} 제목`] as string[])[0]
//       const description = (data.fields[
//         `${LanguageNames[lang]} 세부 정보`
//       ] as string[])[0]
//       const status = extractStatus(data.fields, LanguageNames[lang])

//       let files: CaptionFile[] = []

//       if (`${LanguageNames[lang]} 자막 파일` in data.fields) {
//         files = filterCaptionFiles(
//           data.fields[`${LanguageNames[lang]} 자막 파일`] as Attachment[]
//         )
//       }

//       const caption: TranslatedVideoMetadata = {
//         language: lang,
//         title,
//         description,
//         status,
//         captions: files,
//       }

//       captions.push(caption)
//     }
//   }

//   /**
//    * 한국어 처리
//    */
//   if (
//     `제목` in data.fields &&
//     `세부 정보` in data.fields &&
//     '한국어 자막 업로드' in data.fields
//   ) {
//     const title = (data.fields[`제목`] as string[])[0]
//     const description = (data.fields[`세부 정보`] as string[])[0]

//     let files: CaptionFile[] = []

//     if (`한국어 자막 파일` in data.fields) {
//       files = filterCaptionFiles(
//         data.fields[`한국어 자막 파일`] as Attachment[]
//       )
//     }

//     const caption: TranslatedVideoMetadata = {
//       language: 'ko',
//       title,
//       description,
//       status: 'waiting',
//       captions: files,
//     }

//     captions.push(caption)
//   }

//   const langs = Object.keys(LanguageNames)
//   for (let i = 0; i < langs.length; i++) {
//     fetchLanguages(langs[i] as OnWorkingLanguageCode)
//   }

//   return captions
// }

// export const extractVideoDataFields = (
//   data: Records<FieldSet>
// ): VideoWithCaption[] => {
//   return data.map(v => ({
//     id: v.id,
//     url: getFirstItem(v.fields['URL']),
//     title: getFirstItem(v.fields['제목']),
//     description: getFirstItem(v.fields['세부 정보']),
//     uploadDate: getFirstItem(v.fields['업로드 날짜']),
//     editDate: getFirstItem(v.fields['최근 수정']),
//     captions: extractNationalValue(v),
//   }))
// }

// export const extractLanguageSpecificData = (
//   language: OnWorkingLanguageCode,
//   data: Records<FieldSet>
// ): AirtableLanguageField[] => {
//   return data.map(v => {
//     return {
//       id: v.id,
//       url: getFirstItem(v.fields['URL'] as string[]),
//       channel: getFirstItem(v.fields['채널']),
//       noCC:
//         (checkIsIndividualLanguage(language)
//           ? getFirstItem(v.fields['진행 상황 (from 받아쓰기 + 자막 싱크)'])
//           : getFirstItem(v.fields[`${LanguageNames[language]} 진행 상황`])) ===
//         '해당없음 (자막 필요 없는 영상)',
//       originalTitle: getFirstItem(v.fields['제목']),
//       title: getFirstItem(v.fields[`${LanguageNames[language]} 제목`]),
//       description: getFirstItem(
//         v.fields[`${LanguageNames[language]} 세부 정보`]
//       ),
//       uploadDate: getFirstItem(v.fields['업로드 날짜']),
//       editDate: getFirstItem(v.fields['Last Modified']),
//       files:
//         typeof v.fields[`${LanguageNames[language]} 자막 파일`] === 'undefined'
//           ? []
//           : filterCaptionFiles(
//               v.fields[`${LanguageNames[language]} 자막 파일`] as Attachment[]
//             ),
//     }
//   })
// }

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
export type OnWorkingLanguageCode = LanguageCode

export const LanguageNames: Record<OnWorkingLanguageCode, string> = {
  aa: '아파르어',
  ab: '압하스어',
  ae: '아베스타어',
  af: '아프리칸스어',
  ak: '아칸어',
  am: '암하라어',
  an: '아르곤어',
  ar: '아랍어',
  as: '아샘어',
  av: '아바릭어',
  ay: '아이마어',
  az: '아제르바이잔어',
  ba: '바슈키르어',
  be: '벨라루스어',
  bg: '불가리아어',
  bh: '비하리어',
  bi: '비슬라마어',
  bm: '밤바라어',
  bn: '벵골어',
  bo: '티베트어',
  br: '브르타뉴어',
  bs: '보스니아어',
  ca: '카탈루냐어',
  ce: '체첸어',
  ch: '차모로어',
  co: '코르시카어',
  cr: '크리어',
  cs: '체코어',
  cu: '교회 슬라브어',
  cv: '카투마어',
  cy: '웨일스어',
  da: '덴마크어',
  de: '독일어',
  dv: '디베히어',
  dz: '종카어',
  ee: '에웨어',
  el: '현대 그리스어',
  en: '영어',
  eo: '에스페란토',
  es: '스페인어',
  et: '에스토니아어',
  eu: '바스크어',
  fa: '페르시아어',
  ff: '풀라어',
  fi: '핀란드어',
  fj: '피지어',
  fo: '페로어',
  fr: '프랑스어',
  fy: '프리지아어',
  ga: '아일랜드어',
  gd: '스코틀랜드 게일어',
  gl: '갈리시아어',
  gn: '과라니어',
  gu: '구자라티어',
  gv: '맨어',
  ha: '하우사어',
  he: '히브리어',
  hi: '힌디어',
  ho: '히로무어',
  hr: '크로아티아어',
  ht: '아이티크리올어',
  hu: '헝가리어',
  hy: '아르메니아어',
  hz: '헤레로어',
  ia: '인터링구아',
  id: '인도네시아어',
  ie: '인터링구어',
  ig: '이그보어',
  ii: '쓰촨 이어',
  ik: '이누피아크어',
  io: '이도',
  is: '아이슬란드어',
  it: '이탈리아어',
  iu: '이누이트어',
  ja: '일본어',
  jv: '자바어',
  ka: '그루지야어',
  kg: '콩고어',
  ki: '키쿠유어',
  kj: '콰냐마어',
  kk: '카자흐어',
  kl: '그린란드어',
  km: '크메르어 ',
  kn: '칸나다어',
  ko: '한국어',
  kr: '카누리어',
  ks: '카슈미르어',
  ku: '쿠르드어',
  kv: '페름어',
  kw: '콘월어',
  ky: '키르기스어',
  la: '라틴어',
  lb: '룩셈부르크어',
  lg: '간다어',
  li: '림뷔르흐어',
  ln: '링갈라어',
  lo: '라오어',
  lt: '리투아니아어',
  lu: '루바카탕가어',
  lv: '라트비아어',
  mg: '마다가스카르어',
  mh: '마셜어',
  mi: '마오리어',
  mk: '마케도니아어',
  ml: '말라얄람어',
  mn: '몽골어',
  mr: '마라타어',
  ms: '말레이어',
  mt: '몰타어',
  my: '미얀마어',
  na: '나우루어',
  nb: '노르웨이어',
  nd: '은데벨레어',
  ne: '네팔어',
  ng: '느동가어',
  nl: '네덜란드어',
  nn: '뉘노르스크어',
  no: '노르웨이어',
  nr: '남은데벨레어',
  nv: '나바호어',
  ny: '체와어',
  oc: '프로방스어',
  oj: '오지브와어',
  om: '오로모어',
  or: '오리야어',
  os: '오세트어',
  pa: '펀자브어',
  pi: '팔리어',
  pl: '폴란드어',
  ps: '파슈툰어',
  pt: '포르투갈어',
  qu: '케추아어',
  rm: '레토로망스어',
  rn: '룬디어',
  ro: '루마니아어',
  ru: '러시아어',
  rw: '르완다어',
  sa: '산스크리트어',
  sc: '사르데냐어',
  sd: '신드어',
  se: '북사미어',
  sg: '상고어',
  si: '싱할라어',
  sk: '슬로바키아어',
  sl: '슬로베니아어',
  sm: '사모아어',
  sn: '쇼나어',
  so: '소말리어',
  sq: '알바니아어',
  sr: '세르비아어',
  ss: '스와티어',
  st: '남소토어',
  su: '순다어',
  sv: '스웨덴어',
  sw: '스와힐리어',
  ta: '타밀어',
  te: '텔루구어',
  tg: '타지크어',
  th: '태국어',
  ti: '티그리냐어',
  tk: '투르크멘어',
  tl: '타갈로그',
  tn: '츠와나어',
  to: '통가어',
  tr: '터키어',
  ts: '총가어',
  tt: '타타르어',
  tw: '트위어',
  ty: '타이티어',
  ug: '위구르어',
  uk: '우크라이나어',
  ur: '우르두어',
  uz: '우즈베크어',
  ve: '벤다어',
  vi: '베트남어',
  vo: '볼라퓌크',
  wa: '왈론어',
  wo: '월로프어',
  xh: '코사어',
  yi: '이디시어',
  yo: '요루바어',
  za: '주앙어',
  zh: '중국어',
  zu: '줄주어',
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
  | '전체'

export type WorkStatus = 'none' | 'wip' | 'waiting' | 'done'

export const WorkStatusNames: Record<WorkStatus, WorkStatusNameTypes> = {
  done: '업로드 완료',
  none: '자막 작업 안함',
  waiting: '업로드 대기',
  wip: '번역 진행 중',
}

/**
 * failed에 있지 않은 영상들을 'lang'으로 묶어 반환합니다. (works-failed)
 *
 * ```
 * const videos = extractFinishedVideosByLanguage(
 *   [
 *     {id: 'a', lang: 'ko'},
 *     {id: 'b', lang: 'ko'},
 *     {id: 'c', lang: 'en'},
 *   ],
 *   [
 *     {id: 'b', lang: 'ko'},
 *   ]
 * ) // => {'ko': [{id: 'a', lang: 'ko'}], 'en': [{id: 'c', lang: 'en'}]}
 * ```
 *
 * @param works
 * @param failed
 */
export const extractFinishedVideosByLanguage = (
  works: VideoWorks[],
  failed: VideoWorks[]
) => {
  const done = works.filter(v => {
    for (let i = 0; i < failed.length; i++) {
      if (failed[i].id === v.id && failed[i].lang === v.lang) {
        return false
      }
    }

    return true
  })

  return groupBy(done, video => video.lang)
}
