import { AnimatePresence, Variants } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  captionPreviewSelector,
  openCaptionPreviewAtom,
} from '../structs/captionPreview'
import styles from '../styles/components/CaptionPreview.module.scss'

import { motion } from 'framer-motion'
import YouTube, { YouTubeProps } from 'react-youtube'
import { useBodyLock } from '../hooks/styles'

import captionParser, { CaptionLine } from '../utils/captionParser'
import { LoadSpinner } from './Loading'
import { LanguageNames, OnWorkingLanguageCode } from '../structs/common'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

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

const useTimeSync = (caption: CaptionLine[] | null, target: any) => {
  const [index, setIndex] = useState<number>(-1)

  useEffect(() => {
    if (!caption) {
      return
    }

    const func = () => {
      if (!target || !caption || !caption.length) {
        return
      }

      const time = target.getCurrentTime()

      if (time < caption[0].start && index !== -1) {
        setIndex(-1)
        return
      }

      for (let i = 0; i < caption.length; i++) {
        if (time > caption[i].start && time < caption[i].end) {
          if (index !== i) {
            setIndex(i)
          }

          break
        }

        if (time < caption[i].start) {
          break
        }
      }
    }

    const interval = setInterval(func, 33)

    func()

    return () => {
      clearInterval(interval)
    }
  }, [index, caption, target])

  return index
}

const useCaptionData = (filename: string, url: string) => {
  const [rawData, setRawData] = useState<string | null>(null)
  const [caption, setCaption] = useState<CaptionLine[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchCaption = async () => {
      try {
        setIsLoading(true)
        setError('')
        setRawData('')

        const response = await fetch(url)
        const data = await response.text()

        const parsedData = captionParser.parse(filename, data)

        setRawData(data)
        setCaption(parsedData)
        setError('')
        setIsLoading(false)
      } catch (error) {
        setCaption(null)
        setRawData('')
        setError((error as Error).message)
        setIsLoading(false)
      }
    }

    fetchCaption()
  }, [filename, url])

  return { caption, isLoading, error, rawData }
}

export const CaptionPreview = () => {
  const preview = useRecoilValue(captionPreviewSelector)
  const openState = useSetRecoilState(openCaptionPreviewAtom)
  const { t } = useTranslation()

  const [closing, setClosing] = useState(false)
  const [player, setPlayer] = useState<any>(null)

  const { caption, isLoading, error, rawData } = useCaptionData(
    preview.details.title,
    preview.details.file
  )

  useBodyLock(!closing && preview.open)

  const captionIndex = useTimeSync(caption, player)

  const localCloseHandler = useCallback(() => {
    if (!preview.open) {
      return
    }

    setClosing(true)
    openState(false)
  }, [openState, preview.open])

  useEffect(() => {
    if (!preview.open) {
      return
    }

    setClosing(false)
  }, [preview.open])

  const youtubeOnReady: YouTubeProps['onReady'] = useCallback(event => {
    setPlayer(event.target)
  }, [])

  const captionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = captionRef.current?.querySelector(
      `.${styles.caption} .${styles.line}[data-index='${captionIndex}']`
    )

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [captionIndex])

  return (
    <AnimatePresence>
      {preview.open && (
        <div className={styles.captionPreview} data-closing={closing}>
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
              localCloseHandler()
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
            <YouTube
              className={styles.player}
              videoId={preview.details.video}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  cc_load_policy: 1,
                  autoplay: 1,
                  modestbranding: 1,
                },
              }}
              onReady={youtubeOnReady}
            ></YouTube>
            {preview.details.file.endsWith('.ytt') ? (
              <div className={styles.frame}>
                <div className={styles.caption} ref={captionRef}>
                  <h1 className={styles.title}>
                    {player ? player.playerInfo.videoData.title : t('loading')}
                    {preview.details.lang
                      ? ` [${
                          LanguageNames[
                            preview.details.lang as OnWorkingLanguageCode
                          ]
                        }]`
                      : ''}
                  </h1>
                  <p className={styles.error}>{t('cannot_preview_ytt')}</p>
                </div>
              </div>
            ) : (
              <div className={styles.frame}>
                <div className={styles.caption} ref={captionRef}>
                  <h1 className={styles.title}>
                    {player ? player.playerInfo.videoData.title : t('loading')}
                    {preview.details.lang
                      ? ` [${
                          LanguageNames[
                            preview.details.lang as OnWorkingLanguageCode
                          ]
                        }]`
                      : ''}
                  </h1>
                  {isLoading ? (
                    <LoadSpinner></LoadSpinner>
                  ) : error ? (
                    <p className={styles.error}>
                      {t('error')} : {error}
                    </p>
                  ) : (
                    <div className={styles.lines}>
                      {caption &&
                        caption.map((v, i) => (
                          <div
                            key={`caption-${v.text}-${i}`}
                            data-index={i}
                            className={styles.line}
                            data-active={i === captionIndex}
                            onClick={() => player && player.seekTo(v.start)}
                          >
                            <div className={styles.time}>
                              {v.start.toFixed(3)} &gt; {v.end.toFixed(3)}
                            </div>
                            <span className={styles.text}>{v.text}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CaptionPreview
