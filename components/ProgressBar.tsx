import { CSSProperties } from 'react'
import styles from '../styles/components/ProgressBar.module.scss'
import { classes } from '../utils/string'

type BarStyle = 'primary' | 'secondary' | 'danger' | 'warning'

interface ProgressBarProps {
  progress: number
  barStyle?: BarStyle
}

interface BarStyles extends CSSProperties {
  '--progress'?: number
}

export const ProgressBar = ({ progress, barStyle = 'primary' }: ProgressBarProps) => {
  return (
    <div className={styles.progress}>
      <div
        className={classes(styles.bar, barStyle && styles[barStyle])}
        style={{ '--progress': progress } as BarStyles}
      ></div>
    </div>
  )
}

export default ProgressBar
