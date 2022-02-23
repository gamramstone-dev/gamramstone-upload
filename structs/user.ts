import { SettingTypes } from './setting'

export type UserState = 'guest' | 'translator' | 'admin' | 'banned' | 'creator'

export const UserStateNames: Record<UserState, string> = {
  admin: '관리자',
  banned: '차단',
  creator: 'YouTube 크리에이터',
  guest: '방문자',
  translator: '번역가',
}

export interface DatabaseUser {
  lastLogin: string
  state: UserState
  settings: SettingTypes
}

export const hasCreatorPermission = (state: UserState) => {
  return state === 'creator' || state === 'admin'
}

export const checkIsValidUserState = (state: string): state is UserState => {
  return Object.keys(UserStateNames).includes(state)
}
