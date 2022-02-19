import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { Channel, ChannelID, Channels } from '../../structs/channels'
import useSWR from 'swr'

import pageStyles from '../../styles/page.module.scss'
import styles from '../../styles/pages/Channel.module.scss'
import { classes } from '../../utils/string'
import { TabButton, TabGroup } from '../../components/Tabs'
import { useState } from 'react'
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

const ChannelPage: NextPage<ChannelPageProps> = ({ id }) => {
  const [tabIndex, setTabIndex] = useState<number>(0)
  const { data, error } = useSWR(
    `/api/lists?id=${id}&tabs=${Tabs[tabIndex]}`,
    fetchList
  )

  const {data: session} = useSession()
  const [openProcessPopup, setOpenProcessPopup] = useState<boolean>(false)

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
        {openProcessPopup && data && (
          <ProcessPopup
            data={data}
            close={() => setOpenProcessPopup(false)}
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
              {tabIndex === 0 && (
                <Button
                  roundness={16}
                  disabled={!session}
                  onClick={() =>
                    data && data.length
                      ? setOpenProcessPopup(true)
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
            data.map((video, index) => (
              <VideoProjectCard key={video.id} video={video}></VideoProjectCard>
            ))
          ) : (
            <div className={styles.empty}>
              <div className={styles.contents}>
                <div className={styles.image}>
                  <FadeInImage
                    src={'/empty.png'}
                    width={150}
                    height={150}
                    alt='no image'
                  ></FadeInImage>
                </div>
                <h3>아무런 영상이 없어요.</h3>
              </div>
            </div>
          )}
        </div>
      </div>
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
