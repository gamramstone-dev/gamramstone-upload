import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  LanguageNames,
  TranslatedVideoMetadata,
  VideoWithCaption,
  WorkStatusNames,
} from '../structs/airtable'
import styles from '../styles/components/VideoCard.module.scss'
import { classes, getYouTubeId } from '../utils/string'
import { Button } from './Button'
import { TabButton, TabGroup } from './Tabs'

interface YouTubeThumbnailProps {
  id: string
}

export const YouTubeThumbnail = ({ id }: YouTubeThumbnailProps) => {
  const [url, setURL] = useState<string>(
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
  )
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (!error) {
      return
    }

    setURL(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
  }, [id, error])

  return (
    <Image
      src={url}
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

  return (
    <AnimateSharedLayout>
      <div className={styles.captionCard}>
        <AnimatePresence>
          {open && (
            <motion.div
              className={styles.contents}
              layout
              initial={{ opacity: 0, height: 0, margin: '0px 64px' }}
              animate={{ opacity: 1, height: 'auto', margin: '48px 64px' }}
              exit={{ opacity: 0, height: 0, margin: '0px 64px' }}
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
              <div className={styles.details}>
                <div className={styles.row}>
                  <h3 className={styles.title}>유튜브 링크</h3>
                  <div className={styles.value}>
                    <a href={video.url} target='_blank' rel='noreferrer'>
                      <Button roundness={16}>열기</Button>
                    </a>
                    <a
                      href={`https://studio.youtube.com/video/${getYouTubeId(
                        video.url
                      )}/translations`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Button roundness={16}>관리 페이지 열기</Button>
                    </a>
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
                    {languages[tabIndex].description.split('\n').map((v, i) => (
                      <p key={`text-description-${i}`}>{v}</p>
                    ))}
                  </div>
                </div>
                {languages[tabIndex].captions &&
                languages[tabIndex].captions.length ? (
                  <div className={styles.row}>
                    <h3 className={styles.title}>자막</h3>
                    <div className={styles.value}>
                      {languages[tabIndex].captions.map(v => (
                        <Button
                          key={`file-${v.filename}`}
                          roundness={16}
                          onClick={() => download(v.url, v.filename)}
                        >
                          {v.filename} 다운로드
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  undefined
                )}
              </div>
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
