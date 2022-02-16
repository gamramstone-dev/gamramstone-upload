import { atom, DefaultValue, RecoilState, selector } from 'recoil'

interface GamramSettings {
  darkMode: boolean
}

export type SettingID = 'darkMode'

export interface SettingTypes {
  darkMode: boolean
}

export const Settings: Record<
  SettingID,
  SettingBase<SettingTypes[SettingID]>
> = {
  darkMode: {
    id: 'darkMode',
    type: 'checkbox',
    title: '어둠의 자식 모드',
    description: '흰색으로부터 눈을 보호하세요.',
    default:
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false,
  },
}

export const darkModeAtom = atom({
  key: 'darkMode',
  default: false,
})

export const SettingsAtom: Record<
  SettingID,
  RecoilState<SettingTypes[SettingID]>
> = {
  darkMode: darkModeAtom,
}

export const globalSettings = selector<GamramSettings>({
  key: 'globalSettings',
  get: ({ get }) => {
    const darkMode = get(darkModeAtom)

    return { darkMode }
  },
  set: ({ set }, value) => {
    if (value instanceof DefaultValue) {
      return
    }

    ;(Object.keys(value) as SettingID[]).forEach(key => {
      set(SettingsAtom[key], value[key])
    })
  },
})

export const validateSettings = (value: unknown): value is SettingTypes => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (
    'darkMode' in value &&
    typeof (value as Record<'darkMode', unknown>).darkMode === 'boolean'
  ) {
    return true
  }

  return false
}

export interface SettingBase<T> {
  id: SettingID
  title: string
  description: string
  type: 'checkbox' | 'button'
  default: T
}

export interface Setting<T> extends SettingBase<T> {
  value: T
}

export type SettingDB = string | number
