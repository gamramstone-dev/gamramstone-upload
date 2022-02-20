import Link from 'next/link'
import pageStyles from '../styles/page.module.scss'
import { classes } from '../utils/string'

export const Footer = () => {
  return (
    <div className={pageStyles.footer}>
      <div className={pageStyles.contents}>
        <h3 className={pageStyles.logo}>GAMRAMSTONE</h3>
        <Link href='/privacy'>Privacy Policy - 개인정보 처리방침</Link>
        <br></br>
        <div className={classes(pageStyles.mute, pageStyles.description)}>
          Brought you here by GamramStone team.<br></br>Site source codes are available on{' '}
          <Link href='https://github.com/So-chiru/gamramstone'>here</Link>
          <br></br>
          <br></br>
          Email: gamramstone<span className={pageStyles.hidden}>no_spam</span>@wesub.io
        </div>
      </div>
    </div>
  )
}

export default Footer
