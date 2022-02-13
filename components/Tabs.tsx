import {
  HoverHandlers,
  motion,
  Spring,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'
import { cloneElement, ReactElement, useEffect, useRef, useState } from 'react'
import styles from '../styles/components/Tabs.module.scss'
import { useDebouncer } from '../utils/run'

interface TabButtonProps {
  children: string
  index: number
  active?: boolean
  onHoverStart?: (index: number) => void
  onHoverEnd?: (index: number) => void
  onClick: (index: number) => void
}

export const TabButton = ({
  children,
  index,
  active,
  onHoverStart,
  onHoverEnd,
  onClick,
}: TabButtonProps) => {
  return (
    <motion.div
      className={styles.tabButton}
      data-index={index}
      data-active={active}
      onHoverStart={() => onHoverStart && onHoverStart(index)}
      onHoverEnd={() => onHoverEnd && onHoverEnd(index)}
      onClick={() => onClick(index)}
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
  children: ReactElement<Partial<TabButtonProps>>[]
  defaultIndex?: number
}

export const TabGroup = ({ children, defaultIndex = 0 }: TabGroupProps) => {
  const group = useRef<HTMLDivElement>(null!)
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex)
  const [hoverIndex, setHoverIndex] = useState<number>(0)

  const [run, cancel] = useDebouncer(() => {
    setHoverIndex(-1)
  }, 60);

  const childs = children.map((child, index) =>
    cloneElement(child, {
      ...child.props,
      index: index,
      active: index === activeIndex,
      onHoverStart: (index: number) => {
        cancel()
        setHoverIndex(index)
      },
      onHoverEnd: (index: number) => run(),
      onClick: (index: number) => setActiveIndex(index),
    })
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

  useEffect(() => {
    setActiveIndex(defaultIndex)
  }, [defaultIndex])

  const hoverLeftTemplate = useMotionTemplate`${hoverLeft}px`
  const hoverWidthTemplate = useMotionTemplate`${hoverWidth}px`

  return (
    <div className={styles.tabGroup} ref={group}>
      <div className={styles.buttons}>{childs}</div>
      <motion.div
        className={styles.ghostButton}
        data-visible={hoverIndex !== -1}
        style={{
          '--left': hoverLeftTemplate,
          '--width': hoverWidthTemplate,
        }}
      ></motion.div>
    </div>
  )
}
