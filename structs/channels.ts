export type ChannelID =
  | 'wakgood'
  | 'waktaverse'
  | 'ine'
  | 'jingburger'
  | 'lilpa'
  | 'jururu'
  | 'gosegu'
  | 'viichan'

export interface Channel {
  id: string
  channelId: string
  image: string
  color: string
  name: string
  airtableViewName: AirtableViewNameTypes
}

export const AirtableViewNames = [
  '우왁굳의 게임방송',
  '왁타버스',
  '주르르',
  '고세구',
  '아이네',
  '징버거',
  '릴파',
  '비챤',
] as const
export type AirtableViewNameTypes = typeof AirtableViewNames[number]

export const checkIsValidAirtableViewName = (
  viewName: string
): viewName is AirtableViewNameTypes => {
  return AirtableViewNames.filter(v => v === viewName).length > 0
}

export const Channels: Record<ChannelID, Channel> = {
  wakgood: {
    id: 'wakgood',
    channelId: 'UCBkyj16n2snkRg1BAzpovXQ',
    image:
      'https://yt3.ggpht.com/ytc/AKedOLTII3uAsKi9OXYNPhkgk-DzfqhiTpUnBtBAxhtS=s900-c-k-c0x00ffffff-no-rj',
    color: '#FCF2E3',
    name: '우왁굳의 게임방송',
    airtableViewName: '우왁굳의 게임방송',
  },
  waktaverse: {
    id: 'waktaverse',
    channelId: 'UCzh4yY8rl38knH33XpNqXbQ',
    image:
      'https://yt3.ggpht.com/QJdHgfT3P2HhhX4NdjtWYMK5vUNAjOmrKzBahdYOPMm62Qh2v3LaOOh_VW8pZso5TS8-gveo=s900-c-k-c0x00ffffff-no-rj',
    color: '#D5E9E4',
    name: '왁타버스 WAKTAVERSE',
    airtableViewName: '왁타버스',
  },
  ine: {
    id: 'ine',
    channelId: 'UCroM00J2ahCN6k-0-oAiDxg',
    image:
      'https://yt3.ggpht.com/hk4Bg_RBb21e2IDLN_Gjmw0jGfMIh26usUwjBvLr472mX8_l8dednSbifhXKPP0QCN8_EPAWBV0=s900-c-k-c0x00ffffff-no-rj',
    color: '#F4ECF8',
    name: '아이네 INE',
    airtableViewName: '아이네',
  },
  jingburger: {
    id: 'jingburger',
    channelId: 'UCHE7GBQVtdh-c1m3tjFdevQ',
    image:
      'https://yt3.ggpht.com/5vwZ3NZL6Zv4C7cl5sshsTk-XycH7r-4zo6nQR7g9Z7SLrMzeabWWzn5M1V3SqJXjTxLj_hb=s900-c-k-c0x00ffffff-no-rj',
    color: '#FFF8DE',
    name: '징버거 JINGBURGER',
    airtableViewName: '징버거',
  },
  lilpa: {
    id: 'lilpa',
    channelId: 'UC-oCJP9t47v7-DmsnmXV38Q',
    image:
      'https://yt3.ggpht.com/ZFF_hEJhjNyF3UJLolZZPEV8EMM7V-e8HtTvzLiZXNM6s4rh518242ghR-bUXRYkMaJtedKoaZA=s900-c-k-c0x00ffffff-no-rj',
    color: '#D8D4DD',
    name: '릴파 lilpa',
    airtableViewName: '릴파',
  },
  jururu: {
    id: 'jururu',
    channelId: 'UCTifMx1ONpElK5x6B4ng8eg',
    image:
      'https://yt3.ggpht.com/v3a75a7gUHU6E-gaJww_k5gkFYI8jthCtAR9ELMaRemymZhIyQLiIIRu4cWOt289DFH1UNkFMA=s900-c-k-c0x00ffffff-no-rj',
    color: '#F6E4E5',
    name: '주르르 JURURU Ch',
    airtableViewName: '주르르',
  },
  gosegu: {
    id: 'gosegu',
    channelId: 'UCV9WL7sW6_KjanYkUUaIDfQ',
    image:
      'https://yt3.ggpht.com/AIoO_0IdKYBdzlcRQ85oZxMaTBj_RVDvP8QmTmJZoOO_TTJd5NXql17hDfIl_bvcTQ4aAqFGIA=s900-c-k-c0x00ffffff-no-rj',
    color: '#E5F6FB',
    name: '고세구 GOSEGU',
    airtableViewName: '고세구',
  },
  viichan: {
    id: 'viichan',
    channelId: 'UCs6EwgxKLY9GG4QNUrP5hoQ',
    image:
      'https://yt3.ggpht.com/mgeSP-KxZvBEtEVYYGyWeiTJ7C1ap1ZwGYM2Dfew7tYh6maJV0CJYf_OIASeUKVJmFMVcZE-BQ=s900-c-k-c0x00ffffff-no-rj',
    color: '#EEF1E4',
    name: '비챤 VIichan',
    airtableViewName: '비챤',
  },
}

export const getChannelIDByName = (name: string): ChannelID | null => {
  if (name.indexOf('비챤') > -1) {
    return 'viichan'
  }

  if (name.indexOf('고세구') > -1) {
    return 'gosegu'
  }

  if (name.indexOf('징버거') > -1) {
    return 'jingburger'
  }

  if (name.indexOf('릴파') > -1) {
    return 'lilpa'
  }

  if (name.indexOf('아이네') > -1) {
    return 'ine'
  }

  if (name.indexOf('주르르') > -1) {
    return 'jururu'
  }

  if (name.indexOf('우왁굳') > -1) {
    return 'wakgood'
  }

  if (name.indexOf('왁타버스') > -1) {
    return 'waktaverse'
  }

  return null
}
