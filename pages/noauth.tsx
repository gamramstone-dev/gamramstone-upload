import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Error.module.scss'
import { classes } from '../utils/string'

const ErrorMessages: Record<string, string> = {
  AccessDenied:
    '등록되지 않은 멤버입니다. 만약 처음 신청하신다면 잠시만 기다려주세요...',
}

const Error404: NextPage = () => {
  const router = useRouter()

  const error = router.query.error as string

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
    </div>
  )
}

export default Error404
