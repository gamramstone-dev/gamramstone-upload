import { CSSProperties, ReactNode } from 'react'

import styles from '../styles/components/Button.module.scss'
import { classes } from '../utils/string'

type ButtonTheme = 'primary' | 'secondary' | 'danger' | 'warning'
type ButtonSize = 'large' | 'medium' | 'small'

interface ButtonBaseProps {
  className?: string
  theme?: ButtonTheme
  size?: ButtonSize
  children?: ReactNode
  roundness?: number,
  onClick?: () => void
}

interface ButtonStyles extends CSSProperties {
  '--round'?: string
}

export const Button = ({
  children,
  className,
  roundness = 0,
  size = 'medium',
  theme = 'primary',
  onClick
}: ButtonBaseProps) => {
  return (
    <div
      className={classes(
        styles.button,
        className,
        size && styles[size],
        theme && styles[theme]
      )}
      onClick={onClick}
      style={
        {
          '--round': `${roundness}px`,
        } as ButtonStyles
      }
    >
      {children}
    </div>
  )
}
