import styles from '../styles/components/ProgressBar.module.scss'
import { classes } from '../utils/string'

import { motion } from 'framer-motion'

type BarStyle = 'primary' | 'secondary' | 'danger' | 'warning'

interface ProgressBarProps {
  progress: number
  barStyle?: BarStyle
}

export const ProgressBar = ({
  progress,
  barStyle = 'primary',
}: ProgressBarProps) => {
  return (
    <div className={styles.progress}>
      <motion.div
        className={classes(styles.bar, barStyle && styles[barStyle])}
        initial={{
          scaleX: 0,
        }}
        animate={{
          scaleX: progress,
        }}
        exit={{
          scaleX: 0,
        }}
        transition={{
          type: 'spring',
          duration: 1,
        }}
      ></motion.div>
    </div>
  )
}

export default ProgressBar
