import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { RippleData } from '../structs/components/ripple'

import styles from '../styles/components/Button.module.scss'
import { classes } from '../utils/string'

type ButtonTheme = 'primary' | 'secondary' | 'danger' | 'warning'
type ButtonSize = 'large' | 'medium' | 'small'

interface ButtonBaseProps {
  className?: string
  theme?: ButtonTheme
  size?: ButtonSize
  icon?: string
  disabled?: boolean
  children?: ReactNode
  roundness?: number
  useRipple?: boolean
  onClick?: () => void
  onContext?: () => void
}

interface ButtonStyles extends CSSProperties {
  '--round'?: string
}

export const Button = ({
  children,
  className,
  icon,
  disabled = false,
  roundness = 16,
  size = 'medium',
  useRipple = false,
  theme = 'primary',
  onClick,
  onContext,
}: ButtonBaseProps) => {
  const [ripple, setRipple] = useState<RippleData | null>(null)

  const localClickHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (useRipple) {
        const rect = ev.currentTarget.getBoundingClientRect()

        setRipple({
          x: ev.nativeEvent.offsetX - rect.width / 2,
          y: ev.nativeEvent.offsetY - rect.height / 2,
          startedAt: Date.now(),
        })
      }

      if (onClick) {
        onClick()
      }
    },
    [onClick, useRipple]
  )

  useEffect(() => {
    if (ripple) {
      const timeout = setTimeout(() => {
        setRipple(null)
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [ripple])

  return (
    <div
      className={classes(
        styles.button,
        className,
        disabled && styles.disabled,
        size && styles[size],
        theme && styles[theme]
      )}
      onClick={ev => onClick && !disabled && localClickHandler(ev)}
      onContextMenu={ev =>
        onContext && !disabled && (ev.preventDefault(), onContext())
      }
      style={
        {
          '--round': `${roundness}px`,
        } as ButtonStyles
      }
    >
      {ripple && (
        <div
          className={styles.rippleContainer}
          key={`ripple-${ripple.x}-${ripple.y}-${ripple.startedAt}`}
        >
          <span
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          ></span>
        </div>
      )}
      {icon && <i className={classes(styles.icon, `ri-${icon}`)}></i>}
      {children}
    </div>
  )
}
