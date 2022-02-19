import Link from 'next/link'
import styles from '../styles/components/Header.module.scss'
import { Button } from './Button'

import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

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
            <div
              className={styles.user}
              onClick={() => router.push('/account')}
            >
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
              // onClick={() =>
              //   toast.error(
              //     '아직 로그인 기능이 준비되지 않았습니다. 업데이트 공지가 뜨면 사용해주세요!'
              //   )
              // }
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
