import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { Channel, ChannelID, Channels } from '../../structs/channels'
import useSWR from 'swr'

import pageStyles from '../../styles/page.module.scss'
import styles from '../../styles/pages/Channel.module.scss'
import { classes } from '../../utils/string'
import { TabButton, TabGroup } from '../../components/Tabs'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { APIResponse } from '../../structs/api'
import { VideoWithCaption, WorkStatus } from '../../structs/airtable'
import { LoadSpinner } from '../../components/Loading'
import VideoProjectCard from '../../components/VideoCard'
import FadeInImage from '../../components/FadeInImage'
import { Button } from '../../components/Button'
import ProcessPopup from '../../components/ProcessPopup'
import toast from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Footer from '../../components/Footer'

import getConfig from 'next/config'
import { CustomUseSession, SessionData } from '../../structs/setting'
import { isUploadable } from '../../utils/client/requests'
import { useRouter } from 'next/router'

const { publicRuntimeConfig } = getConfig()

interface ChannelCardProps {
  channel: Channel
}

const ChannelCard = ({ channel }: ChannelCardProps) => {
  return (
    <div className={styles.channelCard}>
      <div className={styles.contents}>
        <div className={styles.member}>
          <div className={styles.image}>
            <FadeInImage src={channel.image} width={75} height={75} />
          </div>
          <h1 className={styles.name}>{channel.name}</h1>
        </div>
        {/* <div className={styles.progress}>
          <ProgressBar barStyle='primary' progress={0.46}></ProgressBar>
        </div> */}
      </div>
    </div>
  )
}

const fetchList = async (url: string) =>
  fetch(url)
    .then(res => (res.json() as unknown) as APIResponse<VideoWithCaption[]>)
    .then(v => {
      if (v.status === 'error') {
        throw new Error(v.message)
      }

      return v.data
    })

interface ChannelPageProps {
  id: ChannelID
}

const Tabs: WorkStatus[] = ['waiting', 'done', 'wip']

const RandomImages = ({ id }: { id: ChannelID }) => {
  const randomValue = Math.random()

  const [ratio, setRatio] = useState(1)

  return (
    <>
      <div className={styles.image}>
        <FadeInImage
          src={
            EmptyImages[id][Math.floor(randomValue * EmptyImages[id].length)] ||
            '/empty.png'
          }
          layout='fixed'
          alt='no image'
          width={150}
          height={150 * ratio}
          onLoadingComplete={result =>
            setRatio(result.naturalHeight / result.naturalWidth)
          }
        ></FadeInImage>
      </div>
      <h3>
        {EmptyTexts[id][Math.floor(randomValue * EmptyTexts[id].length)] ||
          '대기 중인 영상이 없어요!'}
      </h3>
    </>
  )
}

const EmptyImages: Record<ChannelID, string[]> = {
  wakgood: ['/clear/wakgood-001.gif'],
  waktaverse: ['/clear/waktaverse-001.webp'],
  ine: ['/clear/ine-001.webp', '/clear/ine-002.webp'],
  jingburger: ['/clear/jingburger-001.webp'],
  lilpa: ['/clear/lilpa-001.jpg'],
  jururu: ['/clear/jururu-001.webp', '/clear/jururu-002.webp'],
  gosegu: ['/clear/gosegu-001.webp'],
  viichan: ['/clear/viichan-001.png', '/clear/viichan-002.png'],
}

const EmptyTexts: Record<ChannelID, ReactNode[]> = {
  wakgood: ['업로드 완료 킹아~', '이야야야야야야 넥슬라이스'],
  waktaverse: ['자막 업로드 감사띠~'],
  ine: ['전부 업로드 완료~ 고막따네'],
  jingburger: ['전부 왕업로드 사건...! 감사합니다~'],
  lilpa: ['자막 전부 터졌다! 감사합니다~', 'ㄱㅇㅇ'],
  jururu: [
    '업로드 완료... 감사 하달까나...?',
    '자막이 안올라오는건... 상하차 알바라던지...... ㄱ..그런건 아니니까 걱정말구..!!!!',
    '오늘 자막 휴식',
  ],
  gosegu: ['전부 업로드 완료! 감사합니다~ 킹아~~~ ^ㅁ^'],
  viichan: [
    '탸니탸니 전부 업로드 완료~ 감사합니다~',
    <span key='no-movie' className={styles.tanoshii}>
      자막 없다
    </span>,
  ],
}

const ChannelPage: NextPage<ChannelPageProps> = ({ id }) => {
  const [tabIndex, setTabIndex] = useState<number>(0)
  const { data, error } = useSWR(
    `/api/lists?id=${id}&tabs=${Tabs[tabIndex]}`,
    fetchList
  )

  const { data: session } = useSession() as CustomUseSession
  const [openProcessPopup, setOpenProcessPopup] = useState<boolean>(false)
  const [needPermission, setNeedPermission] = useState<boolean>(false)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash === '#apply' &&
      session?.permissionGranted
    ) {
      setOpenProcessPopup(true)
      window.location.hash = ''
    }
  }, [session?.permissionGranted])

  return (
    <div className={styles.container}>
      <Head>
        <title>{Channels[id].name} - 감람스톤</title>
        <meta
          name='description'
          content={`이세돌, 왁타버스 번역 프로젝트 - ${Channels[id].name} 채널의 번역 페이지입니다.`}
        />
      </Head>
      <AnimatePresence>
        {openProcessPopup && data && session && (
          <ProcessPopup
            token={session.accessToken}
            data={data}
            noPermission={needPermission}
            close={() => {
              setOpenProcessPopup(false)
              setNeedPermission(false)
            }}
          ></ProcessPopup>
        )}
      </AnimatePresence>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents)}>
          <ChannelCard channel={Channels[id]}></ChannelCard>
        </div>
        <div className={classes(pageStyles.contents, pageStyles.overflowX)}>
          <div className={styles.tabHeader}>
            <TabGroup activeIndex={tabIndex} setActiveIndex={setTabIndex}>
              <TabButton key='waiting'>업로드 대기 중</TabButton>
              <TabButton key='done'>업로드 완료</TabButton>
              <TabButton key='ongoing'>번역 진행 중</TabButton>
            </TabGroup>
            <div className={styles.actions}>
              {// TODO: 적용 업데이트 완료시 false 삭제
              tabIndex === 0 && !publicRuntimeConfig.hideApplyButton && (
                <Button
                  size='large'
                  disabled={!session}
                  icon='upload-line'
                  onClick={() =>
                    data && data.length
                      ? isUploadable(
                          session,
                          () => {
                            setOpenProcessPopup(true)
                          },
                          () => {
                            window.location.hash = 'apply'
                            setOpenProcessPopup(true)
                            setNeedPermission(true)
                          }
                        )
                      : toast('업로드 대기 중인 영상이 없어요.')
                  }
                >
                  전체 적용 {!session ? '(로그인 필요)' : undefined}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className={classes(pageStyles.contents, styles.lists)}>
          {error instanceof Error ? (
            <div className={styles.error}>오류 : {error.message}</div>
          ) : !data ? (
            <LoadSpinner></LoadSpinner>
          ) : data.length ? (
            data.map(video => (
              <VideoProjectCard
                key={video.id}
                video={video}
                onUploadAuth={() => {
                  setOpenProcessPopup(true)
                  setNeedPermission(true)
                }}
              ></VideoProjectCard>
            ))
          ) : (
            <div className={styles.empty}>
              <div className={styles.contents}>
                <RandomImages id={id}></RandomImages>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Object.keys(Channels).map(v => ({ params: { id: v } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = ({ params }) => {
  return {
    props: {
      id: params && params.id,
    },
  }
}

export default ChannelPage
