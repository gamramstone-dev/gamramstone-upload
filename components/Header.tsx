import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/components/Header.module.scss'
import { Button } from './Button'

import { useSession, signIn, signOut } from 'next-auth/react'

export const Header = () => {
  const router = useRouter()
  const { data: session } = useSession()

  console.log(session)

  return (
    <header className={styles.header}>
      <div className={styles.contents}>
        <div className={styles.logo}>
          <Link href={'/'}>GAMRAMSTONE</Link>
        </div>
        <div className={styles.actions}>
          {session ? (
            session.user?.name
          ) : (
            <Button
              size='medium'
              roundness={16}
              onClick={() =>
                signIn('google', {
                  scope: 'auth/youtube.force-ssl',
                })
              }
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
