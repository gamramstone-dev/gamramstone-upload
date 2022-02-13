import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/components/Header.module.scss'
import { Button } from './Button'

export const Header = () => {
  const router = useRouter()

  return (
    <header className={styles.header}>
      <div className={styles.contents}>
        <div className={styles.logo}>
          <Link href={'/'}>
            GAMRAMSTONE
          </Link>
        </div>
        <div className={styles.actions}>
          <Button
            size='medium'
            roundness={16}
            onClick={() => router.push('/api/login')}
          >
            로그인
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
