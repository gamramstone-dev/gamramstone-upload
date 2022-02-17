import { Setting, SettingID, SettingTypes } from '../structs/setting'
import styles from '../styles/components/SettingCard.module.scss'
import { Button } from './Button'
import Checkbox from './Checkbox'

interface SettingCardProps {
  setting: Partial<Setting<unknown>>
  onChange: (value: SettingTypes[SettingID]) => void
}

export const SettingCard = ({ setting, onChange }: SettingCardProps) => {
  return (
    <div className={styles.settingCard}>
      <div className={styles.contents}>
        <div className={styles.value}>
          {setting.type === 'checkbox' ? (
            <Checkbox checked={setting.value as boolean} onChange={onChange} />
          ) : (
            setting.type === 'button' && (
              <Button onClick={() => onChange(true)} roundness={16}>{setting.title}</Button>
            )
          )}
        </div>
        <h3 className={styles.title}>{setting.title}</h3>
        <p className={styles.description}>{setting.description}</p>
      </div>
    </div>
  )
}

export default SettingCard
