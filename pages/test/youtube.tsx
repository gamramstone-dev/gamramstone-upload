import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../../styles/page.module.scss'
import styles from '../../styles/pages/Main.module.scss'
import { classes } from '../../utils/string'
import Logo from '../../components/Logo'
import { Button } from '../../components/Button'
import { getSession, useSession } from 'next-auth/react'
import { updateYouTubeTitleMetadata } from '../../utils/youtube'
import VideoProjectCard from '../../components/VideoCard'
import { useState } from 'react'
import { LanguageCode, OnWorkingLanguageCode } from '../../structs/airtable'

const Main: NextPage = () => {
  const { data: session } = useSession()

  const [youtubeId, setYouTubeID] = useState('')
  const [lang, setLang] = useState('')
  const [customTitle, setCustomTitle] = useState('asdfasdf')
  const [customDescription, setCustomDescription] = useState(
    '설명이 여기에 드갑니다'
  )

  if (!session) {
    return (
      <div className={styles.container}>
        <Head>
          <title>감람스톤</title>
        </Head>
        <div className={pageStyles.page}>
          <div className={classes(pageStyles.contents, styles.heading)}>
            <div className={styles.inner}>
              <span>이세돌 - 왁타버스 번역 프로젝트</span>
              <div className={styles.logo}>
                <Logo size={32} stroke={3}></Logo>
                <span>감람스톤</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>이세돌 - 왁타버스 번역 프로젝트</span>
            <div className={styles.logo}>
              <Logo size={32} stroke={3}></Logo>
              <span>감람스톤</span>
            </div>
          </div>
        </div>
        <div className={classes(pageStyles.contents)}>
          <h3>YouTube ID</h3>
          <input
            type='text'
            placeholder='ID'
            value={youtubeId}
            onChange={ev => setYouTubeID(ev.target.value)}
          ></input>
          <br></br>
          <h3>Language</h3>
          <input
            type='text'
            placeholder='en | ja | zh'
            value={lang}
            onChange={ev => setLang(ev.target.value)}
          ></input>
          <br></br>
          <h3>Title</h3>
          <input
            type='text'
            placeholder='Title'
            value={customTitle}
            onChange={ev => setCustomTitle(ev.target.value)}
          ></input>
          <br></br>
          <h3>Description</h3>
          <input
            type='text'
            placeholder='Description'
            value={customDescription}
            onChange={ev => setCustomDescription(ev.target.value)}
          ></input>
          <br></br>
          <h1>Test 1</h1>
          <Button
            onClick={() =>
              updateYouTubeTitleMetadata(
                youtubeId,
                session.accessToken as string,
                {
                  en: {
                    title: 'LILPA',
                    description: 'LILPA',
                  },
                }
              )
            }
          >
            유튜브 제목, 설명 업데이트 (영어)
          </Button>
          <h1>Test 2</h1>
          <VideoProjectCard
            video={{
              id: youtubeId,
              url: 'https://youtube.com/watch?v=' + youtubeId,
              title: '제목',
              description: '설명',
              uploadDate: '날짜',
              captions: [
                {
                  language: lang as OnWorkingLanguageCode,
                  status: 'waiting',
                  title: customTitle,
                  description: customDescription,
                  captions: [],
                },
              ],
            }}
          ></VideoProjectCard>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      session: await getSession(ctx),
    },
  }
}

export default Main
