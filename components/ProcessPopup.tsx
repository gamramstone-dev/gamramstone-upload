import { AnimatePresence, motion, Variants } from 'framer-motion'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState, useRef, ReactNode, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  extractFinishedVideosByLanguage,
  LanguageCode,
  LanguageNames,
  VideoWithCaption,
  VideoWorks,
} from '../structs/common'
import styles from '../styles/components/ProcessPopup.module.scss'
import { applyCaptions, updateVideoState } from '../utils/client/requests'
import { useBodyLock } from '../hooks/styles'
import { classes, getYouTubeId } from '../utils/string'
import { Button } from './Button'
import { LoadSpinner } from './Loading'
import { YouTubeThumbnail } from './VideoCard'

import confetties from '../utils/client/confetties'

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
    translateY: 25,
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

export const getVideoWorks = (datas: VideoWithCaption[]): VideoWorks[] => {
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
  token?: string
  close?: () => void
  noPermission?: boolean
  onUpload?: (videos: [string, LanguageCode][]) => void
}

export const ProcessPopup = ({
  data,
  close,
  token,
  noPermission,
  onUpload,
}: ProcessPopupProps) => {
  const [closing, setClosing] = useState(false)

  useBodyLock(!closing && true)

  const [step, setStep] = useState(0)
  const previousStep = usePreviousValue(step)

  const [tasks, setTasks] = useState<VideoWorks[]>(getVideoWorks(data))
  const [taskIndex, setTaskIndex] = useState<number>(0)

  const [errorTasks, setErrorTasks] = useState<VideoWorks[]>([])
  const [currentTaskDone, setCurrentTaskDone] = useState<boolean>(false)

  const [pause, setPause] = useState<boolean>(false)

  const errorStreaks = useRef(0)

  const localCloseHandler = useCallback(() => {
    if (!close) {
      return
    }

    setClosing(true)
    close()
  }, [close])

  /**
   * 작업이 완료됐을 때 실행할 Effect. 상태 변경 요청을 여기서 담당합니다.
   */
  useEffect(() => {
    if (!currentTaskDone) {
      return
    }

    setCurrentTaskDone(false)

    const loading = toast.loading('업로드 상태를 변경하는 중...')

    // 오류가 난 항목을 제외한 나머지 항목을 반환합니다.
    const videos = extractFinishedVideosByLanguage(tasks, errorTasks)
    const works = Array.from(videos, ([name, value]) => ({ name, value }))

    // works에 있는 작업들을 요청으로 만들어 queue라는 배열에 저장합니다.
    // Promise.all을 쓰지 않는 이유는 서버 DB 처리 과정에서 race condition이 발생할 수 있어서
    // 요청을 blocking 방식으로 처리하게 만들었습니다.
    let queue = works.map(({ name, value }) => () =>
        updateVideoState(
          name,
          value.map(v => v.id),
          window.location.href.indexOf('devMode') > -1
        )
      )

      /**
       * 위에서 나눈 요청들을 순서대로 실행합니다.
       */
    ;(async () => {
      let results: boolean[] = []

      for (let i = 0; i < queue.length; i++) {
        const data = await (await queue[i]()).json()
        results.push(data.status === 'success')
      }

      const succeed = results.every(v => v === true)

      if (!succeed) {
        toast.error(`업로드 상태 변경 중 오류가 발생했습니다.`)
      } else {
        onUpload &&
          onUpload(
            works
              .map(({ value }) =>
                value.map(v => [v.id, v.lang] as [string, LanguageCode])
              )
              .flat()
          )
      }

      toast.dismiss(loading)

      if (!errorTasks.length) {
        setStep(2)
      } else {
        setStep(3)
      }

      setTaskIndex(0)
    })()
  }, [currentTaskDone, errorTasks, errorTasks.length, onUpload, tasks])

  useEffect(() => {
    if (step !== 2) {
      return
    }

    confetties.fireworks()
  }, [step])

  /**
   * 업로드 탭 Effect. 자막 업로드를 여기서 담당합니다.
   */
  useEffect(() => {
    if (step !== 1) {
      return
    }

    if (pause) {
      return
    }

    /**
     * URL에 ?devMode가 있는 경우에는 YouTube API를 호출하지 않고 테스트로 작업을 수행합니다.
     */
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
        }, 300)
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
        <Button theme='secondary' icon='close' onClick={localCloseHandler}>
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
            <Button theme='secondary' onClick={localCloseHandler}>
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
        <Button theme='secondary' icon='close-line' onClick={localCloseHandler}>
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
        <Button theme='secondary' icon='close-line' onClick={localCloseHandler}>
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
        <h1 className={styles.title}>업로드하려면 YouTube 연동이 필요해요.</h1>

        <p className={styles.description}>
          계속하기 전에, 감람스톤에서 어떤 정보를 사용하고 처리하는지{' '}
          <Link href={'/privacy'} passHref>
            <a target='_blank'>개인정보 처리방침</a>
          </Link>
          에서 알아보세요.<br></br>연동은 로그아웃할 때 끊어져요.
        </p>
      </div>

      <div className={styles.actions}>
        <Button theme='secondary' icon='close-line' onClick={localCloseHandler}>
          닫기
        </Button>
        <Button
          theme='primary'
          icon='login-box-line'
          onClick={() =>
            signIn(
              'google',
              undefined,
              window.location.href.indexOf('?wak') > -1
                ? {
                    scope:
                      'openid profile https://www.googleapis.com/auth/youtube.force-ssl',
                    prompt: 'select_account',
                  }
                : {
                    scope:
                      'openid profile https://www.googleapis.com/auth/youtube.force-ssl',
                  }
            )
          }
        >
          연동하기
        </Button>
      </div>

      <div className={styles.warn}>
        처음 로그인 시 이메일이 노출될 수 있어요. 버튼을 누르기 전에 방송 화면을 잠시
        가려주세요.
      </div>
    </PopupTab>
  )

  return (
    <div className={styles.popupWrapper} data-closing={closing}>
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
          step !== 1 && localCloseHandler()
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
          duration: 0.45,
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
