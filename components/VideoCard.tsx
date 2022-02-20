import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CaptionFile,
  LanguageCode,
  LanguageNames,
  TranslatedVideoMetadata,
  VideoWithCaption,
  WorkStatusNames,
} from '../structs/airtable'
import styles from '../styles/components/VideoCard.module.scss'
import { applyCaptions } from '../utils/clientAPI'
import { useDeviceWidthLimiter } from '../utils/react'
import { classes, getYouTubeId } from '../utils/string'
import { Button } from './Button'
import FadeInImage from './FadeInImage'
import { TabButton, TabGroup } from './Tabs'

import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

interface YouTubeThumbnailProps {
  id: string
}

export const YouTubeThumbnail = ({ id }: YouTubeThumbnailProps) => {
  const [error, setError] = useState<boolean>(false)

  return (
    <FadeInImage
      src={`https://i.ytimg.com/vi/${id}/${
        error ? 'hqdefault' : 'mqdefault'
      }.jpg`}
      alt='YouTube 썸네일'
      onError={() => !error && setError(true)}
      layout='fill'
    />
  )
}

interface VideoCardProps {
  video: VideoWithCaption
  onClick?: () => void
}

export const VideoCard = ({ video, onClick }: VideoCardProps) => {
  return (
    <div className={styles.videoCard} onClick={() => onClick && onClick()}>
      <div className={styles.thumbnail}>
        <YouTubeThumbnail id={getYouTubeId(video.url)}></YouTubeThumbnail>
      </div>
      <div className={styles.metadata}>
        <div className={styles.title}>
          <h3>{video.title}</h3>
          <div className={styles.tags}>
            {video.captions.map(v => (
              <p
                className={styles.status}
                key={`${video.id}-${v.language}`}
                data-status={v.status}
              >
                <span className={styles.name}>{LanguageNames[v.language]}</span>
                <span className={styles.value}>
                  {WorkStatusNames[v.status]}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CaptionCardProps {
  languages: TranslatedVideoMetadata[]
  video: VideoWithCaption
  open?: boolean
}

const ToastOption = {
  style: {
    padding: '16px 32px',
  },
}

export const CaptionCard = ({ languages, video, open }: CaptionCardProps) => {
  const [tabIndex, setTabIndex] = useState<number>(0)

  const { data: session } = useSession()

  const copy = useCallback((text: string, label: string) => {
    if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
      navigator.clipboard.writeText(text)

      toast.success(`${label}을 클립보드에 복사했어요.`, ToastOption)

      return
    }

    toast.error(
      '이 브라우저는 복사를 지원하지 않아요. 크롬에서 실행해주세요.',
      ToastOption
    )
  }, [])

  const download = useCallback((url: string, label: string) => {
    const id = toast.loading(`${label} 다운로드 중...`, ToastOption)

    return fetch(url)
      .then(res => res.blob())
      .then(response => {
        toast.remove(id)
        toast.success(`${label} 다운로드 완료!`, ToastOption)

        const url = window.URL.createObjectURL(response)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', label)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  }, [])

  const applyTitleDescription = useCallback(
    async (
      language: LanguageCode,
      id: string,
      title: string,
      description: string,
      captions?: CaptionFile[] | null
    ) => {
      if (!session || typeof session.accessToken !== 'string') {
        toast.error('로그인 해주세요.', ToastOption)
        return
      }

      const loadingToast = toast.loading('업로드 중...', ToastOption)

      try {
        await applyCaptions(
          session.accessToken,
          language,
          id,
          title,
          description,
          captions
        )

        toast.success('성공적으로 적용했어요!')
      } catch (e) {
        toast.error((e as Error).message, ToastOption)
      }

      toast.remove(loadingToast)
    },
    [session]
  )

  const narrow = useDeviceWidthLimiter(768)

  return (
    <AnimateSharedLayout>
      <div className={styles.captionCard}>
        <AnimatePresence>
          {open && (
            <motion.div
              className={styles.contents}
              layout
              initial={{
                opacity: 0,
                height: 0,
                margin: narrow ? '0px 32px' : '0px 64px',
              }}
              animate={{
                opacity: 1,
                height: 'auto',
                margin: narrow ? '32px 32px' : '48px 64px',
              }}
              exit={{
                opacity: 0,
                height: 0,
                margin: narrow ? '0px 32px' : '0px 64px',
              }}
            >
              <TabGroup activeIndex={tabIndex} setActiveIndex={setTabIndex}>
                {languages.map(v => (
                  <TabButton
                    key={v.language}
                    disabled={v.status !== 'waiting' && v.status !== 'done'}
                  >
                    {LanguageNames[v.language]}
                  </TabButton>
                ))}
              </TabGroup>
              {typeof languages[tabIndex] !== 'undefined' ? (
                languages[tabIndex].status === 'wip' ? (
                  <div className={styles.details}>
                    현재 자막 제작 중입니다...
                  </div>
                ) : (
                  <div className={styles.details}>
                    <div className={styles.row}>
                      <h3 className={styles.title}>작업</h3>
                      <div className={styles.value}>
                        <a
                          href={`https://studio.youtube.com/video/${getYouTubeId(
                            video.url
                          )}/translations`}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Button roundness={16}>
                            자막 적용하러 가기 (수동)
                          </Button>
                        </a>
                        {!publicRuntimeConfig.hideApplyButton && (
                          <Button
                            roundness={16}
                            disabled={session === null}
                            onClick={() =>
                              applyTitleDescription(
                                languages[tabIndex].language,
                                getYouTubeId(video.url),
                                languages[tabIndex].title,
                                languages[tabIndex].description,
                                video.captions.find(
                                  v =>
                                    v.language === languages[tabIndex].language
                                )?.captions
                              )
                            }
                          >
                            자막 자동 적용{' '}
                            {session === null ? '(로그인 필요)' : ''}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className={styles.row}>
                      <h3 className={styles.title}>상태</h3>
                      <p>{WorkStatusNames[languages[tabIndex].status]}</p>
                    </div>
                    <div className={styles.row}>
                      <h3 className={styles.title}>제목</h3>
                      <p
                        className={styles.copyable}
                        onClick={() => copy(languages[tabIndex].title, '제목')}
                      >
                        {languages[tabIndex].title}
                      </p>
                    </div>
                    <div className={styles.row}>
                      <h3 className={styles.title}>세부 정보</h3>
                      <div
                        className={classes(styles.originText, styles.copyable)}
                        onClick={() =>
                          copy(languages[tabIndex].description, '설명')
                        }
                      >
                        {languages[tabIndex].description
                          .split('\n')
                          .map((v, i) => (
                            <p key={`text-description-${i}`}>{v}</p>
                          ))}
                      </div>
                    </div>
                    {
                      <div className={styles.row}>
                        <h3 className={styles.title}>자막</h3>
                        <div className={styles.value}>
                          {languages[tabIndex].captions &&
                          languages[tabIndex].captions.length ? (
                            languages[tabIndex].captions.map(v => (
                              <Button
                                key={`file-${v.filename}`}
                                roundness={16}
                                onClick={() => download(v.url, v.filename)}
                              >
                                {v.filename} 다운로드
                              </Button>
                            ))
                          ) : (
                            <span className={styles.muted}>자막 파일 없음</span>
                          )}
                        </div>
                      </div>
                    }

                    <div className={styles.help}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='20'
                        height='20'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z' />
                      </svg>
                      <p>제목과 세부 정보는 클릭하여 복사할 수 있어요.</p>
                    </div>
                  </div>
                )
              ) : (
                <div className={styles.details}>
                  무슨 일인지 데이터가 없네요...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimateSharedLayout>
  )
}

interface VideoProjectCardProps {
  video: VideoWithCaption
}

export const VideoProjectCard = ({ video }: VideoProjectCardProps) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <VideoCard video={video} onClick={() => setOpen(!open)}></VideoCard>
      {
        <CaptionCard
          open={open}
          video={video}
          languages={video.captions}
        ></CaptionCard>
      }
    </>
  )
}

export default VideoProjectCard
