import {
  AnimatePresence,
  AnimateSharedLayout,
  LayoutGroup,
  motion,
  Variants,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import { VideoWithCaption } from '../structs/airtable'
import styles from '../styles/components/ProcessPopup.module.scss'
import { useBodyLock } from '../utils/react'
import { classes, getYouTubeId } from '../utils/string'
import { Button } from './Button'
import { LoadSpinner } from './Loading'
import { YouTubeThumbnail } from './VideoCard'

const backgroundVariants: Variants = {
  initial: {
    opacity: 0,
    pointerEvents: 'none',
  },
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
}

const popupVariants: Variants = {
  initial: {
    opacity: 0,
    translateY: 50,
  },
  visible: {
    opacity: 1,
    translateY: 0,
  },
}

const tabVariants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    translateX: direction > 0 ? 600 : -600,
  }),
  exit: (direction: number) => ({
    opacity: 0,
    translateX: direction < 0 ? 600 : -600,
  }),
  animate: {
    opacity: 1,
    translateX: 0,
  },
}

const tabTransition = {
  translateX: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
}

const usePreviousValue = (num: number) => {
  const [state, setState] = useState<number>(num)

  useEffect(() => {
    setState(num)
  }, [num])

  return state
}

interface ProcessPopupProps {
  data: VideoWithCaption[]
  close?: () => void
}

export const ProcessPopup = ({ data, close }: ProcessPopupProps) => {
  useBodyLock(true)

  const [step, setStep] = useState(0)
  const previousStep = usePreviousValue(step)

  const Ask = (
    <motion.div
      className={styles.tab}
      key='tab-ask'
      variants={tabVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={tabTransition}
    >
      <div
        className={styles.thumbnails}
        data-size={data && Math.min(5, data.length)}
      >
        {data?.map(
          (v, i) =>
            i < 5 && (
              <div key={`${v.url}-thumbnail`} className={styles.thumbnail}>
                <YouTubeThumbnail id={getYouTubeId(v.url)}></YouTubeThumbnail>
              </div>
            )
        )}
      </div>
      <h1 className={styles.title}>
        {data && data.length}개의 영상에 자동으로 자막을 달까요?
      </h1>
      <div className={styles.actions}>
        <Button theme='secondary' roundness={16} onClick={close}>
          닫기
        </Button>
        <Button theme='primary' roundness={16} onClick={() => setStep(1)}>
          개같이 시작
        </Button>
      </div>
    </motion.div>
  )

  const OnProgress = (
    <motion.div
      className={classes(styles.tab, styles.onProgress)}
      key='tab-progress'
      variants={tabVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={tabTransition}
    >
      <LoadSpinner></LoadSpinner>
      <div className={styles.workingThumbnail}>
        <YouTubeThumbnail id={getYouTubeId(data[0].url)}></YouTubeThumbnail>
      </div>
      <h1 className={styles.title}>자막을 달고 있어요!</h1>
      <Button theme='secondary' roundness={16} onClick={() => setStep(0)}>
        이전
      </Button>
    </motion.div>
  )

  const Success = (
    <motion.div
      className={styles.tab}
      key='tab-success'
      variants={tabVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={tabTransition}
    ></motion.div>
  )

  const Error = (
    <motion.div
      className={styles.tab}
      key='tab-error'
      variants={tabVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={tabTransition}
    ></motion.div>
  )

  return (
    <div className={styles.popupWrapper}>
      <motion.div
        className={styles.background}
        initial='initial'
        animate='visible'
        exit='initial'
        variants={backgroundVariants}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 10,
        }}
        onClick={ev => {
          ev.stopPropagation()
          step !== 1 && close && close()
        }}
      ></motion.div>
      <motion.div
        className={styles.popup}
        initial='initial'
        animate='visible'
        exit='initial'
        custom={step - previousStep}
        variants={popupVariants}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 100,
        }}
      >
        <AnimatePresence>
          {step === 0
            ? Ask
            : step === 1
            ? OnProgress
            : step === 2
            ? Success
            : Error}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ProcessPopup
