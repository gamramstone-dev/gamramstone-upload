import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/components/Error.module.scss'
import { Button } from './Button'

interface ErrorComponentProps {
  error: Error
  retry?: () => void
}

export const ErrorComponent = ({ error, retry }: ErrorComponentProps) => {
  return (
    <div className={styles.error}>
      <div className={styles.image}>
        <Image src='/segupp.png' alt='뻘줌 세구' layout='fill'></Image>
      </div>
      <div className={styles.container}>
        <div className={styles.message}>{error.message}</div>
        <div className={styles.buttons}>
          <Button
            icon='server-line'
            onClick={() => window.open('https://status.wesub.io', '_blank')}
          >
            서버 상태 보기
          </Button>
          {retry && (
            <Button icon='refresh-line' onClick={retry}>
              재시도
            </Button>
          )}
        </div>
        <p className={styles.muted}>
          팬아트 출처: 루르루 (https://cafe.naver.com/steamindiegame/4229156)
        </p>
      </div>
    </div>
  )
}

export default ErrorComponent
