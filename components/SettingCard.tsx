import { useTranslation } from 'react-i18next'
import { Setting, SettingID, SettingTypes } from '../structs/setting'
import styles from '../styles/components/SettingCard.module.scss'
import { Button } from './Button'
import Checkbox from './Checkbox'

interface SettingCardProps {
  setting: Partial<Setting<unknown>>
  onChange: (value: SettingTypes[SettingID]) => void
}

export const SettingCard = ({ setting, onChange }: SettingCardProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.settingCard}>
      <div className={styles.contents}>
        <div className={styles.value}>
          {setting.type === 'checkbox' ? (
            <Checkbox
              checked={setting.value as boolean}
              disabled={setting.disabled}
              onChange={onChange}
            />
          ) : (
            setting.type === 'button' && (
              <Button
                onClick={() => onChange(true)}
                disabled={setting.disabled}
              >
                {t(setting.title || 'unknown')}
              </Button>
            )
          )}
        </div>
        <h3 className={styles.title}>{t(setting.title || 'unknown')}</h3>
        <p className={styles.description}>
          {typeof setting.description === 'string'
            ? t(setting.description)
            : setting.description}
        </p>
      </div>
    </div>
  )
}

export default SettingCard
