import Link from 'next/link'
import styles from '../styles/components/Header.module.scss'
import { Button } from './Button'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import FadeInImage from './FadeInImage'
import { LoadSpinner } from './Loading'
import { useTranslation } from 'react-i18next'
import { useSignInAsk } from './SignInAsk'

export const Header = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { data: session, status } = useSession()

  const { setOpen } = useSignInAsk()

  return (
    <header className={styles.header}>
      <div className={styles.contents}>
        <div className={styles.logo}>
          <Link href={'/'}>GAMRAMSTONE</Link>
        </div>
        <div className={styles.actions}>
          {status === 'loading' ? (
            <div className={styles.loading}>
              <LoadSpinner></LoadSpinner>
            </div>
          ) : session ? (
            <div
              className={styles.user}
              onClick={() => router.push('/account')}
            >
              <div className={styles.image}>
                {session!.user?.image && (
                  <FadeInImage
                    src={session!.user!.image!}
                    width={48}
                    unoptimized
                    height={48}
                    alt={t('profile_image')}
                  />
                )}
              </div>
            </div>
          ) : (
            <Button size='medium' onClick={() => setOpen(true)}>
              {t('sign_in')}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
