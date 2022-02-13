import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Channel, ChannelID, Channels } from '../structs/channels'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Channel.module.scss'
import Error404 from './404'
import { classes } from '../utils/string'
import ProgressBar from '../components/ProgressBar'
import Image from 'next/image'
import { TabButton, TabGroup } from '../components/Tabs'
import { useState } from 'react'

interface ChannelCardProps {
  channel: Channel
}

const ChannelCard = ({ channel }: ChannelCardProps) => {
  return (
    <div className={styles.channelCard}>
      <div className={styles.contents}>
        <div className={styles.member}>
          <div className={styles.image}>
            <Image
              src={channel.image}
              alt={channel.name}
              width={75}
              height={75}
            />
          </div>
          <h1 className={styles.name}>{channel.name}</h1>
        </div>
        <div className={styles.progress}>
          <ProgressBar barStyle='primary' progress={0.46}></ProgressBar>
        </div>
      </div>
    </div>
  )
}

const ChannelPage: NextPage = () => {
  const router = useRouter()
  const [tabIndex, setTabIndex] = useState<number>(1)

  if (
    typeof router.query.id !== 'string' ||
    router.query.id in Channels === false
  ) {
    return <Error404 />
  }

  const channel = Channels[router.query.id as ChannelID]

  return (
    <div className={styles.container}>
      <Head>
        <title>감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents)}>
          <ChannelCard channel={channel}></ChannelCard>
        </div>
        <div className={classes(pageStyles.contents)}>
          <TabGroup activeIndex={tabIndex} setActiveIndex={setTabIndex}>
            <TabButton>전체</TabButton>
            <TabButton>업로드 대기 중</TabButton>
            <TabButton>업로드 완료</TabButton>
            <TabButton>번역 진행 중</TabButton>
          </TabGroup>
        </div>
      </div>
    </div>
  )
}

export default ChannelPage
