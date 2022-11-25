import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Footer from '../components/Footer'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Error.module.scss'
import { classes } from '../utils/string'

const ErrorMessages: Record<string, string> = {
  AccessDenied: '접근이 거부되었습니다.',
  NoYouTubePermission:
    '크리에이터 권한 없이는 YouTube 권한을 받을 수 없습니다.',
    YouTubePermissionError:
    '크리에이터 권한 검증 중에 오류가 발생하였습니다.',
  Banned: '차단되었습니다.',
  FailedToCreateUser: '계정을 생성할 수 없습니다. 관리자에게 문의하세요.',
}

const Error404: NextPage = () => {
  const router = useRouter()

  const error = router.query.error as string

  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      router.replace('/')
    }
  }, [router, session])

  return (
    <div className={styles.container}>
      <Head>
        <title>로그인 오류 - 감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.main)}>
          <div className={styles.contents}>
            <h1 className={styles.title}>로그인 오류</h1>
            <p className={styles.description}>
              {(error && ErrorMessages[error]) || '알 수 없는 오류입니다.'}
            </p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Error404
