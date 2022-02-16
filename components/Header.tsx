import Link from 'next/link'
import styles from '../styles/components/Header.module.scss'
import { Button } from './Button'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <header className={styles.header}>
      <div className={styles.contents}>
        <div className={styles.logo}>
          <Link href={'/'}>GAMRAMSTONE</Link>
        </div>
        <div className={styles.actions}>
          {session ? (
            <div className={styles.user} onClick={() => router.push('/account')}>
              <div className={styles.image}>
                {session.user?.image && (
                  <Image
                    src={session.user?.image}
                    width={48}
                    height={48}
                    alt='프로필 이미지'
                  />
                )}
              </div>
            </div>
          ) : (
            <Button
              size='medium'
              roundness={16}
              onClick={() => signIn('google')}
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
