import { NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Account.module.scss'
import { classes } from '../utils/string'
import { useSession } from 'next-auth/react'

const Account: NextPage = () => {
  const { data: session } = useSession()

  return (
    <div className={styles.container}>
      <Head>
        <title>계정 관리 - 감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>{session?.user?.name}님,</span>
            <span>안녕하세요!</span>
          </div>
        </div>
        <div className={classes(pageStyles.contents)}>
          <p>안녕하세요.</p>
        </div>
      </div>
    </div>
  )
}

export default Account
