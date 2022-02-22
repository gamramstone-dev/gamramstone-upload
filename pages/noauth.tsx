import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Error.module.scss'
import { classes } from '../utils/string'

const ErrorMessages: Record<string, string> = {
  AccessDenied:
    '등록되지 않은 계정입니다. 아래 ID를 관리자에게 알려주시면 (방송에 노출 혹은 기타 방법) 확인 후 등록하겠습니다!',
}

const Error404: NextPage = () => {
  const router = useRouter()

  const error = router.query.error as string
  const code = router.query.code as string

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
            <p className={styles.code}>가입 요청 ID : {code}</p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Error404
