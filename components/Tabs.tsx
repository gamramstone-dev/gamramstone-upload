import {
  motion,
  MotionValue,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'
import React, {
  cloneElement,
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from '../styles/components/Tabs.module.scss'
import { useDebouncer } from '../hooks/debouncer'
import { RippleData } from '../structs/components/ripple'
import { CustomStyles } from '../pages/test/colors'

interface TabButtonProps {
  children: string
  index?: number
  active?: boolean
  disabled?: boolean
  onHoverStart?: (index: number) => void
  onHoverEnd?: (index: number) => void
  onClick?: (index: number) => void
}

export const TabButton = ({
  children,
  index = 0,
  active,
  disabled = false,
  onHoverStart,
  onHoverEnd,
  onClick,
}: TabButtonProps) => {
  const [ripple, setRipple] = useState<RippleData | null>(null)

  const localClickHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
      const rect = ev.currentTarget.getBoundingClientRect()

      setRipple({
        x: ev.nativeEvent.offsetX - rect.width / 2,
        y: ev.nativeEvent.offsetY - rect.width / 2,
        startedAt: Date.now(),
      })

      if (onClick) {
        onClick(index)
      }
    },
    [onClick]
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
    <motion.div
      className={styles.tabButton}
      data-index={index}
      data-active={active}
      data-disabled={disabled}
      onHoverStart={() => onHoverStart && onHoverStart(index)}
      onHoverEnd={() => onHoverEnd && onHoverEnd(index)}
      onClick={ev => onClick && !disabled && localClickHandler(ev, index)}
    >
      {ripple && (
        <div
          className={styles.rippleContainer}
          key={`ripple-${ripple.startedAt}`}
        >
          <span
            className={styles.ripple}
            style={
              {
                '--x': `${ripple.x}px`,
                '--y': `${ripple.y}px`,
              } as CustomStyles
            }
          ></span>
        </div>
      )}
      {children}
    </motion.div>
  )
}

const AnimationOption: Parameters<typeof useSpring>[1] = {
  damping: 100,
  stiffness: 2000,
}

interface TabGroupProps {
  children: ReactElement<TabButtonProps>[]
  activeIndex: number
  setActiveIndex: (index: number) => void
}

interface GhostButtonStyles extends CSSProperties {
  '--left'?: MotionValue<string>
  '--width'?: MotionValue<string>
}

export const TabGroup = ({
  children,
  activeIndex,
  setActiveIndex,
}: TabGroupProps) => {
  const group = useRef<HTMLDivElement>(null!)
  const [hoverIndex, setHoverIndex] = useState<number>(-1)

  const [run, cancel] = useDebouncer(() => {
    setHoverIndex(-1)
  }, 60)

  const childs = useMemo(
    () =>
      children.map((child, index) =>
        cloneElement(child, {
          ...child.props,
          index: index,
          active: index === activeIndex,
          onHoverStart: (index: number) => {
            cancel()
            setHoverIndex(index)
          },
          onHoverEnd: () => run(),
          onClick: (index: number) => setActiveIndex(index),
        })
      ),
    [activeIndex, cancel, children, run, setActiveIndex]
  )

  useEffect(
    () => () => {
      cancel()
    },
    [cancel]
  )

  const hoverLeft = useSpring(0, AnimationOption)
  const hoverWidth = useSpring(0, AnimationOption)

  useEffect(() => {
    if (hoverIndex === -1) {
      return
    }

    const button = group.current.querySelector(
      `.${styles.tabButton}:nth-child(${hoverIndex + 1})`
    ) as HTMLElement

    hoverLeft.set(button.offsetLeft)
    hoverWidth.set(button.offsetWidth)
  }, [hoverIndex, hoverLeft, hoverWidth])

  const hoverLeftTemplate = useMotionTemplate`${hoverLeft}px`
  const hoverWidthTemplate = useMotionTemplate`${hoverWidth}px`

  return (
    <div className={styles.tabGroup} ref={group}>
      <div className={styles.buttons}>{childs}</div>
      <motion.div
        className={styles.ghostButton}
        data-visible={hoverIndex !== -1}
        style={
          {
            '--left': hoverLeftTemplate,
            '--width': hoverWidthTemplate,
          } as GhostButtonStyles
        }
      ></motion.div>
    </div>
  )
}
