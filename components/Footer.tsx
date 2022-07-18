import getConfig from 'next/config'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import pageStyles from '../styles/page.module.scss'
import { classes } from '../utils/string'

export const Footer = () => {
  const { publicRuntimeConfig } = getConfig()
  const { i18n } = useTranslation()

  return (
    <div className={pageStyles.footer}>
      <div className={pageStyles.contents}>
        <h3 className={pageStyles.logo}>GAMRAMSTONE</h3>
        <Link href='/privacy'>Privacy Policy - 개인정보 처리방침</Link>
        <br></br>
        <div className={classes(pageStyles.mute, pageStyles.description)}>
          Brought you here by GamramStone with ♥.<br></br>Site source codes are
          available on{' '}
          <Link href='https://github.com/So-chiru/gamramstone'>here</Link>.
          <br></br>
          <br></br>
          <div className={pageStyles.languages}>
            <a onClick={() => i18n.changeLanguage('en')}>English</a>
            <a onClick={() => i18n.changeLanguage('ko')}>한국어</a>
          </div>
          <br></br>
          Email: gamramstone<span className={pageStyles.hidden}>no_spam</span>
          @wesub.io
          <br></br>
          <br></br>
          Build:{' '}
          {process.env.NODE_ENV === 'development'
            ? `local build`
            : `#${publicRuntimeConfig.gitHash} on ${publicRuntimeConfig.gitBranch} (${publicRuntimeConfig.gitMessage}) by ${publicRuntimeConfig.gitUser}`}
        </div>
      </div>
    </div>
  )
}

export default Footer
