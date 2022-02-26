import {
  motion,
  MotionValue,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'
import {
  cloneElement,
  CSSProperties,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from '../styles/components/Tabs.module.scss'
import { useDebouncer } from '../hooks/debouncer'

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
  return (
    <motion.div
      className={styles.tabButton}
      data-index={index}
      data-active={active}
      data-disabled={disabled}
      onHoverStart={() => onHoverStart && onHoverStart(index)}
      onHoverEnd={() => onHoverEnd && onHoverEnd(index)}
      onClick={() => onClick && !disabled && onClick(index)}
    >
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
