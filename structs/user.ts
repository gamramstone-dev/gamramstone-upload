import { SettingTypes } from "./setting";

export interface DatabaseUser {
  lastLogin: string
  settings: SettingTypes
}