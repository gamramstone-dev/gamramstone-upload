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
} from '../structs/common'
import styles from '../styles/components/VideoCard.module.scss'
import {
  applyCaptions,
  isUploadable,
  updateVideoState,
} from '../utils/client/requests'
import { useDeviceWidthLimiter } from '../hooks/styles'
import { classes, getYouTubeId } from '../utils/string'
import { Button } from './Button'
import FadeInImage from './FadeInImage'
import { TabButton, TabGroup } from './Tabs'

import confetties from '../utils/client/confetties'

import getConfig from 'next/config'
import Link from 'next/link'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { uploadInProgressAtom } from '../structs/uploadState'
import {
  captionPreviewDetailsAtom,
  openCaptionPreviewAtom,
} from '../structs/captionPreview'

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
      unoptimized
      alt='YouTube 썸네일'
      onError={() => !error && setError(true)}
      layout='fill'
    />
  )
}

interface VideoCardProps {
  video: VideoWithCaption
  onTagClick?: (tag: number) => void
  onClick?: () => void
}

export const VideoCard = ({ video, onClick, onTagClick }: VideoCardProps) => {
  return (
    <div className={styles.videoCard} onClick={() => onClick && onClick()}>
      <div className={styles.thumbnail}>
        <YouTubeThumbnail id={getYouTubeId(video.url)}></YouTubeThumbnail>
      </div>
      <div className={styles.metadata}>
        <div className={styles.title}>
          <h3>{video.title}</h3>
          <div className={styles.tags}>
            {video.captions.map((v, i) => (
              <p
                className={styles.status}
                onClick={ev => {
                  if (!onTagClick) {
                    return
                  }

                  ev.stopPropagation()
                  onTagClick(i)
                }}
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
  defaultTabIndex?: number
  open?: boolean
  onUploadAuth?: () => void
  onUpload?: (id: [string, LanguageCode][]) => void
  onCaptionPreview?: (url: string, label: string) => void
}

const ToastOption = {
  style: {
    padding: '16px 32px',
  },
}

const ErrorToastOption = {
  style: {
    background: 'var(--color-error-container, #f00)',
    color: 'var(--color-error, #fff)',
  },
}

export const CaptionCard = ({
  languages,
  video,
  open,
  defaultTabIndex = 0,
  onUploadAuth,
  onUpload,
}: CaptionCardProps) => {
  const [tabIndex, setTabIndex] = useState<number>(defaultTabIndex || 0)

  useEffect(() => {
    setTabIndex(defaultTabIndex)
  }, [defaultTabIndex])

  const { data: session } = useSession()

  const copy = useCallback((text: string, label: string) => {
    if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
      navigator.clipboard.writeText(text)

      toast.success(`${label}을 클립보드에 복사했어요.`, ToastOption)

      return
    }

    toast.error(
      '이 브라우저는 복사를 지원하지 않아요. 크롬에서 실행해주세요.',
      ErrorToastOption
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

  const setOpenPreview = useSetRecoilState(openCaptionPreviewAtom)
  const setPreviewDetails = useSetRecoilState(captionPreviewDetailsAtom)

  const preview = useCallback(
    (url: string, label: string, lang: LanguageCode) => {
      setOpenPreview(true)
      setPreviewDetails({
        title: label,
        file: url,
        video: getYouTubeId(video.url),
        lang,
      })
    },
    [setOpenPreview, setPreviewDetails, video.url]
  )

  const [isUploading, setUploading] = useRecoilState(uploadInProgressAtom)

  const applyTitleDescription = useCallback(
    async (
      language: LanguageCode,
      id: string,
      title: string,
      description: string,
      captions?: CaptionFile[] | null
    ) => {
      if (!session || typeof session.accessToken !== 'string') {
        toast.error('로그인 해주세요.', ErrorToastOption)
        return
      }

      if (isUploading) {
        toast.error('다른 자막이 업로드 중입니다.', ErrorToastOption)
        return
      }

      setUploading(true)

      const loadingToast = toast.loading('업로드 중...', ToastOption)
      const isTest = window.location.href.indexOf('devMode') > -1

      try {
        await (isTest
          ? (async () => new Promise(resolve => setTimeout(resolve, 2000)))()
          : applyCaptions(
              session.accessToken,
              language,
              id,
              title,
              description,
              captions
            ))

        await updateVideoState(language, [id], isTest)

        toast.success('성공적으로 적용했어요!')
        confetties.fireworks(750)

        if (onUpload) {
          onUpload([[id, language]])
        }
      } catch (e) {
        toast.error((e as Error).message, ErrorToastOption)
      }

      toast.dismiss(loadingToast)

      setUploading(false)
    },
    [isUploading, onUpload, session, setUploading]
  )

  const narrow = useDeviceWidthLimiter(768)

  return (
    <AnimateSharedLayout>
      <div className={styles.captionCard} data-open={open}>
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
                    disabled={
                      session?.userState !== 'translator' &&
                      session?.userState !== 'admin' &&
                      v.status !== 'waiting' &&
                      v.status !== 'done'
                    }
                  >
                    {LanguageNames[v.language]}
                  </TabButton>
                ))}
              </TabGroup>
              {typeof languages[tabIndex] !== 'undefined' ? (
                session?.userState !== 'translator' &&
                session?.userState !== 'admin' &&
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
                          <Button icon='link'>자막 수동 적용</Button>
                        </a>
                        {(!publicRuntimeConfig.hideApplyButton ||
                          session?.userState === 'admin') && (
                          <Button
                            icon='file-upload-line'
                            onClick={() =>
                              isUploadable(
                                session,
                                () =>
                                  applyTitleDescription(
                                    languages[tabIndex].language,
                                    getYouTubeId(video.url),
                                    languages[tabIndex].title,
                                    languages[tabIndex].description,
                                    video.captions.find(
                                      v =>
                                        v.language ===
                                        languages[tabIndex].language
                                    )?.captions
                                  ),
                                onUploadAuth
                              )
                            }
                          >
                            자막 자동 적용
                          </Button>
                        )}
                        <a href={video.url} target='_blank' rel='noreferrer'>
                          <Button icon='youtube-fill'>YouTube 열기</Button>
                        </a>
                      </div>
                    </div>
                    <div className={styles.row}>
                      <h3 className={styles.title}>상태</h3>
                      <p>{WorkStatusNames[languages[tabIndex].status]}</p>
                    </div>
                    {
                      <div className={styles.row}>
                        <h3 className={styles.title}>자막 파일</h3>
                        <div className={styles.value} key={`tab-files-${tabIndex}`}>
                          {languages[tabIndex].captions &&
                          languages[tabIndex].captions.length ? (
                            languages[tabIndex].captions.map((v, i) => (
                              <Button
                                icon='download-line'
                                title='오른쪽 클릭 시 자막을 미리봅니다.'
                                key={`file-${v.filename}-idx-${i}`}
                                onClick={() => download(v.url, v.filename)}
                                onContext={() =>
                                  preview(
                                    v.url,
                                    v.filename,
                                    languages[tabIndex].language
                                  )
                                }
                              >
                                {v.filename}
                              </Button>
                            ))
                          ) : (
                            <span className={styles.muted}>자막 파일 없음</span>
                          )}
                        </div>
                      </div>
                    }
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
                    {session?.userState === 'admin' ||
                    session?.userState === 'translator' ? (
                      <div className={styles.row}>
                        <h3 className={styles.title}>Details</h3>
                        <p className={styles.debug}>
                          Video ID : {video.id}
                          <br></br>
                          YouTube Link :{' '}
                          <Link href={video.url}>{video.url}</Link>
                          <br></br>
                          Upload Date:{' '}
                          {new Date(video.uploadDate).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      void 0
                    )}
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
  onUploadAuth?: () => void
  onUpload?: (id: [string, LanguageCode][]) => void
}

export const VideoProjectCard = ({
  video,
  onUploadAuth,
  onUpload,
}: VideoProjectCardProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [tagIndex, setTagIndex] = useState<number>(0)

  return (
    <>
      <VideoCard
        video={video}
        onClick={() => setOpen(!open)}
        onTagClick={(index: number) => {
          !open && setOpen(true)
          setTagIndex(index)
        }}
      ></VideoCard>
      <CaptionCard
        open={open}
        defaultTabIndex={tagIndex}
        video={video}
        languages={video.captions}
        onUploadAuth={onUploadAuth}
        onUpload={onUpload}
      ></CaptionCard>
    </>
  )
}

export default VideoProjectCard
