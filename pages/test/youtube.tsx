import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../../styles/page.module.scss'
import styles from '../../styles/pages/Main.module.scss'
import { classes } from '../../utils/string'
import Logo from '../../components/Logo'
import { Button } from '../../components/Button'
import { getSession, useSession } from 'next-auth/react'
import {
  updateYouTubeTitleMetadata,
  uploadYouTubeCaption,
} from '../../utils/youtube'
import VideoProjectCard from '../../components/VideoCard'
import { useState } from 'react'
import { LanguageCode, OnWorkingLanguageCode } from '../../structs/common'
import { useRouter } from 'next/router'

const YouTubeTestPage: NextPage = props => {
  const router = useRouter()

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/')
    },
  })

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

  const getExampleCaptionFile = () => {
    return fetch(
      'https://dl.airtable.com/.attachments/569855d0f3c8f60da63f2b55a2914a65/e62a26d7/--Shorts.srt'
    ).then(v => v.blob())
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
                  [lang]: {
                    title: 'LILPA',
                    description: 'LILPA',
                  },
                }
              )
            }
          >
            유튜브 제목, 설명 업데이트 ({lang})
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
                  captions: [
                    {
                      filename: '영어-But_You_Want_More_-_Original_Song.ytt',
                      size: 376064,
                      url:
                        'https://dl.airtable.com/.attachments/8838dde1539bbcf74c6abb838e0e97d1/563c5a20/-But_You_Want_More_-_Original_Song.ytt',
                      type: 'text/plain',
                    },
                  ],
                },
              ],
            }}
          ></VideoProjectCard>
          <h1>Test 3</h1>
          <Button
            onClick={async () =>
              uploadYouTubeCaption(
                youtubeId,
                session.accessToken as string,
                lang as LanguageCode,
                await getExampleCaptionFile()
              )
            }
          >
            유튜브 캡션 업데이트 ({lang})
          </Button>
          <h1>Test 2</h1>
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

export default YouTubeTestPage
