import { AnimatePresence, motion, Variants } from 'framer-motion'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState, useRef, ReactNode, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  CaptionFile,
  LanguageNames,
  OnWorkingLanguageCode,
  VideoWithCaption,
} from '../structs/airtable'
import styles from '../styles/components/ProcessPopup.module.scss'
import { applyCaptions } from '../utils/clientAPI'
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

export const PopupTab = ({
  className,
  children,
  custom,
}: {
  className: string
  children?: ReactNode
  custom: number
}) => {
  return (
    <motion.div
      className={className}
      variants={tabVariants}
      custom={custom}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={tabTransition}
    >
      {children}
    </motion.div>
  )
}

const usePreviousValue = (num: number) => {
  const [previousValue, setPreviousValue] = useState<number[]>([0, 0])

  useEffect(() => {
    setPreviousValue(v => {
      return [v[1], num]
    })
  }, [num])

  return previousValue[0]
}

interface VideoWorks {
  id: string
  dataIndex: number
  lang: OnWorkingLanguageCode
  title: string
  description: string
  captions: CaptionFile[]
}

const getVideoWorks = (datas: VideoWithCaption[]): VideoWorks[] => {
  return datas
    .map((data, dataIndex) => {
      const id = getYouTubeId(data.url)

      return data.captions
        .map(v => {
          if (v.status !== 'waiting') {
            return null
          }

          return {
            id,
            dataIndex: dataIndex,
            lang: v.language,
            title: v.title,
            description: v.description,
            captions: v.captions,
          }
        })
        .filter(v => v !== null) as VideoWorks[]
    })
    .flat()
}

interface ProcessPopupProps {
  data: VideoWithCaption[]
  token: string
  close?: () => void
  noPermission?: boolean
}

export const ProcessPopup = ({
  data,
  close,
  token,
  noPermission,
}: ProcessPopupProps) => {
  useBodyLock(true)

  const [step, setStep] = useState(0)
  const previousStep = usePreviousValue(step)

  const [tasks, setTasks] = useState<VideoWorks[]>(getVideoWorks(data))
  const [taskIndex, setTaskIndex] = useState<number>(0)

  const [errorTasks, setErrorTasks] = useState<VideoWorks[]>([])
  const [currentTaskDone, setCurrentTaskDone] = useState<boolean>(false)

  const [pause, setPause] = useState<boolean>(false)

  const errorStreaks = useRef(0)

  useEffect(() => {
    if (!currentTaskDone) {
      return
    }

    if (!errorTasks.length) {
      setStep(2)
    } else {
      setStep(3)
    }
  }, [currentTaskDone, errorTasks.length])

  useEffect(() => {
    if (step !== 1) {
      return
    }

    if (pause) {
      return
    }

    if (window.location.href.indexOf('devMode') > -1) {
      const timeout = setTimeout(() => {
        if (taskIndex + 1 >= tasks.length) {
          setCurrentTaskDone(true)

          return
        }

        if (Math.random() > 0.9) {
          setErrorTasks(v => [...v, tasks[taskIndex]])
        }

        setTaskIndex(taskIndex + 1)
      }, 600 * Math.random())

      return () => {
        clearTimeout(timeout)
      }
    }

    applyCaptions(
      token,
      tasks[taskIndex].lang,
      tasks[taskIndex].id,
      tasks[taskIndex].title,
      tasks[taskIndex].description,
      tasks[taskIndex].captions
    )
      .then(() => {
        errorStreaks.current = 0

        setTimeout(() => {
          if (taskIndex + 1 >= tasks.length) {
            setCurrentTaskDone(true)

            return
          }

          setTaskIndex(taskIndex + 1)
        }, 1000)
      })
      .catch(e => {
        toast.error((e as Error).message)
        errorStreaks.current++

        setErrorTasks(v => [...v, tasks[taskIndex]])

        if (errorStreaks.current >= 3) {
          setPause(true)
        }

        if (taskIndex + 1 >= tasks.length) {
          setCurrentTaskDone(true)

          return
        }

        setTaskIndex(taskIndex + 1)
      })
  }, [tasks, step, taskIndex, token, pause])

  const retryErrors = useCallback(() => {
    setCurrentTaskDone(false)
    setTaskIndex(0)
    setTasks(errorTasks)
    setErrorTasks([])
    setStep(1)
    setPause(false)
  }, [errorTasks])

  const Ask = (
    <PopupTab className={styles.tab} key='tab-ask' custom={step - previousStep}>
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
        <Button theme='secondary' icon='close' onClick={close}>
          닫기
        </Button>
        <Button theme='primary' onClick={() => setStep(1)}>
          개같이 시작
        </Button>
      </div>
    </PopupTab>
  )

  const OnProgress = (
    <PopupTab
      className={classes(styles.tab, styles.onProgress)}
      key='tab-progress'
      custom={step - previousStep}
    >
      <div className={styles.progressBar}>
        <span
          className={styles.bar}
          style={{
            width: `${(taskIndex / tasks.length) * 100}%`,
          }}
        ></span>
      </div>
      <div className={styles.workingThumbnail}>
        <YouTubeThumbnail
          id={getYouTubeId(data[tasks[taskIndex].dataIndex].url)}
        ></YouTubeThumbnail>
      </div>

      {pause ? (
        <>
          <h1 className={styles.title}>
            에러가 계속 발생하고 있어요. 계속 진행할까요?
          </h1>
          <div className={styles.actions}>
            <Button theme='secondary' onClick={close}>
              취소
            </Button>
            <Button
              theme='primary'
              onClick={() => {
                errorStreaks.current = 0
                setPause(false)
              }}
            >
              계속
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className={styles.title}>
            {data[tasks[taskIndex].dataIndex].title}
            <br />
            {LanguageNames[tasks[taskIndex].lang]} 자막 업로드 중...
          </h1>
          <p className={styles.progressText}>
            {taskIndex + 1}/{tasks.length}
            {errorTasks.length ? ` (${errorTasks.length} 오류)` : ''}, 업로드
            도중에 창을 닫지 마세요.
          </p>
          <div className={styles.spinner}>
            <LoadSpinner></LoadSpinner>
          </div>
        </>
      )}
    </PopupTab>
  )

  const Success = (
    <PopupTab
      className={classes(styles.tab, styles.statusTab)}
      key='tab-success'
      custom={step - previousStep}
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
        {data.length}개의 영상에 자막을 달았어요!
      </h1>
      <p className={styles.description}>
        항상 저희 감람스톤을 이용해주셔서 감사합니다.
      </p>

      <div className={styles.actions}>
        <Button theme='secondary' icon='close-line' onClick={close}>
          닫기
        </Button>
        <Button
          theme='primary'
          icon='logout-box-line'
          onClick={() => signOut()}
        >
          로그아웃
        </Button>
      </div>
    </PopupTab>
  )

  const Error = (
    <PopupTab
      className={classes(styles.tab, styles.statusTab)}
      key='tab-error'
      custom={step - previousStep}
    >
      <div
        className={styles.thumbnails}
        data-size={Math.min(5, errorTasks.length)}
      >
        {errorTasks.map(
          (v, i) =>
            i < 5 && (
              <div key={`${v.id}-thumbnail`} className={styles.thumbnail}>
                <YouTubeThumbnail id={v.id}></YouTubeThumbnail>
              </div>
            )
        )}
      </div>
      <h1 className={styles.title}>
        {errorTasks.length}개의 작업에 오류가 있었어요...
      </h1>

      <div className={styles.actions}>
        <Button theme='secondary' icon='close-line' onClick={close}>
          닫기
        </Button>
        <Button
          theme='primary'
          icon='restart-line'
          onClick={() => retryErrors()}
        >
          다시 시도
        </Button>
      </div>
    </PopupTab>
  )

  const RequestPermission = (
    <PopupTab
      className={classes(styles.tab, styles.statusTab)}
      key='tab-permission'
      custom={step - previousStep}
    >
      <div className={styles.center}>
        <h1 className={styles.title}>
          업로드하려면 YouTube 계정 권한이 필요해요.
        </h1>

        <p className={styles.description}>
          계속하기 전에, 감람스톤에서 어떤 정보를 사용하고 처리하는지{' '}
          <Link href={'/privacy'} passHref>
            <a target='_blank'>개인정보 처리방침</a>
          </Link>
          에서 알아보세요.
        </p>
      </div>

      <div className={styles.actions}>
        <Button theme='secondary' icon='close-line' onClick={close}>
          닫기
        </Button>
        <Button
          theme='primary'
          icon='login-box-line'
          onClick={() => signIn('google')}
        >
          권한 부여
        </Button>
      </div>
    </PopupTab>
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
        variants={popupVariants}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 100,
        }}
      >
        <AnimatePresence custom={step - previousStep}>
          {noPermission
            ? RequestPermission
            : step === 0
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
