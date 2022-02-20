import { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Error.module.scss'
import { classes } from '../utils/string'

const Error404: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>404 - 감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.main)}>
          <div className={styles.contents}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.description}>페이지를 찾을 수 없어요.</p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Error404
