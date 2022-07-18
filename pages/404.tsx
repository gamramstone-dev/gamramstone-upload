import { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import Footer from '../components/Footer'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Error.module.scss'
import { classes } from '../utils/string'

const Error404: NextPage = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <Head>
        <title>404 - {t('gamramstone')}</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.main)}>
          <div className={styles.contents}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.description}>{t('page_not_found')}</p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Error404
