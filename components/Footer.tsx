import Link from 'next/link'
import pageStyles from '../styles/page.module.scss'
import { classes } from '../utils/string'

export const Footer = () => {
  return (
    <div className={pageStyles.footer}>
      <div className={pageStyles.contents}>
        <h3 className={pageStyles.logo}>GAMRAMSTONE</h3>
        <Link href='/privacy'>Privacy Policy - 개인정보 보호 정책</Link>
        <br></br>
        <div className={classes(pageStyles.mute, pageStyles.description)}>
          brought you here by gamramstone team.<br></br>Site developed by
          Sochiru, sources are available on{' '}
          <Link href='https://github.com/So-chiru/gamramstone'>here</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
